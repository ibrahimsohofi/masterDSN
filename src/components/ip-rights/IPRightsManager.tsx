import { useState } from "react";
import type { IPRights } from "@/lib/models/IPRights";
import { IPRightsService } from "@/lib/services/ipRightsService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IPRightsSchema } from "@/lib/models/IPRights";
import { toast } from "sonner";

interface IPRightsManagerProps {
  submissionId: string;
  userId: string;
  onUpdate?: () => void;
}

export function IPRightsManager({
  submissionId,
  userId,
  onUpdate,
}: IPRightsManagerProps) {
  const [open, setOpen] = useState(false);
  const ipRightsService = new IPRightsService();

  const form = useForm<IPRights>({
    resolver: zodResolver(IPRightsSchema),
    defaultValues: {
      submissionId,
      userId,
      rightsType: "copyright",
      status: "pending",
      filingDate: new Date(),
      jurisdiction: "Global",
      restrictions: [],
    },
  });

  const onSubmit = async (data: IPRights) => {
    try {
      await ipRightsService.createIPRights(data);
      toast.success("IP Rights registered successfully");
      setOpen(false);
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to register IP Rights");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Register IP Rights</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register Intellectual Property Rights</DialogTitle>
          <DialogDescription>
            Protect your intellectual property by registering your rights.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rightsType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rights Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rights type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="copyright">Copyright</SelectItem>
                      <SelectItem value="patent">Patent</SelectItem>
                      <SelectItem value="trademark">Trademark</SelectItem>
                      <SelectItem value="trade_secret">Trade Secret</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of intellectual property right you want to
                    register.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your intellectual property..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of your intellectual
                    property.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jurisdiction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jurisdiction</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Specify the jurisdiction where these rights apply.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="licensingTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Licensing Terms</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Specify licensing terms..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Define the terms under which others can use your
                    intellectual property.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Register Rights</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
