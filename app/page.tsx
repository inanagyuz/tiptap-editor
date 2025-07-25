'use client';
import Image from 'next/image';
import { ModeToggle } from '@/components/modeToggle';
import { Tiptap } from '@/components/tiptap-editor';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
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
import React from 'react';

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
   const [jsonData, setJsonData] = React.useState<string | null>(null);
   const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
         content: content,
      },
   });
   function onSubmit(data: z.infer<typeof FormSchema>) {
      setJsonData(JSON.stringify(data.content, null, 2));
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
            {jsonData && (
               <div className="w-full max-w-4xl">
                  <h2 className="text-xl font-semibold mb-4">Submitted JSON Content</h2>
                  <pre className="bg-neutral-950 p-4 rounded-md overflow-x-auto">
                     <code className="text-white">{jsonData}</code>
                  </pre>
               </div>
            )}
         </main>
         <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
            <a
               className="flex items-center gap-2 hover:underline hover:underline-offset-4"
               href="https://github.com/inanagyuz/tiptap-editor"
               target="_blank"
               rel="noopener noreferrer"
            >
               <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
               Learn
            </a>
            <a
               className="flex items-center gap-2 hover:underline hover:underline-offset-4"
               href="https://github.com/inanagyuz/tiptap-editor/blob/main/README.md"
               target="_blank"
               rel="noopener noreferrer"
            >
               <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
               Examples
            </a>
            <a
               className="flex items-center gap-2 hover:underline hover:underline-offset-4"
               href="https://www.inanagyuz.com.tr"
               target="_blank"
               rel="noopener noreferrer"
            >
               <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
               www.inanagyuz.com.tr
            </a>
         </footer>
      </div>
   );
}
