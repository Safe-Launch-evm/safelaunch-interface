import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

import { profileSchema } from '@/lib/validations/profile-schema';
import Form, { useZodForm } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

export default function RegisterUserForm() {
  const form = useZodForm({
    schema: profileSchema
  });

  return (
    <AlertDialogContent className="rounded-xl px-8 py-6">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-[1.123rem]/[1.125rem] font-bold">
          Setup profile
        </AlertDialogTitle>
        <AlertDialogDescription className="sr-only">
          Profile modal to edit profile.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <Form form={form} className="w-full">
        <div></div>
        <div className="flex w-full flex-col gap-6">
          <Input label="Token symbol" placeholder="Symbol" {...form.register('username')} />
          <Textarea placeholder="Enter text" label="Bio" {...form.register('bio')} />
          <div className="flex items-center justify-end gap-4">
            <Button variant={'ghost'} className="text-foreground">
              Skip
            </Button>
            <Button>Save</Button>
          </div>
        </div>
      </Form>
    </AlertDialogContent>
  );
}
