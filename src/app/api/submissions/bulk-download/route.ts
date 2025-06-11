import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import JSZip from "jszip";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { submissionIds } = await req.json();
    if (!submissionIds || !Array.isArray(submissionIds)) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    // Fetch submissions with file URLs
    const submissions = await prisma.submission.findMany({
      where: {
        id: {
          in: submissionIds,
        },
      },
      include: {
        author: true,
        module: true,
      },
    });

    // Create a new ZIP file
    const zip = new JSZip();

    // Add each file to the ZIP
    for (const submission of submissions) {
      try {
        // Fetch the file from the URL
        const response = await fetch(submission.fileUrl);
        const fileBuffer = await response.arrayBuffer();

        // Create a sanitized filename
        const fileName = `${submission.module.code}/${submission.author.name}/${submission.title}`;

        // Add the file to the ZIP
        zip.file(fileName, fileBuffer);
      } catch (error) {
        console.error(`Error adding file to ZIP: ${submission.title}`, error);
        // Continue with other files even if one fails
      }
    }

    // Generate the ZIP file
    const zipBuffer = await zip.generateAsync({
      type: "arraybuffer",
      compression: "DEFLATE",
      compressionOptions: {
        level: 5,
      },
    });

    // Return the ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="submissions.zip"`,
      },
    });
  } catch (error) {
    console.error("Error in bulk download:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
