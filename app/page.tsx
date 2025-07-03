'use client';
import Image from 'next/image';
import { ModeToggle } from '@/components/modeToggle';
import { Tiptap } from '@/components/tiptap-editor';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod/v4';
import { Button } from '@/components/ui/button';
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';

const FormSchema = z.object({
   content: z.any().refine(
      (value) => {
         if (
            typeof value === 'object' &&
            value !== null &&
            value.type === 'doc' &&
            Array.isArray(value.content) &&
            value.content.length > 0 &&
            value.content.some(
               (item: { type: string; content: string | unknown[] }) =>
                  Array.isArray(item.content) && item.content.length > 0
            )
         ) {
            return true;
         }
         return false;
      },
      {
         message: 'Content must be a valid Tiptap JSONContent with non-empty paragraphs.',
      }
   ),
});
const content = null;
export default function Home() {
   const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
         content: content,
      },
   });
   function onSubmit(data: z.infer<typeof FormSchema>) {
      toast('You submitted the following values', {
         description: (
            <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
               <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
         ),
      });
   }

   return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
         <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
            <h1 className="text-3xl font-bold tracking-tight text-center sm:text-left">
               Tiptap Editor with Next.js and Tailwind CSS
            </h1>
            <ModeToggle />
            <Form {...form}>
               <form
                  onSubmit={(e) => {
                     e.preventDefault();
                     if (
                        (e.nativeEvent as SubmitEvent).submitter?.getAttribute('data-action') ===
                        'form-link'
                     ) {
                        form.handleSubmit(onSubmit)(e);
                     }
                  }}
                  className="max-w-4xl"
               >
                  <FormField
                     control={form.control}
                     name="content"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Content</FormLabel>
                           <FormControl>
                              <Controller
                                 name={`content`}
                                 control={form.control}
                                 defaultValue={field.value}
                                 render={({ field: controllerField }) => (
                                    <Tiptap
                                       key={field.value}
                                       initialValue={controllerField.value || null}
                                       onChange={(value) => controllerField.onChange(value)}
                                    />
                                 )}
                              />
                           </FormControl>
                           <FormDescription>Write your text in this area.</FormDescription>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button type="submit" data-action="form-link">
                     Submit
                  </Button>
               </form>
            </Form>
         </main>
         <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
            <a
               className="flex items-center gap-2 hover:underline hover:underline-offset-4"
               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
               target="_blank"
               rel="noopener noreferrer"
            >
               <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
               Learn
            </a>
            <a
               className="flex items-center gap-2 hover:underline hover:underline-offset-4"
               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
               target="_blank"
               rel="noopener noreferrer"
            >
               <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
               Examples
            </a>
            <a
               className="flex items-center gap-2 hover:underline hover:underline-offset-4"
               href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
               target="_blank"
               rel="noopener noreferrer"
            >
               <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
               Go to nextjs.org →
            </a>
         </footer>
      </div>
   );
}
