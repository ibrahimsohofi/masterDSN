"use client";

import { useState } from "react";
import { Search, Filter, FileText, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

// Mock data for now - will be replaced with actual API calls
const mockSubmissions = [
  {
    id: "1",
    title: "La protection des données personnelles dans l'IoT",
    description:
      "Analyse des enjeux juridiques et techniques de la protection des données dans l'Internet des Objets.",
    module: "Protection des données",
    author: "Marie Lambert",
    teacher: "Prof. Sophie BERNARD",
    submissionDate: "2024-03-15",
    views: 45,
    downloads: 12,
    fileType: "pdf",
  },
  {
    id: "2",
    title: "Smart contracts et droit des contrats",
    description:
      "Étude comparative entre les smart contracts et les contrats traditionnels.",
    module: "Blockchain et cryptomonnaies",
    author: "Thomas Martin",
    teacher: "Prof. Jean-Claude MARTIN",
    submissionDate: "2024-03-14",
    views: 32,
    downloads: 8,
    fileType: "pdf",
  },
  // Add more mock data as needed
];

const modules = [
  "Tous les modules",
  "Droit du numérique",
  "Cybersécurité juridique",
  "Protection des données",
  "Commerce électronique",
  "Blockchain et cryptomonnaies",
];

const teachers = [
  "Tous les enseignants",
  "Prof. Sophie BERNARD",
  "Prof. Jean-Claude MARTIN",
  "Prof. Marie DUBOIS",
];

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState("Tous les modules");
  const [selectedTeacher, setSelectedTeacher] = useState(
    "Tous les enseignants",
  );

  const filteredSubmissions = mockSubmissions.filter((submission) => {
    const matchesSearch =
      submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      submission.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModule =
      selectedModule === "Tous les modules" ||
      submission.module === selectedModule;

    const matchesTeacher =
      selectedTeacher === "Tous les enseignants" ||
      submission.teacher === selectedTeacher;

    return matchesSearch && matchesModule && matchesTeacher;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Catalogue des travaux</h1>
        <p className="text-slate-400">
          Explorez les travaux académiques du Master DSN
        </p>
      </div>

      {/* Search and filters */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher par titre, description ou auteur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
          />
        </div>
        <Select value={selectedModule} onValueChange={setSelectedModule}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Filtrer par module" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {modules.map((module) => (
              <SelectItem
                key={module}
                value={module}
                className="text-white hover:bg-slate-700"
              >
                {module}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Filtrer par enseignant" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            {teachers.map((teacher) => (
              <SelectItem
                key={teacher}
                value={teacher}
                className="text-white hover:bg-slate-700"
              >
                {teacher}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="grid gap-6">
        {filteredSubmissions.map((submission) => (
          <Card
            key={submission.id}
            className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-colors"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/catalog/${submission.id}`}>
                    <CardTitle className="text-white hover:text-blue-400 cursor-pointer">
                      {submission.title}
                    </CardTitle>
                  </Link>
                  <CardDescription className="text-slate-400 mt-1">
                    Par {submission.author} • {submission.module}
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="uppercase text-blue-300 border-blue-600"
                >
                  {submission.fileType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">{submission.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {submission.views} vues
                  </span>
                  <span className="flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    {submission.downloads} téléchargements
                  </span>
                  <span>
                    Déposé le{" "}
                    {new Date(submission.submissionDate).toLocaleDateString(
                      "fr-FR",
                    )}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="text-white border-slate-600 hover:border-blue-500"
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
        ))}

        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-slate-400">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
