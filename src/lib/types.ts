export type UserRole = "student" | "teacher";

export interface UserMetadata {
  role: UserRole;
  studentId?: string;
  teacherId?: string;
  department?: string;
}

export interface SubmissionMetadata {
  title: string;
  description: string;
  module: string;
  submissionDate: Date;
  author: {
    id: string;
    name: string;
    role: UserRole;
  };
  supervisor?: {
    id: string;
    name: string;
  };
  fileUrl: string;
  fileType: string;
  views: number;
  downloads: number;
}
