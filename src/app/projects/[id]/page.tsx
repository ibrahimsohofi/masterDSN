import { ProjectThemeView } from "@/components/projects/ProjectThemeView";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

async function getProject(id: string) {
  const project = await prisma.submission.findUnique({
    where: { id },
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
  });

  if (!project) {
    notFound();
  }

  return project;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProject(params.id);

  return (
    <main className="container mx-auto py-6">
      <ProjectThemeView project={project} />
    </main>
  );
}
