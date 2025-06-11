"use client";

import { useState } from "react";
import Link from "next/link";
// import { useUser } from "@clerk/nextjs";
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
  Users,
  FileText,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

// Mock data - will be replaced with API calls
const mockSubmissions = [
  {
    id: "1",
    title: "La protection des données personnelles dans l'IoT",
    student: "Marie Lambert",
    module: "Protection des données",
    submissionDate: "2024-03-15",
    status: "pending",
    views: 0,
    downloads: 0,
  },
  {
    id: "2",
    title: "Smart contracts et droit des contrats",
    student: "Thomas Martin",
    module: "Blockchain et cryptomonnaies",
    submissionDate: "2024-03-14",
    status: "approved",
    views: 32,
    downloads: 8,
  },
  {
    id: "3",
    title: "Régulation des plateformes de réseaux sociaux",
    student: "Julie Dubois",
    module: "Régulation des plateformes",
    submissionDate: "2024-03-13",
    status: "rejected",
    views: 0,
    downloads: 0,
  },
];

const mockStats = {
  totalStudents: 45,
  pendingSubmissions: 12,
  approvedSubmissions: 28,
  totalSubmissions: 40,
};

export function TeacherDashboard() {
  // Clerk authentication is temporarily disabled
  const user = null;
  const isLoaded = true;
  const [submissions] = useState(mockSubmissions);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="text-green-400 border-green-600">
            Approuvé
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-400 border-red-600">
            Refusé
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-yellow-400 border-yellow-600"
          >
            En attente
          </Badge>
        );
    }
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
        <h1 className="text-3xl font-bold mb-2">Tableau de bord enseignant</h1>
        <p className="text-slate-400">
          Gérez les travaux des étudiants et suivez leur progression
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {mockStats.totalStudents}
              </div>
              <p className="text-sm text-slate-400">Étudiants actifs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <Clock className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {mockStats.pendingSubmissions}
              </div>
              <p className="text-sm text-slate-400">Travaux en attente</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {mockStats.approvedSubmissions}
              </div>
              <p className="text-sm text-slate-400">Travaux approuvés</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">
                {mockStats.totalSubmissions}
              </div>
              <p className="text-sm text-slate-400">Total des travaux</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent submissions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Travaux récents</CardTitle>
              <CardDescription>
                Derniers travaux soumis par les étudiants
              </CardDescription>
            </div>
            <Button
              variant="outline"
              className="text-white border-slate-600 hover:border-blue-500"
              onClick={() => {
                // TODO: Implement view all functionality
                console.log("View all submissions");
              }}
            >
              Voir tout
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
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
                    <span>{submission.student}</span>
                    <span>•</span>
                    <span>{submission.module}</span>
                    <span>•</span>
                    <span>
                      Déposé le{" "}
                      {new Date(submission.submissionDate).toLocaleDateString(
                        "fr-FR",
                      )}
                    </span>
                    {getStatusBadge(submission.status)}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {submission.status === "approved" && (
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <Eye className="h-4 w-4" />
                      <span>{submission.views}</span>
                      <Download className="h-4 w-4 ml-2" />
                      <span>{submission.downloads}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    {submission.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-400 border-slate-600 hover:border-green-500 hover:text-green-300"
                          onClick={() => {
                            // TODO: Implement approve functionality
                            console.log("Approve:", submission.id);
                          }}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-400 border-slate-600 hover:border-red-500 hover:text-red-300"
                          onClick={() => {
                            // TODO: Implement reject functionality
                            console.log("Reject:", submission.id);
                          }}
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-white border-slate-600 hover:border-blue-500"
                      onClick={() => {
                        // TODO: Implement download functionality
                        console.log("Download:", submission.id);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Module statistics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Statistiques par module
            </CardTitle>
            <CardDescription>
              Répartition des travaux par module d'enseignement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* TODO: Add chart or detailed statistics */}
              <p className="text-slate-400 text-center py-8">
                Graphique des statistiques à venir
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Activité récente</CardTitle>
            <CardDescription>
              Dernières actions sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* TODO: Add activity feed */}
              <p className="text-slate-400 text-center py-8">
                Flux d'activité à venir
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
