import { RoleSelectionForm } from "@/components/RoleSelectionForm";

export const dynamic = 'force-dynamic';

export default function RoleSelectionPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <RoleSelectionForm />
      </div>
    </div>
  );
}
