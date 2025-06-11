import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { FileService } from "@/lib/services/fileService";
import { Readable } from "stream";

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
  stream: Readable;
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const moduleId = searchParams.get("moduleId");

    const submissions = await prisma.submission.findMany({
      where: {
        moduleId: moduleId || undefined,
        OR: [{ authorId: userId }, { supervisorId: userId }],
      },
      include: {
        author: true,
        module: true,
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { id, title, description } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 },
      );
    }

    // Check if user has permission to update this submission
    const existingSubmission = await prisma.submission.findUnique({
      where: { id },
      select: { authorId: true, supervisorId: true },
    });

    if (!existingSubmission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    if (
      existingSubmission.authorId !== userId &&
      existingSubmission.supervisorId !== userId
    ) {
      return NextResponse.json(
        { error: "Not authorized to update this submission" },
        { status: 403 },
      );
    }

    // Update the submission
    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        updatedAt: new Date(),
      },
      include: {
        author: true,
        supervisor: true,
        module: true,
      },
    });

    return NextResponse.json({
      message: "Submission updated successfully",
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400 },
      );
    }

    // Check if user has permission to delete this submission
    const existingSubmission = await prisma.submission.findUnique({
      where: { id },
      select: { authorId: true, supervisorId: true },
    });

    if (!existingSubmission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    if (
      existingSubmission.authorId !== userId &&
      existingSubmission.supervisorId !== userId
    ) {
      return NextResponse.json(
        { error: "Not authorized to delete this submission" },
        { status: 403 },
      );
    }

    // Delete the submission
    await prisma.submission.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Submission deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const moduleId = formData.get("moduleId") as string;
    const supervisorId = formData.get("supervisorId") as string;

    if (!file || !title || !moduleId || !supervisorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileService = new FileService();

    // Add validation
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ["application/pdf", "application/msword" /* etc */];

    if (file.size > MAX_FILE_SIZE) throw new Error("File too large");
    if (!ALLOWED_TYPES.includes(file.type))
      throw new Error("Invalid file type");

    // Save file to disk
    const fileUrl = await fileService.saveFile({
      fieldname: "file",
      originalname: file.name,
      encoding: "7bit",
      mimetype: file.type,
      size: buffer.length,
      destination: "",
      filename: file.name,
      path: "",
      buffer,
      stream: Readable.from(buffer),
    } as UploadedFile);

    // Create submission in database
    const submission = await prisma.submission.create({
      data: {
        title,
        description,
        fileUrl,
        authorId: userId,
        supervisorId,
        moduleId,
        status: "pending",
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error handling submission:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 },
    );
  }
}
