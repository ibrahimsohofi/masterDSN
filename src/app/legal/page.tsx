"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Scale, FileText, AlertTriangle } from "lucide-react";

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mentions légales</h1>
        <p className="text-slate-400">
          Informations légales et conditions d'utilisation de la plateforme
        </p>
      </div>

      {/* Legal sections */}
      <div className="space-y-8">
        {/* General information */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-white">
                Informations générales
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="prose prose-invert">
            <p>
              La plateforme du Master DSN est éditée par l'Université XXX,
              établissement public à caractère scientifique, culturel et
              professionnel.
            </p>
            <ul className="space-y-2">
              <li>Siège social : [Adresse]</li>
              <li>Téléphone : [Numéro]</li>
              <li>Email : [Email]</li>
              <li>Directeur de la publication : [Nom]</li>
            </ul>
            <p>Hébergeur : [Nom et coordonnées de l'hébergeur]</p>
          </CardContent>
        </Card>

        {/* Terms of use */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Scale className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-white">
                Conditions d'utilisation
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="prose prose-invert">
            <h3 className="text-lg font-semibold text-white">
              Accès à la plateforme
            </h3>
            <p>
              L'accès à la plateforme est réservé aux étudiants et enseignants
              du Master DSN. L'utilisation de la plateforme est soumise à
              l'acceptation pleine et entière des présentes conditions
              d'utilisation.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6">
              Compte utilisateur
            </h3>
            <p>
              Les utilisateurs sont responsables de la préservation de la
              confidentialité de leur compte et de leur mot de passe. Ils
              s'engagent à informer immédiatement l'administration de la
              plateforme de toute utilisation non autorisée de leur compte.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6">
              Comportement
            </h3>
            <p>Les utilisateurs s'engagent à :</p>
            <ul className="space-y-2">
              <li>Respecter les droits de propriété intellectuelle</li>
              <li>Ne pas diffuser de contenus illégaux ou inappropriés</li>
              <li>Ne pas perturber le fonctionnement de la plateforme</li>
              <li>Respecter la confidentialité des informations partagées</li>
            </ul>
          </CardContent>
        </Card>

        {/* Intellectual property */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-white">
                Propriété intellectuelle
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="prose prose-invert">
            <h3 className="text-lg font-semibold text-white">
              Droits d'auteur
            </h3>
            <p>
              Les travaux déposés sur la plateforme restent la propriété
              intellectuelle de leurs auteurs. En déposant un travail, les
              étudiants accordent à l'Université une licence non exclusive
              d'utilisation à des fins pédagogiques.
            </p>

            <h3 className="text-lg font-semibold text-white mt-6">
              Utilisation des contenus
            </h3>
            <p>Les utilisateurs s'engagent à :</p>
            <ul className="space-y-2">
              <li>
                Citer la source et l'auteur pour toute utilisation d'un travail
              </li>
              <li>
                Ne pas reproduire ou diffuser les travaux sans autorisation
              </li>
              <li>Respecter le droit moral des auteurs</li>
              <li>
                Utiliser les contenus uniquement dans un cadre pédagogique
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-white mt-6">
              Protection des données
            </h3>
            <p>
              Les données personnelles collectées sont traitées conformément au
              RGPD et à la loi Informatique et Libertés. Les utilisateurs
              disposent d'un droit d'accès, de rectification et de suppression
              de leurs données.
            </p>
          </CardContent>
        </Card>

        {/* Warning */}
        <div className="bg-yellow-900/20 p-6 rounded-lg border border-yellow-700/50">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-6 w-6 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Avertissement
              </h3>
              <p className="text-slate-300">
                Le non-respect des présentes conditions d'utilisation peut
                entraîner la suspension ou la suppression du compte utilisateur,
                sans préjudice d'éventuelles poursuites judiciaires. Pour toute
                question ou signalement, veuillez contacter l'administration de
                la plateforme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
