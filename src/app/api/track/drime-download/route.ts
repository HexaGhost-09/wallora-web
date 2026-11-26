import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { apkVersions } from "@/lib/db/schema";
import { trackDownload } from "@/lib/db/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DRIME_API = "https://app.drime.cloud/api/v1";
const GITHUB_RELEASES = "https://api.github.com/repos/HexaGhost-09/wallora-2/releases/tags";

type DrimeEntry = {
  name?: string;
  clientName?: string;
  client_name?: string;
  hash?: string;
  type?: string;
  created_at?: string;
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
    // Confirm that the requested filename is a real asset in this Wallora release.
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

    const authHeaders = { Authorization: `Bearer ${token}`, Accept: "application/json" };
    const matches: DrimeEntry[] = [];

    // Drime returns paginated file entries. Find the exact release asset name.
    for (let page = 1; page <= 100; page += 1) {
      const listUrl = new URL(`${DRIME_API}/drive/file-entries`);
      listUrl.searchParams.set("workspaceId", "0");
      listUrl.searchParams.set("page", String(page));

      const listResponse = await fetch(listUrl, {
        headers: authHeaders,
        cache: "no-store",
      });
      if (!listResponse.ok) {
        console.error("Drime file listing failed:", listResponse.status, await listResponse.text());
        return NextResponse.json({ error: "Could not list files from Drime." }, { status: 502 });
      }

      const listing = await listResponse.json();
      const entries: DrimeEntry[] = Array.isArray(listing.data) ? listing.data : [];
      matches.push(...entries.filter((entry) =>
        (entry.name === filename || entry.clientName === filename || entry.client_name === filename)
        && entry.hash
        && entry.type !== "folder"
      ));

      if (matches.length > 0 || entries.length === 0) break;
      if (listing.last_page && page >= Number(listing.last_page)) break;
      if (listing.current_page && listing.last_page && Number(listing.current_page) >= Number(listing.last_page)) break;
    }

    if (matches.length === 0) {
      return NextResponse.json(
        { error: `This file has not been uploaded to Drime yet: ${filename}` },
        { status: 404 }
      );
    }

    // If the same asset name exists more than once, use the newest Drime entry.
    matches.sort((a, b) =>
      Date.parse(b.created_at || "") - Date.parse(a.created_at || "")
    );
    const entry = matches[0];

    const fileResponse = await fetch(
      `${DRIME_API}/file-entries/download/${encodeURIComponent(entry.hash!)}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    if (!fileResponse.ok || !fileResponse.body) {
      console.error("Drime file download failed:", fileResponse.status, await fileResponse.text());
      return NextResponse.json({ error: "Drime could not deliver this file." }, { status: 502 });
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
    return NextResponse.json({ error: "Failed to download file from Drime." }, { status: 500 });
  }
}
