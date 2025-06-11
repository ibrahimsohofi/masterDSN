"use client";

import { useState } from "react";
// import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Shield,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const modules = [
  "Droit du numérique",
  "Cybersécurité juridique",
  "Protection des données",
  "Commerce électronique",
  "Propriété intellectuelle numérique",
  "Régulation des plateformes",
  "Intelligence artificielle et droit",
  "Blockchain et cryptomonnaies",
  "Gouvernance de l'internet",
  "Droit pénal numérique",
  "Contrats numériques",
  "Méthodologie de recherche",
];

const teachers = [
  "Prof. Martin DUPONT",
  "Prof. Sophie BERNARD",
  "Prof. Jean-Claude MARTIN",
  "Prof. Marie DUBOIS",
  "Prof. Alexandre LAURENT",
  "Prof. Catherine MOREAU",
  "Prof. Philippe PETIT",
  "Prof. Isabelle ROUX",
];

const allowedFileTypes = [".pdf", ".docx", ".pptx", ".doc", ".ppt"];

// Mock user type for when Clerk is disabled
type MockUser = {
  update?: (data: any) => Promise<void>;
  fullName?: string;
} | null;

export function SubmissionForm() {
  // Clerk authentication is temporarily disabled
  const user: MockUser = null;
  const isLoaded = true;
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    module: "",
    teacher: "",
    file: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Return loading state if Clerk is not loaded yet
  if (!isLoaded) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 text-center">
        <CardContent className="pt-8 pb-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-4" />
          <p className="text-slate-400">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  // Redirect if user is not authenticated
  if (!user) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 text-center">
        <CardContent className="pt-8 pb-8">
          <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Authentification requise
          </h2>
          <p className="text-slate-400 mb-6">
            Vous devez être connecté pour déposer un travail.
          </p>
          <Button
            onClick={() => router.push('/sign-in')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Se connecter
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (allowedFileTypes.includes(fileExtension)) {
        setFormData({ ...formData, file });
      } else {
        alert(
          "Type de fichier non autorisé. Formats acceptés : PDF, DOCX, PPTX",
        );
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.file) return;

    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("file", formData.file);
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("moduleId", formData.module);
      form.append("supervisorId", formData.teacher);

      const response = await fetch("/api/submissions", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        throw new Error("Failed to submit work");
      }

      const data = await response.json();
      console.log("Submission successful:", data);
      setSubmitStatus("success");
    } catch (error) {
      console.error("Error submitting work:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <Card className="bg-slate-800/50 border-slate-700 text-center">
        <CardContent className="pt-8 pb-8">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Travail déposé avec succès !
          </h2>
          <p className="text-slate-400 mb-6">
            Votre travail "{formData.title}" a été ajouté à la plateforme avec
            un horodatage automatique.
          </p>
          <div className="space-y-2 text-sm text-slate-300">
            <p>
              <strong>Auteur:</strong> {(user && 'fullName' in user) ? (user as any).fullName : "Utilisateur (Demo)"}
            </p>
            <p>
              <strong>Module:</strong> {formData.module}
            </p>
            <p>
              <strong>Enseignant:</strong> {formData.teacher}
            </p>
            <p>
              <strong>Date de dépôt:</strong>{" "}
              {new Date().toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div className="flex gap-4 justify-center mt-6">
            <Button
              onClick={() => setSubmitStatus("idle")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Déposer un autre travail
            </Button>
            <Button
              variant="outline"
              className="text-white border-slate-600 hover:border-blue-500"
              onClick={() => router.push("/catalog")}
            >
              Voir le catalogue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Informations importantes */}
      <Card className="bg-blue-900/30 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-400" />
            Propriété intellectuelle et sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <h4 className="font-semibold mb-2 text-white">
                Protection garantie :
              </h4>
              <ul className="space-y-1">
                <li>• Horodatage automatique de votre dépôt</li>
                <li>• Attribution claire de la paternité</li>
                <li>• Stockage sécurisé et chiffré</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-white">
                Formats acceptés :
              </h4>
              <div className="flex flex-wrap gap-2">
                {allowedFileTypes.map((type) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className="text-blue-300 border-blue-600"
                  >
                    {type.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire de dépôt */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Informations du travail</CardTitle>
          <CardDescription className="text-slate-400">
            Tous les champs marqués d'un astérisque (*) sont obligatoires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Titre du travail *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ex: Analyse de la RGPD dans le commerce électronique"
                required
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Description courte *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Résumé du contenu, problématique traitée, méthodologie..."
                rows={4}
                required
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Module et Enseignant */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="module" className="text-white">
                  Module concerné *
                </Label>
                <Select
                  value={formData.module}
                  onValueChange={(value) =>
                    setFormData({ ...formData, module: value })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Sélectionner un module" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {modules.map((module) => (
                      <SelectItem
                        key={module}
                        value={module}
                        className="text-white hover:bg-slate-600"
                      >
                        {module}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher" className="text-white">
                  Enseignant encadrant *
                </Label>
                <Select
                  value={formData.teacher}
                  onValueChange={(value) =>
                    setFormData({ ...formData, teacher: value })
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Sélectionner un enseignant" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {teachers.map((teacher) => (
                      <SelectItem
                        key={teacher}
                        value={teacher}
                        className="text-white hover:bg-slate-600"
                      >
                        {teacher}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Upload fichier */}
            <div className="space-y-2">
              <Label htmlFor="file" className="text-white">
                Fichier à déposer *
              </Label>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center bg-slate-700/30">
                <FileText className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.pptx,.doc,.ppt"
                  required
                  className="hidden"
                />
                <Label htmlFor="file" className="cursor-pointer">
                  <span className="text-white font-semibold">
                    Cliquez pour choisir un fichier
                  </span>
                  <br />
                  <span className="text-slate-400 text-sm">
                    ou glissez-déposez ici
                  </span>
                </Label>
                {formData.file && (
                  <div className="mt-3 text-sm text-green-400">
                    ✓ {formData.file.name} (
                    {Math.round(formData.file.size / 1024)} Ko)
                  </div>
                )}
              </div>
            </div>

            {/* Informations légales */}
            <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-slate-300">
                  <p className="font-semibold text-white mb-1">
                    Engagement de l'auteur :
                  </p>
                  <p>
                    En déposant ce travail, je certifie en être l'auteur ou
                    co-auteur et accepte sa diffusion dans le cadre pédagogique
                    du Master DSN. Les droits de propriété intellectuelle sont
                    préservés et un horodatage garantit l'antériorité du dépôt.
                  </p>
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.title ||
                  !formData.description ||
                  !formData.module ||
                  !formData.teacher ||
                  !formData.file
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Dépôt en cours...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Déposer le travail
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="text-white border-slate-600 hover:border-blue-500"
                onClick={() =>
                  setFormData({
                    title: "",
                    description: "",
                    module: "",
                    teacher: "",
                    file: null,
                  })
                }
              >
                Réinitialiser
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
