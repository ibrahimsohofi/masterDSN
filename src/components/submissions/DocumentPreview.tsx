import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import DocViewer from '@cyntler/react-doc-viewer';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PreviewRow = Record<string, any>;

export interface DocumentPreviewProps {
  url: string;
  fileType: string;
  title: string;
  className?: string;
  onError?: (error: Error) => void;
}

export function DocumentPreview({
  url,
  fileType = '',
  title,
  className = '',
  onError,
}: DocumentPreviewProps) {
  const [previewContent, setPreviewContent] = useState<PreviewRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const normalizedFileType = fileType.toLowerCase();

  useEffect(() => {
    const loadDocument = async () => {
      if (!url) {
        const err = new Error('No document URL provided');
        setError(err);
        onError?.(err);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        if (isSpreadsheetFile(normalizedFileType)) {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch document: ${response.statusText}`);

          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json<PreviewRow>(worksheet);
          setPreviewContent(jsonData);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load document');
        console.error('Error loading document:', error);
        setError(error);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [url, normalizedFileType, onError]);

  const isSpreadsheetFile = (type: string): boolean => {
    return type.includes('excel') ||
           type.includes('spreadsheet') ||
           type.endsWith('xlsx') ||
           type.endsWith('xls') ||
           type.endsWith('csv');
  };

  const isDocumentFile = (type: string): boolean => {
    return type.includes('pdf') ||
           type.includes('word') ||
           type.includes('document') ||
           type.includes('presentation') ||
           type.endsWith('pdf') ||
           type.endsWith('doc') ||
           type.endsWith('docx') ||
           type.endsWith('ppt') ||
           type.endsWith('pptx');
  };

  const renderPreview = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading document preview...</p>
        </div>
      );
    }


    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 gap-4 p-4 text-center">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <div>
            <h3 className="font-medium">Failed to load document</h3>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      );
    }

    if (isDocumentFile(normalizedFileType)) {
      return (
        <DocViewer
          documents={[{ uri: url, fileType: normalizedFileType }]}
          className="w-full h-full min-h-[500px]"
          config={{
            header: {
              disableHeader: false,
              disableFileName: false,
              retainURLParams: false,
            },
          }}
        />
      );
    }

    if (isSpreadsheetFile(normalizedFileType) && previewContent.length > 0) {
      const headers = Object.keys(previewContent[0] || {});

      return (
        <div className="overflow-auto max-h-[600px] border rounded-md">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-muted/50">
              <tr>
                {headers.map((header) => (
                  <th key={header} className="p-2 text-left border">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewContent.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b hover:bg-muted/50">
                  {headers.map((header) => (
                    <td key={`${rowIndex}-${header}`} className="p-2 border">
                      {String(row[header] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Fallback for unsupported file types
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 p-4 text-center">
        <FileText className="w-12 h-12 text-muted-foreground" />
        <div>
          <h3 className="font-medium">Preview not available</h3>
          <p className="text-sm text-muted-foreground">
            This file type cannot be previewed. Please download the file to view it.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href={url} download={title} target="_blank" rel="noopener noreferrer">
            Download File
          </a>
        </Button>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium truncate" title={title}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {renderPreview()}
      </CardContent>
    </Card>
  );
}
