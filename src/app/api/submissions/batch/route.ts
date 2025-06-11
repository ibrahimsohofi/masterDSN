import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { operation, submissionIds, value } = await req.json();
    if (!operation || !submissionIds || !Array.isArray(submissionIds)) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    switch (operation) {
      case "move":
        // Move submissions to a new module
        await prisma.submission.updateMany({
          where: {
            id: {
              in: submissionIds,
            },
          },
          data: {
            moduleId: value, // value should be the target module ID
          },
        });
        break;

      case "status":
        // Update submission status
        await prisma.submission.updateMany({
          where: {
            id: {
              in: submissionIds,
            },
          },
          data: {
            status: value, // value should be the new status
          },
        });
        break;

      case "share": {
        // Create share links or permissions
        // This would depend on your sharing implementation
        // For example, you might create share tokens in a separate table
        const shareTokens = await Promise.all(
          submissionIds.map(async (id) => {
            return prisma.shareToken.create({
              data: {
                submissionId: id,
                token: crypto.randomUUID(),
                expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
              },
            });
          }),
        );
        return new NextResponse(JSON.stringify({ shareTokens }));
      }

      case "rename": {
        // Batch rename submissions
        // value should be a pattern like "{module_code}_{index}"
        const submissions = await prisma.submission.findMany({
          where: {
            id: {
              in: submissionIds,
            },
          },
          include: {
            module: true,
          },
        });

        await Promise.all(
          submissions.map(async (submission, index) => {
            const newTitle = value
              .replace("{module_code}", submission.module.code)
              .replace("{index}", (index + 1).toString().padStart(3, "0"));

            return prisma.submission.update({
              where: { id: submission.id },
              data: { title: newTitle },
            });
          }),
        );
        break;
      }

      default:
        return new NextResponse("Invalid operation", { status: 400 });
    }

    return new NextResponse(JSON.stringify({ success: true }));
  } catch (error) {
    console.error("Error in batch operation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
