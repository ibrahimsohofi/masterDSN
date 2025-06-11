import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

// Force dynamic rendering for this API route since it uses auth headers
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const supervisorId = userId;
    const searchParams = req.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const fileType = searchParams.get("fileType");
    const sortBy = searchParams.get("sortBy") || "submissionDate";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";

    const skip = (page - 1) * limit;

    // Build the where clause based on filters
    const where: Prisma.SubmissionWhereInput = {
      supervisorId,
      ...(status && { status }),
      ...(fileType && {
        fileUrl: {
          endsWith: `.${fileType.toLowerCase()}`,
        },
      }),
    };

    // Build the orderBy clause
    const orderBy: Prisma.SubmissionOrderByWithRelationInput = {
      createdAt: sortOrder,
    };

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              name: true,
              email: true,
            },
          },
          module: {
            select: {
              name: true,
              code: true,
            },
          },
        },
      }),
      prisma.submission.count({ where }),
    ]);

    return NextResponse.json({
      submissions,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
