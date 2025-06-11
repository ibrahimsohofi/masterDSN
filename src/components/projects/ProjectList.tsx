import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  module: {
    name: string;
    code: string;
  };
  author: {
    name: string;
  };
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`}>
          <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {project.description}
                </p>
              </div>
              <Badge
                variant={project.status === "pending" ? "warning" : "success"}
              >
                {project.status}
              </Badge>
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-sm">
                <span className="text-muted-foreground">Module: </span>
                {project.module.name}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Author: </span>
                {project.author.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
