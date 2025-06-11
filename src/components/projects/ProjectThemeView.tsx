"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentPreviewModal } from "@/components/submissions/DocumentPreviewModal";

interface ProjectThemeViewProps {
  project: {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string;
    status: string;
    author: {
      name: string;
      email: string;
    };
    module: {
      name: string;
      code: string;
    };
    createdAt: string | Date;
  };
}

export function ProjectThemeView({ project }: ProjectThemeViewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge
              variant={project.status === "pending" ? "destructive" : "default"}
            >
              {project.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <Button onClick={() => setIsPreviewOpen(true)}>Preview Project</Button>
      </div>

      {/* Project Details */}
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="font-semibold">Project Description</h2>
            <p className="mt-2 text-muted-foreground whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="font-semibold">Module Information</h2>
              <p className="mt-1 text-muted-foreground">
                {project.module.name} ({project.module.code})
              </p>
            </div>

            <div>
              <h2 className="font-semibold">Author</h2>
              <p className="mt-1 text-muted-foreground">
                {project.author.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {project.author.email}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.open(project.fileUrl)}>
          Download Project Files
        </Button>
      </div>

      {/* Preview Modal */}
      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileUrl={project.fileUrl}
        fileName={project.title}
      />
    </div>
  );
}
