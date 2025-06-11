"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { ProfessorSearch } from "@/components/submissions/ProfessorSearch";
import { SubmissionsList } from "@/components/submissions/SubmissionsList";

interface Professor {
  id: string;
  name: string;
  email: string;
}

export default function SubmissionsPage() {
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null,
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Search Submissions</h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <ProfessorSearch
            onSelect={(professor) => setSelectedProfessor(professor)}
          />

          {selectedProfessor && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h2 className="font-medium">Selected Professor:</h2>
              <p className="text-sm">{selectedProfessor.name}</p>
              <p className="text-sm text-muted-foreground">
                {selectedProfessor.email}
              </p>
            </div>
          )}
        </div>

        <div className="md:col-span-8">
          {selectedProfessor ? (
            <SubmissionsList supervisorId={selectedProfessor.id} />
          ) : (
            <div className="text-center text-muted-foreground mt-8">
              Select a professor to view their submissions
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
