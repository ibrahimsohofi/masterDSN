"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/types";

// Mock user type for when Clerk is disabled
type MockUser = {
  update?: (data: any) => Promise<void>;
  fullName?: string;
} | null;

export function RoleSelectionForm() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  // Clerk authentication is temporarily disabled
  const user: MockUser = null;
  const isLoaded = true;

  // Return loading state if Clerk is not loaded yet
  if (!isLoaded) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-4" />
        <p className="text-slate-400">Chargement...</p>
      </div>
    );
  }

  // Redirect if user is not authenticated
  if (!user) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Authentification requise</h2>
        <p className="text-slate-400 mb-6">
          Vous devez être connecté pour sélectionner votre rôle.
        </p>
        <Button
          onClick={() => router.push('/sign-in')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Se connecter
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setIsSubmitting(true);
    try {
      if (user && 'update' in user && typeof (user as any).update === 'function') {
        await (user as any).update({
          unsafeMetadata: {
            role: selectedRole,
          },
        });
      } else {
        // Mock authentication - simulate the update process
        console.log('Mock authentication: User role would be updated to:', selectedRole);
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating user role:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">
          Sélectionnez votre rôle
        </h2>
        <p className="text-slate-400 text-center text-sm">
          Choisissez votre rôle pour accéder aux fonctionnalités appropriées
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={selectedRole === "student" ? "default" : "outline"}
            className="h-24 flex flex-col items-center justify-center space-y-2"
            onClick={() => setSelectedRole("student")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span>Étudiant</span>
          </Button>
          <Button
            type="button"
            variant={selectedRole === "teacher" ? "default" : "outline"}
            className="h-24 flex flex-col items-center justify-center space-y-2"
            onClick={() => setSelectedRole("teacher")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 21h18" />
              <path d="M3 7V5h18v2" />
              <path d="M3 7l9 13 9-13" />
            </svg>
            <span>Enseignant</span>
          </Button>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={!selectedRole || isSubmitting}
      >
        {isSubmitting ? "Enregistrement..." : "Continuer"}
      </Button>
    </form>
  );
}
