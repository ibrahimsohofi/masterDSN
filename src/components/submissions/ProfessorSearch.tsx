import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface Professor {
  id: string;
  name: string;
  email: string;
}

interface ProfessorSearchProps {
  onSelect: (professor: Professor) => void;
}

export function ProfessorSearch({ onSelect }: ProfessorSearchProps) {
  const [query, setQuery] = useState("");
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const searchProfessors = async () => {
      if (!debouncedQuery) {
        setProfessors([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/users/search?query=${encodeURIComponent(debouncedQuery)}&role=TEACHER`,
        );
        const data = await response.json();
        setProfessors(data.users);
      } catch (error) {
        console.error("Error searching professors:", error);
      } finally {
        setLoading(false);
      }
    };

    searchProfessors();
  }, [debouncedQuery]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Search Professor</CardTitle>
        <CardDescription>
          Search for a professor by name or email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search professors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
          <div className="space-y-2">
            {loading && <div>Loading...</div>}
            {professors.map((professor) => (
              <Button
                key={professor.id}
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => onSelect(professor)}
              >
                <div>
                  <div className="font-medium">{professor.name}</div>
                  <div className="text-sm text-gray-500">{professor.email}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
