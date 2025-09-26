import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const journeyDir = path.join(publicDir, "journey");
    const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

    let images: string[] = [];
    try {
      const entries = await fs.readdir(journeyDir, { withFileTypes: true });
      images = entries
        .filter((e) => e.isFile())
        .map((e) => e.name)
        .filter((name) => allowed.has(path.extname(name).toLowerCase()))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((name) => `/journey/${name}`);
    } catch {
      images = [];
    }

    let video = false;
    try {
      const stat = await fs.stat(path.join(publicDir, "flight.mp4"));
      video = stat.isFile();
    } catch {
      video = false;
    }

    return NextResponse.json({ images, video });
  } catch (err) {
    return NextResponse.json({ images: [], video: false }, { status: 200 });
  }
}
