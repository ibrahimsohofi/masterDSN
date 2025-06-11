import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  FileIcon,
  DownloadIcon,
  EyeIcon,
  SearchIcon,
  XIcon,
  GridIcon,
  ListIcon,
  MoreVerticalIcon,
} from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentPreview } from "./DocumentPreview";
import { SortableSubmissionItem } from "./SortableSubmissionItem";
import { MobileActionSheet } from "./MobileActionSheet";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { Toaster } from "sonner";
import { VirtualizedList } from "./VirtualizedList";
import { useOptimizedImage } from "@/lib/hooks/useOptimizedImage";

interface Submission {
  id: string;
  title: string;
  description: string;
  fileType: string;
  fileUrl: string;
  submissionDate: string;
  views: number;
  downloads: number;
  author: {
    name: string;
    email: string;
  };
  module: {
    code: string;
    name: string;
  };
}

interface Stats {
  total: number;
  byFileType: Array<{ type: string; count: number }>;
  byModule: Array<{ code: string; count: number }>;
}

interface SubmissionsListProps {
  supervisorId: string;
}

interface BatchOperation {
  type: "move" | "status" | "share" | "rename";
  value: string;
}

export function SubmissionsList({ supervisorId }: SubmissionsListProps) {
  const [submissions, setSubmissions] = useState<Record<string, Submission[]>>(
    {},
  );
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState<string>("");
  const [moduleCode, setModuleCode] = useState<string>("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(
    new Set(),
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [items, setItems] = useState<Submission[]>([]);
  const [batchOperation, setBatchOperation] = useState<BatchOperation | null>(
    null,
  );
  const isMobile = useMediaQuery("(max-width: 768px)");
  const itemHeight = isMobile ? 80 : 100;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Keyboard shortcuts
  useHotkeys("ctrl+f", (e) => {
    e.preventDefault();
    document
      .querySelector<HTMLInputElement>(
        'input[placeholder="Search submissions..."]',
      )
      ?.focus();
  });

  useHotkeys("ctrl+a", (e) => {
    e.preventDefault();
    const allIds = Object.values(submissions)
      .flat()
      .map((s) => s.id);
    setSelectedSubmissions(new Set(allIds));
  });

  useHotkeys("escape", () => {
    setSelectedSubmissions(new Set());
    setSearchQuery("");
  });

  useHotkeys("ctrl+d", (e) => {
    e.preventDefault();
    if (selectedSubmissions.size > 0) {
      handleBulkDownload();
    }
  });

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!supervisorId) return;

      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          supervisorId,
          ...(fileType && { fileType }),
          ...(moduleCode && { moduleCode }),
          page: page.toString(),
          sortBy,
          sortOrder,
        });

        const response = await fetch(
          `/api/submissions/by-supervisor?${queryParams}`,
        );
        const data = await response.json();
        setSubmissions(data.submissions);
        setStats(data.stats);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [supervisorId, fileType, moduleCode, page, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const filteredSubmissions = Object.entries(submissions).reduce(
    (acc, [type, items]) => {
      const filtered = items.filter(
        (submission) =>
          submission.title
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          submission.description
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          submission.author.name
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()),
      );
      if (filtered.length > 0) {
        acc[type] = filtered;
      }
      return acc;
    },
    {} as Record<string, Submission[]>,
  );

  const handleSelectAll = (type: string) => {
    const typeSubmissions = submissions[type] || [];
    const typeIds = new Set(typeSubmissions.map((s) => s.id));

    if (typeSubmissions.every((s) => selectedSubmissions.has(s.id))) {
      // Deselect all of this type
      setSelectedSubmissions((prev) => {
        const next = new Set(prev);
        typeIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      // Select all of this type
      setSelectedSubmissions((prev) => {
        const next = new Set(prev);
        typeIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const handleBulkDownload = async () => {
    try {
      const response = await fetch("/api/submissions/bulk-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionIds: Array.from(selectedSubmissions),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Create a blob from the response
      const blob = await response.blob();

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "submissions.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading files:", error);
      // You might want to show a toast notification here
    }
  };

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleBatchOperation = async (operation: BatchOperation) => {
    const selectedFiles = Object.values(submissions)
      .flat()
      .filter((s) => selectedSubmissions.has(s.id));

    try {
      switch (operation.type) {
        case "move":
          // Call API to move files to new module
          toast.success(
            `Moving ${selectedFiles.length} files to ${operation.value}`,
          );
          break;
        case "status":
          // Call API to update status
          toast.success(
            `Marking ${selectedFiles.length} files as ${operation.value}`,
          );
          break;
        case "share":
          // Call API to share files
          toast.success(`Sharing ${selectedFiles.length} files`);
          break;
        case "rename":
          // Call API to rename files
          toast.success(`Renaming ${selectedFiles.length} files`);
          break;
      }
    } catch (error) {
      toast.error("Operation failed. Please try again.");
    }
  };

  const renderSubmissionItem = useCallback(
    (submission: any, index: number) => {
      const { src: optimizedThumbnail } = useOptimizedImage(
        submission.fileUrl,
        {
          quality: 60,
          maxWidth: isMobile ? 100 : 150,
          format: "webp",
        },
      );

      return (
        <SortableSubmissionItem
          key={submission.id}
          submission={{
            ...submission,
            thumbnail: optimizedThumbnail,
          }}
          selected={false}
          onSelect={() => {}}
          onMove={() =>
            handleBatchOperation({ type: "move", value: "new_module" })
          }
          onShare={() =>
            handleBatchOperation({ type: "share", value: "share" })
          }
        />
      );
    },
    [isMobile, handleBatchOperation],
  );

  if (loading) return <div>Loading...</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <Toaster position={isMobile ? "bottom-center" : "top-right"} />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Submissions Overview</CardTitle>
              <CardDescription>
                Total Submissions: {stats.total}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {!isMobile && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setViewMode(viewMode === "list" ? "grid" : "list")
                  }
                >
                  {viewMode === "list" ? (
                    <GridIcon className="h-4 w-4" />
                  ) : (
                    <ListIcon className="h-4 w-4" />
                  )}
                </Button>
              )}
              <MobileActionSheet
                selectedCount={selectedSubmissions.size}
                onDownloadSelected={handleBulkDownload}
                onShare={() =>
                  handleBatchOperation({ type: "share", value: "share" })
                }
                onMarkReviewed={() =>
                  handleBatchOperation({ type: "status", value: "reviewed" })
                }
                onMove={() =>
                  handleBatchOperation({ type: "move", value: "new_module" })
                }
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                fileType={fileType}
                onFileTypeChange={setFileType}
                moduleCode={moduleCode}
                onModuleCodeChange={setModuleCode}
                sortBy={sortBy}
                onSortChange={handleSort}
                modules={stats.byModule.map(item => ({ ...item, name: item.code }))}
                fileTypes={stats.byFileType}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isMobile && (
            <div className="flex gap-4 mb-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search submissions... (Ctrl+F)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => setSearchQuery("")}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <Select value={fileType} onValueChange={setFileType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="File type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {stats.byFileType.map(({ type }) => (
                    <SelectItem key={type} value={type}>
                      {type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={moduleCode} onValueChange={setModuleCode}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Modules</SelectItem>
                  {stats.byModule.map(({ code }) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedSubmissions.size > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    onClick={handleBulkDownload}
                    className="whitespace-nowrap"
                  >
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download ({selectedSubmissions.size})
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() =>
                          handleBatchOperation({
                            type: "status",
                            value: "reviewed",
                          })
                        }
                      >
                        Mark as Reviewed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() =>
                          handleBatchOperation({
                            type: "move",
                            value: "new_module",
                          })
                        }
                      >
                        Move to Module
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() =>
                          handleBatchOperation({
                            type: "share",
                            value: "share",
                          })
                        }
                      >
                        Share Selected
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() =>
                          handleBatchOperation({
                            type: "rename",
                            value: "rename",
                          })
                        }
                      >
                        Batch Rename
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          )}

          {isMobile && (
            <div className="mb-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search submissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setSearchQuery("")}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {viewMode === "list" ? (
              <div>
                {Object.entries(filteredSubmissions).map(([type, items]) => (
                  <div key={type} className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold">
                        {type.toUpperCase()} ({items.length})
                      </h3>
                      <Checkbox
                        checked={items.every((s) =>
                          selectedSubmissions.has(s.id),
                        )}
                        onCheckedChange={() => handleSelectAll(type)}
                        className="ml-auto"
                      />
                    </div>
                    <div
                      className={`rounded-lg overflow-hidden ${isMobile ? "border border-border" : ""}`}
                    >
                      <SortableContext
                        items={items.map((s) => s.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <VirtualizedList
                          items={items}
                          renderItem={renderSubmissionItem}
                          itemHeight={itemHeight}
                          overscan={3}
                          onEndReached={() => {
                            // Implement infinite loading logic here if needed
                          }}
                        />
                      </SortableContext>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <SortableContext
                  items={Object.values(filteredSubmissions)
                    .flat()
                    .map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <VirtualizedList
                    items={Object.values(filteredSubmissions).flat()}
                    renderItem={renderSubmissionItem}
                    itemHeight={itemHeight}
                    overscan={3}
                    onEndReached={() => {
                      // Implement infinite loading logic here if needed
                    }}
                  />
                </SortableContext>
              </div>
            )}
          </DndContext>

          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((p) => p + 1)}
              disabled={
                !Object.values(filteredSubmissions).some(
                  (items) => items.length > 0,
                )
              }
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
