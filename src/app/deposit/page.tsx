"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Calendar,
  User,
} from "lucide-react";
import { SubmissionForm } from "@/components/SubmissionForm";

export default function DepositPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Déposer un travail</h1>
        <p className="text-slate-400 mb-8">
          Utilisez ce formulaire pour soumettre vos travaux académiques.
          Assurez-vous de remplir tous les champs requis et de respecter les
          formats de fichiers autorisés.
        </p>
        <SubmissionForm />
      </div>
    </div>
  );
}
