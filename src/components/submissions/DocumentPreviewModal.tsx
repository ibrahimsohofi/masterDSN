"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DocumentPreview } from "./DocumentPreview";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  fileUrl,
  fileName,
}: DocumentPreviewModalProps) {
  // Extract file extension to determine file type
  const fileType = fileUrl.split('.').pop()?.toLowerCase() || '';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <div className="flex-1 overflow-auto">
          <DocumentPreview 
            url={fileUrl}
            fileType={fileType}
            title={fileName}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
