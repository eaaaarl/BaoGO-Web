import React from "react";
import { Profile } from "../api/interface";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditUserProfileMutation } from "../api/userApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: Profile | null;
}

const userEditSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  mobile_no: z
    .string()
    .regex(/^09\d{9}$/, "Invalid mobile number format (09xxxxxxxxx)"),
});

export default function UserEditModal({ open, onClose, user }: UserEditModalProps) {
  const form = useForm<z.infer<typeof userEditSchema>>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      full_name: user?.full_name ?? "",
      mobile_no: user?.phone_number ?? "",
    },
  });

  React.useEffect(() => {
    form.reset({
      full_name: user?.full_name ?? "",
      mobile_no: user?.phone_number ?? "",
    });
  }, [user, form]);

  const [updateProfile, { isLoading }] = useEditUserProfileMutation()

  const onSubmit = async (values: z.infer<typeof userEditSchema>) => {
    try {
      const res = await updateProfile({
        full_name: values.full_name,
        phone_number: values.mobile_no,
        user_id: user?.id ?? ''
      })

      toast.success(res.data?.meta.message)

      onClose()
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <Label>Name</Label>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mobile_no"
              render={({ field }) => (
                <FormItem>
                  <Label>Mobile Number</Label>
                  <FormControl>
                    <Input placeholder="09xxxxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button disabled={isLoading} type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit"> {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
