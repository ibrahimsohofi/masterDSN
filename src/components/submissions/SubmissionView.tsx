import { useState, useEffect } from "react";
import { IPRightsManager } from "../ip-rights/IPRightsManager";
import { IPRightsService } from "@/lib/services/ipRightsService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SubmissionViewProps {
  submission: {
    id: string;
    title: string;
    fileUrl: string;
    userId: string;
  };
  currentUserId: string;
}

interface IPRights {
  id: string;
  rightsType: string;
  status: string;
  jurisdiction: string;
  registrationNumber?: string;
  filingDate: string;
  expirationDate?: string;
  description: string;
  licensingTerms?: string;
}

export function SubmissionView({
  submission,
  currentUserId,
}: SubmissionViewProps) {
  const [ipRights, setIpRights] = useState<IPRights | null>(null);
  const ipRightsService = new IPRightsService();

  const fetchIPRights = async () => {
    try {
      const res = await fetch(`/api/ip-rights?submissionId=${submission.id}`);
      const rights = await res.json();
      setIpRights(rights);
    } catch (error) {
      console.error("Failed to fetch IP rights:", error);
    }
  };

  useEffect(() => {
    fetchIPRights();
  }, [submission.id]);

  const handleDownload = async () => {
    try {
      // Check IP rights before allowing download
      if (ipRights) {
        await ipRightsService.checkAccess(
          ipRights.id,
          currentUserId,
          "download",
        );

        // Log the usage
        await ipRightsService.logUsage({
          ipRightsId: ipRights.id,
          userId: currentUserId,
          accessType: "download",
          purpose: "File download",
          approved: true,
          ipAddress: "", // This would be set by the server
          userAgent: navigator.userAgent,
        });
      }

      // If there are no IP rights or access is granted, proceed with download
      window.open(submission.fileUrl);
    } catch (error) {
      toast.error(
        "Access denied: You do not have permission to download this file",
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{submission.title}</h2>
        {ipRights && (
          <Badge
            variant={ipRights.status === "approved" ? "success" : "warning"}
          >
            {ipRights.rightsType} - {ipRights.status}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleDownload}>Download</Button>

        {submission.userId === currentUserId && (
          <IPRightsManager
            submissionId={submission.id}
            userId={currentUserId}
            onUpdate={() => {
              // Refresh IP rights data
              fetchIPRights();
            }}
          />
        )}
      </div>

      {ipRights && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">IP Rights Information</h3>
          <p>
            <strong>Type:</strong> {ipRights.rightsType}
          </p>
          <p>
            <strong>Status:</strong> {ipRights.status}
          </p>
          <p>
            <strong>Jurisdiction:</strong> {ipRights.jurisdiction}
          </p>
          {ipRights.registrationNumber && (
            <p>
              <strong>Registration:</strong> {ipRights.registrationNumber}
            </p>
          )}
          <p>
            <strong>Filing Date:</strong>{" "}
            {new Date(ipRights.filingDate).toLocaleDateString()}
          </p>
          {ipRights.expirationDate && (
            <p>
              <strong>Expiration Date:</strong>{" "}
              {new Date(ipRights.expirationDate).toLocaleDateString()}
            </p>
          )}
          <p>
            <strong>Description:</strong> {ipRights.description}
          </p>
          {ipRights.licensingTerms && (
            <div>
              <strong>Licensing Terms:</strong>
              <p className="whitespace-pre-wrap">{ipRights.licensingTerms}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
