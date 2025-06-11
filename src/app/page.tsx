import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Shield,
  Upload,
  Users,
  Search,
  Award,
  FileText,
  Database,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Logo et titre principal */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="relative">
              <BookOpen className="h-16 w-16 text-blue-400" />
              <Shield className="h-8 w-8 text-white absolute -top-2 -right-2" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Master <span className="text-blue-400">DSN</span>
            </h1>
            <p className="text-2xl md:text-3xl text-slate-300">
              Droit et Sécurité Numériques
            </p>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              Plateforme collaborative de valorisation et de partage des travaux
              académiques de notre promotion. Un espace dédié à l'excellence et
              à l'innovation juridique numérique.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Upload className="mr-2 h-5 w-5" />
              Déposer un travail
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-white border-white hover:bg-white hover:text-slate-900"
            >
              <Search className="mr-2 h-5 w-5" />
              Explorer le catalogue
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Travaux déposés", value: "45", icon: FileText },
            { label: "Étudiants actifs", value: "28", icon: Users },
            { label: "Modules couverts", value: "12", icon: BookOpen },
            { label: "Enseignants", value: "8", icon: Award },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="bg-slate-800/50 border-slate-700 text-center hover:bg-slate-800/70 transition-all duration-300"
            >
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Fonctionnalités principales */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Une plateforme complète pour votre réussite académique
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Dépôt sécurisé",
              description:
                "Déposez vos travaux en toute sécurité avec horodatage et protection de la propriété intellectuelle",
              icon: Upload,
              features: [
                "Upload multi-formats",
                "Métadonnées complètes",
                "Horodatage automatique",
              ],
            },
            {
              title: "Catalogue intelligent",
              description:
                "Recherchez et filtrez les travaux par module, auteur, enseignant ou mots-clés",
              icon: Search,
              features: [
                "Recherche avancée",
                "Filtres multiples",
                "Prévisualisation",
              ],
            },
            {
              title: "Tableau de bord",
              description:
                "Gérez vos dépôts, consultez les statistiques et suivez votre progression académique",
              icon: Database,
              features: [
                "Gestion personnelle",
                "Statistiques détaillées",
                "Historique complet",
              ],
            },
          ].map((feature) => (
            <Card
              key={feature.title}
              className="bg-slate-800/30 border-slate-700 hover:bg-slate-800/50 transition-all duration-300 hover:scale-105"
            >
              <CardHeader>
                <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">{feature.title}</CardTitle>
                <CardDescription className="text-slate-400">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.features.map((item) => (
                    <li
                      key={item}
                      className="flex items-center text-sm text-slate-300"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-slate-800/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à valoriser vos travaux ?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Rejoignez la communauté DSN et contribuez à la construction d'une
            mémoire collective de notre promotion en droit et sécurité
            numériques.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Se connecter
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-white border-white hover:bg-white hover:text-slate-900"
            >
              Découvrir les ressources
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <span className="text-white font-semibold">
                Master DSN Platform
              </span>
            </div>
            <div className="flex space-x-6 text-sm text-slate-400">
              <Link
                href="/legal"
                className="hover:text-white transition-colors"
              >
                Mentions légales
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Propriété intellectuelle
              </Link>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
