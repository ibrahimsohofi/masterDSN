"use client";

export const dynamic = 'force-dynamic';

import { useUserRole } from "@/lib/hooks/useUserRole";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { TeacherDashboard } from "@/components/dashboard/TeacherDashboard";

export default function DashboardPage() {
  const { isStudent, isTeacher, isLoaded } = useUserRole();

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/4" />
          <div className="h-4 bg-slate-700 rounded w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="h-32 bg-slate-700 rounded" />
            <div className="h-32 bg-slate-700 rounded" />
            <div className="h-32 bg-slate-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isStudent && <StudentDashboard />}
      {isTeacher && <TeacherDashboard />}
    </div>
  );
}
