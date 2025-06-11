import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MenuIcon,
  FilterIcon,
  DownloadIcon,
  Share2Icon,
  CheckIcon,
  FolderIcon,
  TypeIcon,
  CalendarIcon,
  GridIcon,
  ListIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MobileActionSheetProps {
  selectedCount: number;
  onDownloadSelected: () => void;
  onShare: () => void;
  onMarkReviewed: () => void;
  onMove: () => void;
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  fileType: string;
  onFileTypeChange: (type: string) => void;
  moduleCode: string;
  onModuleCodeChange: (code: string) => void;
  sortBy: string;
  onSortChange: (field: string) => void;
  modules: Array<{ code: string; name: string }>;
  fileTypes: Array<{ type: string; count: number }>;
}

export function MobileActionSheet({
  selectedCount,
  onDownloadSelected,
  onShare,
  onMarkReviewed,
  onMove,
  viewMode,
  onViewModeChange,
  fileType,
  onFileTypeChange,
  moduleCode,
  onModuleCodeChange,
  sortBy,
  onSortChange,
  modules,
  fileTypes,
}: MobileActionSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <MenuIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Actions & Filters</SheetTitle>
          <SheetDescription>
            Manage your submissions and apply filters
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-full py-4">
          {selectedCount > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-medium">
                Selected Items ({selectedCount})
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onDownloadSelected}
                >
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="w-full" onClick={onShare}>
                  <Share2Icon className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onMarkReviewed}
                >
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Mark Reviewed
                </Button>
                <Button variant="outline" className="w-full" onClick={onMove}>
                  <FolderIcon className="h-4 w-4 mr-2" />
                  Move
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">View</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => onViewModeChange("list")}
                >
                  <ListIcon className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => onViewModeChange("grid")}
                >
                  <GridIcon className="h-4 w-4 mr-2" />
                  Grid
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Filters</h3>
              <div className="space-y-2">
                <Select value={fileType} onValueChange={onFileTypeChange}>
                  <SelectTrigger className="w-full">
                    <TypeIcon className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="File Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {fileTypes.map(({ type, count }) => (
                      <SelectItem key={type} value={type}>
                        {type.toUpperCase()} ({count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={moduleCode} onValueChange={onModuleCodeChange}>
                  <SelectTrigger className="w-full">
                    <FolderIcon className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Modules</SelectItem>
                    {modules.map(({ code, name }) => (
                      <SelectItem key={code} value={code}>
                        {code} - {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger className="w-full">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="module">Module</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ScrollArea>
        <SheetFooter className="mt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onFileTypeChange("")}
          >
            Clear Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
