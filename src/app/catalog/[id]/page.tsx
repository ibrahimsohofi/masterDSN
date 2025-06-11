"use client";

import { useParams } from "next/navigation";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  User,
  Book,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data - will be replaced with API call
const mockSubmission = {
  id: "1",
  title: "La protection des données personnelles dans l'IoT",
  description:
    "Analyse des enjeux juridiques et techniques de la protection des données dans l'Internet des Objets. Cette étude approfondie examine les défis spécifiques liés à la collecte et au traitement des données personnelles dans le contexte des objets connectés, en mettant l'accent sur les obligations légales et les bonnes pratiques à mettre en œuvre pour assurer une protection efficace des utilisateurs.",
  module: "Protection des données",
  author: "Marie Lambert",
  teacher: "Prof. Sophie BERNARD",
  submissionDate: "2024-03-15",
  views: 45,
  downloads: 12,
  fileType: "pdf",
  keywords: ["RGPD", "IoT", "Données personnelles", "Sécurité", "Vie privée"],
  abstract: `Cette étude examine les enjeux juridiques et techniques de la protection des données personnelles dans l'Internet des Objets (IoT). À travers une analyse approfondie du cadre réglementaire européen et des spécificités techniques des objets connectés, nous identifions les principales problématiques et proposons des solutions concrètes pour assurer une collecte et un traitement des données conformes au RGPD.

Les points clés abordés incluent :
- L'application du RGPD dans le contexte spécifique de l'IoT
- Les défis techniques de la mise en conformité
- Les bonnes pratiques de sécurisation des données
- Les droits des utilisateurs et leur exercice effectif
- Les responsabilités des fabricants et des opérateurs

Cette recherche s'appuie sur une analyse de la jurisprudence récente et des recommandations des autorités de protection des données, complétée par des études de cas concrets d'implémentation.`,
};

export default function SubmissionDetailPage() {
  const { id } = useParams();

  // TODO: Fetch actual submission data based on ID
  const submission = mockSubmission;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{submission.title}</h1>
            <Badge
              variant="outline"
              className="uppercase text-blue-300 border-blue-600"
            >
              {submission.fileType}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 mt-4 text-slate-400">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Déposé le{" "}
              {new Date(submission.submissionDate).toLocaleDateString("fr-FR")}
            </span>
            <span className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {submission.author}
            </span>
            <span className="flex items-center">
              <Book className="h-4 w-4 mr-2" />
              {submission.module}
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-6">
          {/* Abstract */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Résumé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                {submission.abstract.split("\n\n").map((paragraph, index) => (
                  <p
                    key={`paragraph-${paragraph.substring(0, 20)}-${index}`}
                    className="text-slate-300 mb-4"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Statistics */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-white">
                      {submission.views}
                    </div>
                    <div className="text-sm text-slate-400">Consultations</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-white">
                      {submission.downloads}
                    </div>
                    <div className="text-sm text-slate-400">
                      Téléchargements
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Keywords */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Mots-clés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {submission.keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="outline"
                      className="text-blue-300 border-blue-600"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Download section */}
          <Card className="bg-blue-900/30 border-blue-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-white">
                    Télécharger le document complet
                  </h3>
                  <p className="text-sm text-slate-300">
                    Format {submission.fileType.toUpperCase()} • Horodaté et
                    authentifié
                  </p>
                </div>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    // TODO: Implement file download
                    console.log("Download:", submission.id);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Legal notice */}
          <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-slate-400">
                Ce document est protégé par le droit d'auteur. Son
                téléchargement et sa consultation sont autorisés dans le cadre
                pédagogique du Master DSN, avec mention obligatoire de la source
                et de l'auteur pour toute citation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
