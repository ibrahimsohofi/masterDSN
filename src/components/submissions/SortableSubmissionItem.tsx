import { useState, memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileIcon,
  DownloadIcon,
  EyeIcon,
  GripVertical,
  MoreVerticalIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentPreview } from "./DocumentPreview";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useThrottle, useRAF } from "@/lib/hooks/usePerformance";
import { cn } from "@/lib/utils";

interface SortableSubmissionItemProps {
  submission: any;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  viewMode?: "list" | "grid";
  onPreview?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  onMove?: () => void;
}

export const SortableSubmissionItem = memo(function SortableSubmissionItem({
  submission,
  selected,
  onSelect,
  viewMode = "list",
  onPreview,
  onDownload,
  onShare,
  onMove,
}: SortableSubmissionItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: submission.id,
    disabled: isMobile, // Disable drag on mobile
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isMobile ? "default" : "grab",
  };

  // Throttle drag events
  const throttledListeners = {
    ...listeners,
    onDragStart: useThrottle((listeners?.onDragStart || (() => {})) as (...args: any[]) => any, { wait: 100 }),
    onDragMove: useThrottle((listeners?.onDragMove || (() => {})) as (...args: any[]) => any, { wait: 16 }),
    onDragEnd: useThrottle((listeners?.onDragEnd || (() => {})) as (...args: any[]) => any, { wait: 100 }),
  };

  // Use RAF for smooth animations
  const handlePreview = useRAF(onPreview || (() => {}));
  const handleDownload = useRAF(onDownload || (() => {}));
  const handleShare = useRAF(onShare || (() => {}));
  const handleMove = useRAF(onMove || (() => {}));

  const handleCardClick = () => {
    if (isMobile) {
      onSelect(!selected);
    }
  };

  if (viewMode === "grid") {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className={`relative ${selected ? "ring-2 ring-primary" : ""} ${isMobile ? "active:scale-95 transition-transform" : ""}`}
        onClick={handleCardClick}
      >
        <div
          className="absolute top-2 right-2 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(!selected);
          }}
        >
          <Checkbox checked={selected} className="touch-manipulation" />
        </div>
        {!isMobile && (
          <div
            {...attributes}
            {...throttledListeners}
            className="absolute top-2 left-2"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <CardContent className={`pt-8 ${isMobile ? "pb-4" : "pb-6"}`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <FileIcon className="h-8 w-8 shrink-0 text-muted-foreground" />
              <div>
                <div className="font-medium line-clamp-2">
                  {submission.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  by {submission.author.name}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="w-fit">
              {submission.module.code}
            </Badge>
            <div className="text-sm text-muted-foreground">
              {new Date(submission.submissionDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <EyeIcon className="h-4 w-4" />
                {submission.views}
              </div>
              <div className="flex items-center gap-1">
                <DownloadIcon className="h-4 w-4" />
                {submission.downloads}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {isMobile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <MoreVerticalIcon className="h-4 w-4" />
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleDownload}>
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleShare}>
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleMove}>
                      Move
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1">
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[80vh]">
                      <DocumentPreview
                        url={submission.fileUrl}
                        fileType={submission.fileType}
                        title={submission.title}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`${selected ? "bg-muted/50" : ""} ${isMobile ? "active:bg-muted/30" : ""}`}
      onClick={isMobile ? handleCardClick : undefined}
    >
      <td className="w-[30px]">
        <div className="flex items-center gap-2">
          {!isMobile && (
            <div {...attributes} {...throttledListeners}>
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            </div>
          )}
          <Checkbox
            checked={selected}
            onCheckedChange={onSelect}
            className="touch-manipulation"
          />
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <FileIcon className="h-4 w-4" />
          <div>
            <div className="font-medium">{submission.title}</div>
            <div className="text-sm text-muted-foreground">
              by {submission.author.name}
            </div>
          </div>
        </div>
      </td>
      <td>
        <Badge variant="outline">{submission.module.code}</Badge>
      </td>
      <td>{new Date(submission.submissionDate).toLocaleDateString()}</td>
      <td>
        <div className="flex items-center gap-2">
          <EyeIcon className="h-4 w-4" />
          {submission.views}
          <DownloadIcon className="h-4 w-4 ml-2" />
          {submission.downloads}
        </div>
      </td>
      <td>
        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleDownload}>
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleShare}>Share</DropdownMenuItem>
              <DropdownMenuItem onSelect={handleMove}>Move</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl h-[80vh]">
                <DocumentPreview
                  url={submission.fileUrl}
                  fileType={submission.fileType}
                  title={submission.title}
                />
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              Download
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
});
