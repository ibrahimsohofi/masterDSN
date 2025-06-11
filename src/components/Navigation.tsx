"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  BookOpen,
  Shield,
  Menu,
  X,
  Upload,
  Search,
  User,
  Settings,
  FileText,
  Users,
  LogOut,
  GraduationCap,
  School,
  type LucideIcon,
} from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useUserRole } from "@/lib/hooks/useUserRole";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  protected?: boolean;
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { role, isStudent, isTeacher } = useUserRole();

  const getNavItems = (): NavItem[] => {
    const items: NavItem[] = [
      { href: "/", label: "Accueil", icon: BookOpen },
      { href: "/catalog", label: "Catalogue", icon: Search },
    ];

    if (isSignedIn) {
      if (isStudent) {
        items.push(
          { href: "/deposit", label: "Déposer", icon: Upload, protected: true },
          {
            href: "/dashboard",
            label: "Mes travaux",
            icon: FileText,
            protected: true,
          },
        );
      }

      if (isTeacher) {
        items.push(
          {
            href: "/dashboard",
            label: "Tableau de bord",
            icon: Settings,
            protected: true,
          },
          {
            href: "/students",
            label: "Étudiants",
            icon: Users,
            protected: true,
          },
        );
      }

      items.push({ href: "/resources", label: "Ressources", icon: BookOpen });
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Logo size="sm" showText={false} />
            <div className="hidden sm:block">
              <span className="font-bold text-white">Master DSN</span>
              <p className="text-xs text-slate-400 -mt-1">
                Plateforme collaborative
              </p>
            </div>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors duration-200"
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Boutons d'action desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {!isSignedIn ? (
              <>
                <SignInButton>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-white border-slate-600 hover:border-blue-500"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Se connecter
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Inscription
                  </Button>
                </SignUpButton>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                {role && (
                  <span className="flex items-center text-sm text-slate-400">
                    {isStudent ? (
                      <>
                        <GraduationCap size={16} className="mr-1" />
                        Étudiant
                      </>
                    ) : (
                      <>
                        <School size={16} className="mr-1" />
                        Enseignant
                      </>
                    )}
                  </span>
                )}
                <UserButton
                  appearance={{
                    elements: {
                      userButtonBox: "h-8 w-8",
                      userButtonTrigger: "h-8 w-8",
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            )}
          </div>

          {/* Menu burger mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900/98 backdrop-blur-md border-b border-slate-700 animate-fade-in">
            <div className="container mx-auto px-4 py-6">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 text-slate-300 hover:text-blue-400 transition-colors duration-200 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                ))}

                <div className="pt-4 border-t border-slate-700 space-y-3">
                  {!isSignedIn ? (
                    <>
                      <SignInButton>
                        <Button
                          variant="outline"
                          className="w-full text-white border-slate-600 hover:border-blue-500"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Se connecter
                        </Button>
                      </SignInButton>
                      <SignUpButton>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          Inscription
                        </Button>
                      </SignUpButton>
                    </>
                  ) : (
                    <div className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <UserButton
                          appearance={{
                            elements: {
                              userButtonBox: "h-8 w-8",
                              userButtonTrigger: "h-8 w-8",
                            },
                          }}
                          afterSignOutUrl="/"
                        />
                        <div className="text-sm">
                          <p className="font-medium">
                            {user?.fullName || user?.username}
                          </p>
                          <p className="text-slate-400 text-xs">
                            {role && (isStudent ? "Étudiant" : "Enseignant")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
