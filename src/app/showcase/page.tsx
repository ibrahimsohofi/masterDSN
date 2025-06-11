"use client";

import { useState } from "react";
import Link from "next/link";
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
  Star,
  Award,
  TrendingUp,
  Download,
  Eye,
  ChevronRight,
  FileText,
} from "lucide-react";

// Mock data - will be replaced with API calls
const mockFeaturedWorks = [
  {
    id: "1",
    title: "La protection des données personnelles dans l'IoT",
    description:
      "Une analyse approfondie des enjeux juridiques et techniques de la protection des données dans l'Internet des Objets, avec des recommandations pratiques pour les entreprises.",
    student: "Marie Lambert",
    module: "Protection des données",
    year: "2024",
    views: 145,
    downloads: 52,
    featured: true,
    award: "Meilleur mémoire 2024",
  },
  {
    id: "2",
    title: "Smart contracts et droit des contrats",
    description:
      "Étude comparative entre les smart contracts et les contrats traditionnels, explorant les implications juridiques et les défis de leur mise en œuvre.",
    student: "Thomas Martin",
    module: "Blockchain et cryptomonnaies",
    year: "2024",
    views: 98,
    downloads: 34,
    featured: true,
  },
  {
    id: "3",
    title: "Régulation des plateformes de réseaux sociaux",
    description:
      "Analyse des cadres réglementaires actuels et propositions pour une meilleure gouvernance des plateformes numériques.",
    student: "Julie Dubois",
    module: "Régulation des plateformes",
    year: "2023",
    views: 167,
    downloads: 73,
    featured: true,
    award: "Prix de l'innovation juridique",
  },
];

const mockStats = {
  totalSubmissions: 156,
  totalStudents: 45,
  totalDownloads: 1234,
  featuredWorks: 12,
};

export default function ShowcasePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Travaux exemplaires</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Découvrez une sélection des meilleurs travaux réalisés par les
          étudiants du Master DSN, illustrant l'excellence et l'innovation dans
          le domaine du droit du numérique.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-12">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {mockStats.totalSubmissions}
              </div>
              <p className="text-sm text-slate-400">Travaux déposés</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {mockStats.featuredWorks}
              </div>
              <p className="text-sm text-slate-400">Travaux mis en avant</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <Download className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {mockStats.totalDownloads}
              </div>
              <p className="text-sm text-slate-400">Téléchargements</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {mockStats.totalStudents}
              </div>
              <p className="text-sm text-slate-400">Étudiants actifs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured works */}
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Travaux à la une</h2>
          <Link href="/catalog">
            <Button
              variant="outline"
              className="text-white border-slate-600 hover:border-blue-500"
            >
              Voir le catalogue complet
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {mockFeaturedWorks.map((work) => (
            <Card
              key={work.id}
              className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div>
                      <Link
                        href={`/catalog/${work.id}`}
                        className="text-2xl font-bold text-white hover:text-blue-400"
                      >
                        {work.title}
                      </Link>
                      {work.award && (
                        <div className="flex items-center mt-2">
                          <Award className="h-5 w-5 text-yellow-400 mr-2" />
                          <span className="text-yellow-400 font-medium">
                            {work.award}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-300 text-lg">{work.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span>Par {work.student}</span>
                      <span>•</span>
                      <span>{work.module}</span>
                      <span>•</span>
                      <span>{work.year}</span>
                      <Badge
                        variant="outline"
                        className="text-blue-300 border-blue-600"
                      >
                        Travail exemplaire
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
                  <div className="flex items-center space-x-6 text-sm text-slate-400">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      {work.views} vues
                    </span>
                    <span className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      {work.downloads} téléchargements
                    </span>
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      // TODO: Implement download functionality
                      console.log("Download:", work.id);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <Card className="bg-blue-900/30 border-blue-700 mt-12">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-white">
              Rejoignez le Master DSN
            </h3>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Développez votre expertise en droit du numérique et contribuez aux
              réflexions juridiques sur les enjeux technologiques actuels.
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                // TODO: Implement contact functionality
                console.log("Contact");
              }}
            >
              En savoir plus sur la formation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
