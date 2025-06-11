"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Shield } from "lucide-react";

// Mock user type for when Clerk is disabled
type MockUser = {
  update?: (data: any) => Promise<void>;
  fullName?: string;
} | null;

export default function OnboardingPage() {
  const router = useRouter();
  // Clerk authentication is temporarily disabled
  const user: MockUser = null;
  const isLoaded = true;
  const [role, setRole] = useState<"student" | "teacher" | "">("");
  const [studentId, setStudentId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [department, setDepartment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update user metadata with Clerk (when authentication is enabled)
      if (user && 'update' in user && typeof (user as any).update === 'function') {
        await (user as any).update({
          unsafeMetadata: {
            role,
            ...(role === "student" && { studentId }),
            ...(role === "teacher" && { teacherId }),
            department,
          },
        });
      } else {
        // Mock authentication - simulate the update process
        console.log('Mock authentication: User metadata would be updated with:', {
          role,
          ...(role === "student" && { studentId }),
          ...(role === "teacher" && { teacherId }),
          department,
        });
      }

      // Redirect to dashboard after successful update
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating user metadata:", error);
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-4" />
            <p className="text-slate-400">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Authentification requise</h2>
            <p className="text-slate-400 mb-6">
              Vous devez être connecté pour accéder à cette page.
            </p>
            <Button
              onClick={() => router.push('/sign-in')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="relative">
              <BookOpen className="h-16 w-16 text-blue-400" />
              <Shield className="h-8 w-8 text-white absolute -top-2 -right-2" />
            </div>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">
                Bienvenue sur DSN Platform
              </CardTitle>
              <CardDescription className="text-slate-300">
                Configurons votre profil pour commencer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">
                    Votre rôle
                  </Label>
                  <Select
                    value={role}
                    onValueChange={(value: "student" | "teacher") =>
                      setRole(value)
                    }
                  >
                    <SelectTrigger
                      id="role"
                      className="bg-slate-700 border-slate-600 text-white"
                    >
                      <SelectValue placeholder="Sélectionnez votre rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Étudiant</SelectItem>
                      <SelectItem value="teacher">Enseignant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {role === "student" && (
                  <div className="space-y-2">
                    <Label htmlFor="studentId" className="text-white">
                      Numéro étudiant
                    </Label>
                    <Input
                      id="studentId"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Ex: 20230123"
                    />
                  </div>
                )}

                {role === "teacher" && (
                  <div className="space-y-2">
                    <Label htmlFor="teacherId" className="text-white">
                      Identifiant enseignant
                    </Label>
                    <Input
                      id="teacherId"
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Ex: PROF123"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-white">
                    Département
                  </Label>
                  <Input
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Ex: Droit et Sécurité Numériques"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!role || isSubmitting}
                >
                  {isSubmitting
                    ? "Configuration..."
                    : "Terminer la configuration"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
