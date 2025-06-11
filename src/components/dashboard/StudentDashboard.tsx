"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Download,
  Eye,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";

// Mock data - will be replaced with API calls
const mockSubmissions = [
  {
    id: "1",
    title: "La protection des données personnelles dans l'IoT",
    module: "Protection des données",
    submissionDate: "2024-03-15",
    status: "published",
    views: 45,
    downloads: 12,
  },
  {
    id: "2",
    title: "Smart contracts et droit des contrats",
    module: "Blockchain et cryptomonnaies",
    submissionDate: "2024-03-14",
    status: "draft",
    views: 0,
    downloads: 0,
  },
];

export function StudentDashboard() {
  // Clerk authentication is temporarily disabled
  const user = null;
  const isLoaded = true;
  const router = useRouter();
  const [submissions] = useState(mockSubmissions);

  const stats = {
    totalSubmissions: submissions.length,
    totalViews: submissions.reduce((acc, sub) => acc + sub.views, 0),
    totalDownloads: submissions.reduce((acc, sub) => acc + sub.downloads, 0),
  };

  if (!isLoaded) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/4 mb-2" />
          <div className="h-4 bg-slate-700 rounded w-1/2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
        <p className="text-slate-400">
          Gérez vos travaux et suivez leurs statistiques
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {stats.totalSubmissions}
              </div>
              <p className="text-sm text-slate-400">Travaux déposés</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {stats.totalViews}
              </div>
              <p className="text-sm text-slate-400">Vues totales</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {stats.totalDownloads}
              </div>
              <p className="text-sm text-slate-400">Téléchargements</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-900/30 border-blue-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <Button
                className="bg-blue-600 hover:bg-blue-700 w-full"
                onClick={() => router.push("/deposit")}
              >
                <Upload className="h-4 w-4 mr-2" />
                Nouveau dépôt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions list */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Mes travaux</CardTitle>
          <CardDescription>
            Liste de tous vos travaux déposés sur la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600"
              >
                <div className="space-y-1">
                  <Link
                    href={`/catalog/${submission.id}`}
                    className="text-lg font-medium text-white hover:text-blue-400"
                  >
                    {submission.title}
                  </Link>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <span>{submission.module}</span>
                    <span>•</span>
                    <span>
                      Déposé le{" "}
                      {new Date(submission.submissionDate).toLocaleDateString(
                        "fr-FR",
                      )}
                    </span>
                    <Badge
                      variant={
                        submission.status === "published"
                          ? "outline"
                          : "secondary"
                      }
                      className={
                        submission.status === "published"
                          ? "text-green-400 border-green-600"
                          : "text-yellow-400 border-yellow-600"
                      }
                    >
                      {submission.status === "published"
                        ? "Publié"
                        : "Brouillon"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <Eye className="h-4 w-4" />
                    <span>{submission.views}</span>
                    <Download className="h-4 w-4 ml-2" />
                    <span>{submission.downloads}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-white border-slate-600 hover:border-blue-500"
                      onClick={() => {
                        // TODO: Implement edit functionality
                        console.log("Edit:", submission.id);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-400 border-slate-600 hover:border-red-500 hover:text-red-300"
                      onClick={() => {
                        // TODO: Implement delete functionality
                        console.log("Delete:", submission.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {submissions.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Aucun travail déposé
                </h3>
                <p className="text-slate-400 mb-4">
                  Vous n'avez pas encore déposé de travaux sur la plateforme
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push("/deposit")}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Déposer un travail
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-yellow-900/20 border-yellow-700/50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Conseils pour vos dépôts
              </h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>
                  • Vérifiez que votre fichier est au format accepté (PDF, DOCX,
                  PPTX)
                </li>
                <li>• Incluez un résumé clair et descriptif</li>
                <li>
                  • Ajoutez des mots-clés pertinents pour faciliter la recherche
                </li>
                <li>• Relisez votre travail avant la publication finale</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
