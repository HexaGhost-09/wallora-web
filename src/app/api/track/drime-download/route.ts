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

type DrimeEntry = {
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

    const authHeaders = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };

    // Omitting workspaceId lists the personal Drive. workspaceId=0 is not
    // needed for the root and can cause the API to return an empty listing.
    const matches: DrimeEntry[] = [];
    for (let page = 1; page <= 200; page += 1) {
      const listUrl = new URL(`${DRIME_API}/drive/file-entries`);
      listUrl.searchParams.set("page", String(page));
      listUrl.searchParams.set("perPage", "100");

      const listResponse = await fetch(listUrl, {
        headers: authHeaders,
        cache: "no-store",
      });

      if (!listResponse.ok) {
        const detail = await listResponse.text();
        console.error("Drime file listing failed:", listResponse.status, detail);
        return NextResponse.json(
          { error: `Drime file listing failed (HTTP ${listResponse.status}). Check the DRIME_TOKEN Files permission.` },
          { status: 502 }
        );
      }

      const listing = await listResponse.json() as DrimeListing;
      const entries = Array.isArray(listing.data) ? listing.data : [];

      matches.push(...entries.filter((entry) =>
        (entry.name === filename || entry.file_name === filename)
        && entry.type !== "folder"
        && entry.url
      ));

      const currentPage = Number(listing.current_page || page);
      const lastPage = Number(listing.last_page || 0);
      if (entries.length === 0 || (lastPage > 0 && currentPage >= lastPage)
        || (lastPage === 0 && entries.length < 100)) {
        break;
      }
    }

    if (matches.length === 0) {
      return NextResponse.json(
        { error: `File not found in the root of your Drime Drive: ${filename}` },
        { status: 404 }
      );
    }

    // If duplicate names exist, prefer the most recently updated entry.
    matches.sort((a, b) =>
      Date.parse(b.updated_at || b.created_at || "") - Date.parse(a.updated_at || a.created_at || "")
    );
    const entry = matches[0];

    // Drime returns the actual download URL in each file-entry. Use that URL;
    // /file-entries/download/{hash} is not the download route used by Drime.
    const downloadUrl = new URL(entry.url!, DRIME_ORIGIN);
    if (downloadUrl.protocol !== "https:") {
      return NextResponse.json({ error: "Drime returned an invalid download URL." }, { status: 502 });
    }

    const downloadHeaders: HeadersInit = {};
    if (downloadUrl.hostname === "app.drime.cloud") {
      downloadHeaders.Authorization = `Bearer ${token}`;
    }

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
    console.error("Drime Server 2 download failed:", error);
    return NextResponse.json(
      { error: "Drime Server 2 request failed. Check the website server logs for the Drime API error." },
      { status: 502 }
    );
  }
}
