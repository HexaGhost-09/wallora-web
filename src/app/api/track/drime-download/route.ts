import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { apkVersions } from "@/lib/db/schema";
import { trackDownload } from "@/lib/db/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DRIME_ORIGIN = "https://app.drime.cloud";
const DRIME_API = `${DRIME_ORIGIN}/api/v1`;
const GITHUB_RELEASES = "https://api.github.com/repos/HexaGhost-09/wallora-2/releases/tags";
const DRIME_FOLDER = "wallora";

type DrimeEntry = {
  id?: string | number;
  name?: string;
  file_name?: string;
  hash?: string;
  url?: string;
  type?: string;
  created_at?: string;
  updated_at?: string;
};

type DrimeListing = {
  data?: DrimeEntry[];
  current_page?: number;
  last_page?: number;
};

async function listDrimeEntries(token: string, parentId?: string | number): Promise<DrimeEntry[]> {
  const allEntries: DrimeEntry[] = [];

  for (let page = 1; page <= 200; page += 1) {
    const listUrl = new URL(`${DRIME_API}/drive/file-entries`);
    // Drime API filters folder contents with parentIds in the personal workspace.
    listUrl.searchParams.set("workspaceId", "0");
    if (parentId !== undefined) listUrl.searchParams.set("parentIds", String(parentId));
    listUrl.searchParams.set("page", String(page));
    listUrl.searchParams.set("perPage", "100");

    const response = await fetch(listUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Drime file listing failed:", response.status, detail);
      throw new Error(`Drime file listing failed (HTTP ${response.status})`);
    }

    const listing = await response.json() as DrimeListing;
    const entries = Array.isArray(listing.data) ? listing.data : [];
    allEntries.push(...entries);

    const currentPage = Number(listing.current_page || page);
    const lastPage = Number(listing.last_page || 0);
    if (entries.length === 0 || (lastPage > 0 && currentPage >= lastPage)
      || (lastPage === 0 && entries.length < 100)) {
      break;
    }
  }

  return allEntries;
}

export async function GET(req: NextRequest) {
  const version = req.nextUrl.searchParams.get("version")?.trim();
  const filename = req.nextUrl.searchParams.get("filename")?.trim();
  const token = process.env.DRIME_TOKEN?.trim();

  if (!version || !filename || filename.length > 255 || /[\\/\0]/.test(filename)) {
    return NextResponse.json({ error: "Invalid release or filename." }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json(
      { error: "Drime Server 2 is not configured. Add DRIME_TOKEN to the website environment." },
      { status: 503 }
    );
  }

  let stage = "validating GitHub release";
  try {
    // Only allow downloads for assets that belong to a real Wallora release.
    const releaseResponse = await fetch(
      `${GITHUB_RELEASES}/${encodeURIComponent(version)}`,
      { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" }
    );
    if (!releaseResponse.ok) {
      return NextResponse.json({ error: "GitHub release not found." }, { status: 404 });
    }

    const release = await releaseResponse.json();
    const validAsset = Array.isArray(release.assets)
      && release.assets.some((asset: { name?: string }) => asset.name === filename);
    if (!validAsset) {
      return NextResponse.json({ error: "File is not part of this Wallora release." }, { status: 404 });
    }

    // Find the "wallora" folder in the Drime personal workspace root.
    stage = "listing Drime root";
    const rootEntries = await listDrimeEntries(token);
    const folder = rootEntries.find((entry) =>
      entry.type === "folder" && entry.name?.toLowerCase() === DRIME_FOLDER
    );

    if (!folder?.id) {
      return NextResponse.json(
        { error: 'Folder "wallora" was not found in the root of your Drime Drive.' },
        { status: 404 }
      );
    }

    const releaseFolderName = version.replace(/^v/i, "");
    stage = `listing Drime release folder ${releaseFolderName}`;
    const walloraEntries = await listDrimeEntries(token, folder.id);
    const releaseFolder = walloraEntries.find((entry) =>
      entry.type === "folder" && entry.name?.toLowerCase() === releaseFolderName.toLowerCase()
    );

    if (!releaseFolder?.id) {
      return NextResponse.json(
        { error: `Release folder "${releaseFolderName}" was not found inside Drime/wallora/.` },
        { status: 404 }
      );
    }

    stage = `listing Drime version folder ${releaseFolder.id}`;
    const folderEntries = await listDrimeEntries(token, releaseFolder.id);
    const matches = folderEntries.filter((entry) =>
      (entry.name === filename || entry.file_name === filename)
      && entry.type !== "folder"
      && entry.url
    );

    if (matches.length === 0) {
      return NextResponse.json(
        { error: `File not found inside Drime/wallora/: ${filename}` },
        { status: 404 }
      );
    }

    // If duplicate names exist, prefer the most recently updated entry.
    matches.sort((a, b) =>
      Date.parse(b.updated_at || b.created_at || "") - Date.parse(a.updated_at || a.created_at || "")
    );
    const entry = matches[0];

    // Drime returns the actual download URL in each file-entry.
    const downloadUrl = new URL(entry.url!, DRIME_ORIGIN);
    if (downloadUrl.protocol !== "https:") {
      return NextResponse.json({ error: "Drime returned an invalid download URL." }, { status: 502 });
    }

    const downloadHeaders = new Headers();
    if (downloadUrl.hostname === "app.drime.cloud") {
      downloadHeaders.set("Authorization", `Bearer ${token}`);
    }

    stage = `downloading Drime file ${filename}`;
    const fileResponse = await fetch(downloadUrl, {
      headers: downloadHeaders,
      cache: "no-store",
      redirect: "follow",
    });

    if (!fileResponse.ok || !fileResponse.body) {
      const detail = await fileResponse.text();
      console.error("Drime file download failed:", fileResponse.status, detail);
      return NextResponse.json(
        { error: `Drime file download failed (HTTP ${fileResponse.status}).` },
        { status: 502 }
      );
    }

    // Store Server 2 downloads in the same Neon downloads table, tagged by source.
    try {
      const [dbRelease] = await db
        .select({ id: apkVersions.id })
        .from(apkVersions)
        .where(eq(apkVersions.versionName, version))
        .limit(1);
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
      const ua = req.headers.get("user-agent") || "unknown";
      await trackDownload(dbRelease?.id ?? null, ip, `drime:${ua}`);
    } catch (error) {
      console.error("Drime download analytics unavailable:", error);
    }

    const headers = new Headers({
      "Content-Type": fileResponse.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    const contentLength = fileResponse.headers.get("content-length");
    if (contentLength) headers.set("Content-Length", contentLength);

    return new NextResponse(fileResponse.body, { status: 200, headers });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`Drime Server 2 download failed during ${stage}:`, detail);
    return NextResponse.json(
      {
        error: "Drime Server 2 request failed.",
        stage,
        detail,
      },
      { status: 502 }
    );
  }
}
