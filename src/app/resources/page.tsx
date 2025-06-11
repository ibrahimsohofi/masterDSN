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
  Book,
  FileText,
  Download,
  ExternalLink,
  Search,
  BookOpen,
  Scale,
  GraduationCap,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// Types
interface LegalText {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  url: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  year: string;
  description: string;
  isbn: string;
}

interface CourseMaterial {
  id: string;
  title: string;
  module: string;
  author: string;
  type: string;
  format: string;
  url?: string;
}

// Mock data - will be replaced with API calls
const mockLegalTexts: LegalText[] = [
  {
    id: "1",
    title: "Règlement Général sur la Protection des Données (RGPD)",
    description: "Texte complet du RGPD avec annotations et commentaires",
    type: "Règlement européen",
    date: "2016",
    url: "https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32016R0679",
  },
  {
    id: "2",
    title: "Loi Informatique et Libertés",
    description: "Version consolidée de la loi n° 78-17 du 6 janvier 1978",
    type: "Loi française",
    date: "1978",
    url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000886460/",
  },
];

const mockBooks: Book[] = [
  {
    id: "1",
    title: "Droit du numérique",
    author: "Jean Dupont",
    publisher: "Éditions Juridiques",
    year: "2023",
    description: "Manuel complet sur les aspects juridiques du numérique",
    isbn: "978-2-1234-5678-9",
  },
  {
    id: "2",
    title: "Cybersécurité : aspects juridiques",
    author: "Marie Martin",
    publisher: "Dalloz",
    year: "2022",
    description:
      "Analyse approfondie des enjeux juridiques de la cybersécurité",
    isbn: "978-2-8765-4321-0",
  },
];

const mockCourseMaterials: CourseMaterial[] = [
  {
    id: "1",
    title: "Introduction au droit du numérique",
    module: "Droit du numérique",
    author: "Prof. Sophie BERNARD",
    type: "Présentation",
    format: "PDF",
    url: "/course-materials/intro-droit-numerique.pdf"
  },
  {
    id: "2",
    title: "Cas pratiques - Protection des données",
    module: "Protection des données",
    author: "Prof. Jean-Claude MARTIN",
    type: "Exercices",
    format: "DOCX",
    url: "/course-materials/cas-pratiques-protection-donnees.docx"
  },
];

// Components
const ResourceCard = ({
  title,
  description,
  children,
  icon: Icon,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  icon: React.ElementType;
}) => (
  <Card className="bg-slate-800/50 border-slate-700 mb-8">
    <CardHeader>
      <div className="flex items-center space-x-2">
        <Icon className="h-5 w-5 text-blue-400" aria-hidden="true" />
        <CardTitle className="text-white">{title}</CardTitle>
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

const SearchBar = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => (
  <div className="max-w-xl mb-8">
    <div className="relative">
      <Search 
        className="absolute left-3 top-3 h-4 w-4 text-slate-400" 
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
        aria-label={placeholder}
      />
    </div>
  </div>
);

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filterResources = <T extends Record<string, any>>(
    items: T[],
    query: string,
    searchFields: (keyof T)[]
  ): T[] => {
    if (!query.trim()) return items;
    
    const lowercaseQuery = query.toLowerCase();
    return items.filter((item) =>
      searchFields.some(
        (field) =>
          item[field] &&
          String(item[field]).toLowerCase().includes(lowercaseQuery)
      )
    );
  };

  const filteredLegalTexts = filterResources(
    mockLegalTexts,
    searchQuery,
    ["title", "description", "type"]
  );

  const filteredBooks = filterResources(
    mockBooks,
    searchQuery,
    ["title", "description", "author", "publisher"]
  );

  const filteredCourseMaterials = filterResources(
    mockCourseMaterials,
    searchQuery,
    ["title", "module", "author", "type"]
  );

  const handleDownload = (material: CourseMaterial) => {
    if (material.url) {
      // In a real app, this would trigger a download
      console.log("Downloading:", material.url);
      // window.open(material.url, '_blank');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Ressources pédagogiques</h1>
        <p className="text-slate-400">
          Accédez aux textes juridiques, ouvrages recommandés et supports de cours
        </p>
      </header>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Rechercher dans les ressources..."
      />

      {/* Legal Texts Section */}
      <ResourceCard
        title="Textes juridiques"
        description="Lois, règlements et textes juridiques de référence"
        icon={Scale}
      >
        <div className="space-y-4">
          {filteredLegalTexts.length > 0 ? (
            filteredLegalTexts.map((text) => (
              <article
                key={text.id}
                className="p-4 rounded-lg bg-slate-700/30 border border-slate-600"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-white">
                      <Link
                        href={text.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 flex items-center"
                        aria-label={`${text.title} (ouvre dans un nouvel onglet)`}
                      >
                        {text.title}
                        <ExternalLink className="h-4 w-4 ml-2" aria-hidden="true" />
                      </Link>
                    </h2>
                    <p className="text-slate-300 mt-1">{text.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-slate-400">
                      <Badge
                        variant="outline"
                        className="text-blue-300 border-blue-600"
                      >
                        {text.type}
                      </Badge>
                      <time dateTime={text.date}>{text.date}</time>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-slate-400 text-center py-4">
              Aucun texte juridique trouvé
            </p>
          )}
        </div>
      </ResourceCard>

      {/* Books Section */}
      <ResourceCard
        title="Ouvrages recommandés"
        icon={BookOpen}
        description="Sélection d'ouvrages et articles pour approfondir vos connaissances"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <article
                key={book.id}
                className="p-4 rounded-lg bg-slate-700/30 border border-slate-600"
              >
                <h2 className="text-lg font-medium text-white">{book.title}</h2>
                <p className="text-slate-300 mt-1">{book.description}</p>
                <dl className="mt-2 space-y-1 text-sm text-slate-400">
                  <div>
                    <dt className="font-semibold inline">Auteur :</dt>{' '}
                    <dd className="inline">{book.author}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Éditeur :</dt>{' '}
                    <dd className="inline">{book.publisher}, {book.year}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">ISBN :</dt>{' '}
                    <dd className="inline">{book.isbn}</dd>
                  </div>
                </dl>
              </article>
            ))
          ) : (
            <p className="text-slate-400 text-center py-4 col-span-2">
              Aucun ouvrage trouvé
            </p>
          )}
        </div>
      </ResourceCard>

      {/* Course Materials Section */}
      <ResourceCard
        title="Supports de cours"
        icon={GraduationCap}
        description="Supports pédagogiques partagés par les enseignants"
      >
        <div className="space-y-4">
          {filteredCourseMaterials.length > 0 ? (
            filteredCourseMaterials.map((material) => (
              <article
                key={material.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600 gap-4"
              >
                <div>
                  <h2 className="text-lg font-medium text-white">
                    {material.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-400">
                    <span>{material.module}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{material.author}</span>
                    <Badge
                      variant="outline"
                      className="text-blue-300 border-blue-600"
                    >
                      {material.type}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-slate-600 hover:border-blue-500 shrink-0 w-full sm:w-auto"
                  onClick={() => handleDownload(material)}
                  disabled={!material.url}
                >
                  <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                  {material.format}
                </Button>
              </article>
            ))
          ) : (
            <p className="text-slate-400 text-center py-4">
              Aucun support de cours trouvé
            </p>
          )}
        </div>
      </ResourceCard>
    </div>
  );
}
