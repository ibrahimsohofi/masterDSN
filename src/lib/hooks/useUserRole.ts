// import { useUser } from "@clerk/nextjs";
import type { UserRole } from "../types";

export function useUserRole() {
  // Clerk authentication is temporarily disabled
  const user = null;
  const isLoaded = true;
  const role = undefined as UserRole | undefined;

  return {
    role,
    isStudent: role === "student",
    isTeacher: role === "teacher",
    isLoaded,
  };
}
