'use client';
import * as React from 'react';
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

import { Input } from '@/components/ui/input';
import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
} from '@/components/ui/drawer';
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Clipboard, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { imageGallerySchema, ImageGallerySchema } from '@/schemas/image-gallery';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Method = 'POST' | 'PUT' | 'DELETE';

interface MutationParams {
   data: ImageGallerySchema;
   metod: Method;
   id?: string;
}

async function mutationFn({ data, metod, id }: MutationParams) {
   const url = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
   if (!url) {
      throw new Error('NO_IMAGE_GALLERY_URL');
   }

   const response = await fetch(url, {
      method: metod,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
   });

   if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
   }

   const { data: result, status, message, error } = await response.json();

   if (status === 200) return { result, status, message, error, metod, id };
   throw error;
}

export function useFormMutation() {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn,
      onSuccess: () => {
         // Sorguyu geçersiz kılarak yeniden veri çekilmesini sağla
         queryClient.invalidateQueries({ queryKey: ['imageGallery'] });
      },
   });
}

export const defaultValues: Partial<ImageGallerySchema> = {
   id: '',
   name: '',
   fileName: '',
   type: '',
   size: 0,
   width: 0,
   height: 0,
   path: '',
   url: '',
   isActive: true,
};

interface DeleteFormProps {
   data?: ImageGallerySchema;
   onClose?: () => void;
   open?: boolean;
}

function DeleteForm({ data, onClose, open }: DeleteFormProps) {
   const { mutateAsync, isPending } = useFormMutation();

   const handleDelete = async () => {
      if (!data?.id) return;
      const loadingToast = toast.loading('DELETING');

      try {
         await mutateAsync({
            data: data,
            metod: 'DELETE',
            id: data.id,
         });
         toast.success('DELETE_SUCCESS');
         onClose?.();
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
         return toast.error(error?.message || 'DELETE_ERROR');
      } finally {
         toast.dismiss(loadingToast);
      }
   };

   return (
      <AlertDialog open={open} onOpenChange={(val) => !val && onClose?.()}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{'CONFIRM_DELETE_TITLE'}</AlertDialogTitle>
               <AlertDialogDescription>{'CONFIRM_DELETE_DESC'}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel>{'CANCEL'}</AlertDialogCancel>
               <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                  {isPending ? (
                     <>
                        {'DELETING'}
                        <Loader className="ml-2 h-4 w-4 animate-spin" />
                     </>
                  ) : (
                     'CONFIRM'
                  )}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}

interface EditFormProps {
   data?: ImageGallerySchema;
   metod?: 'POST' | 'PUT';
   onClose?: () => void;
   open?: boolean;
}

function EditForm({ data, metod = 'POST', onClose, open }: EditFormProps) {
   const isMobile = useIsMobile();
   const { mutateAsync, isPending } = useFormMutation();

   const form = useForm<ImageGallerySchema>({
      resolver: zodResolver(imageGallerySchema()),
      defaultValues: {
         ...defaultValues,
         ...data,
      },
      mode: 'onBlur',
   });

   const { isSubmitting } = form.formState;

   const handleSubmit = async (formData: ImageGallerySchema): Promise<void> => {
      const loadingToast = toast.loading(metod === 'POST' ? 'SAVING' : 'UPDATING');

      try {
         await mutateAsync(
            {
               data: formData,
               metod,
               id: data?.id,
            },
            {
               onSuccess: () => {
                  toast.success(metod === 'POST' ? 'SAVED' : 'UPDATED');
                  if (metod === 'POST') {
                     form.reset();
                  }
                  if (metod === 'PUT') {
                     onClose?.();
                  }
               },
               onError: (error: Error) => {
                  return toast.error(error?.message || 'ERROR');
               },
            }
         );
      } catch {
      } finally {
         toast.dismiss(loadingToast);
      }
   };

   return (
      <Drawer
         direction={isMobile ? 'bottom' : 'right'}
         open={open}
         onOpenChange={(val) => {
            if (!val) onClose?.();
         }}
      >
         <DrawerContent className="md:min-w-[640px] flex items-center justify-center">
            <DrawerHeader className="gap-1 w-full">
               <DrawerTitle>{metod === 'POST' ? 'ADD_CATEGORY' : 'EDIT_CATEGORY'}</DrawerTitle>
               <DrawerDescription>
                  {metod === 'POST' ? 'ADD_CATEGORY' : 'EDIT_CATEGORY'}
               </DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm w-full">
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                           control={form.control}
                           name="name"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>{'NAME'}</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder={'NAME'}
                                       {...field}
                                       className="h-8 text-sm"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="isActive"
                           render={({ field }) => (
                              <FormItem className="max-w-1/2 ">
                                 <FormLabel>{'STATUS'}</FormLabel>
                                 <FormControl className="flex flex-row items-center justify-end rounded-md border p-2 bg-muted/50 h-8  text-sm">
                                    <div>
                                       <Switch
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                       />
                                    </div>
                                 </FormControl>
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="type"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>{'TYPE'}</FormLabel>
                                 <FormControl>
                                    <Input
                                       disabled
                                       placeholder={'TYPE'}
                                       {...field}
                                       className="h-8 text-sm"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="size"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>{'SIZE'}</FormLabel>
                                 <div className="flex flex-row items-center justify-between">
                                    <FormControl>
                                       <Input
                                          disabled
                                          placeholder={'SIZE'}
                                          {...field}
                                          className="h-8 text-sm flex rounded-none rounded-l-md"
                                       />
                                    </FormControl>
                                    <FormDescription className=" bg-muted/50 px-2 h-8 text-sm items-center justify-center flex rounded-r-md">
                                       {'KB'}
                                    </FormDescription>
                                 </div>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="width"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>{'WIDTH'}</FormLabel>
                                 <FormControl>
                                    <Input
                                       disabled
                                       placeholder={'WIDTH'}
                                       {...field}
                                       className="h-8 text-sm"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="height"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>{'HEIGHT'}</FormLabel>
                                 <FormControl>
                                    <Input
                                       disabled
                                       placeholder={'HEIGHT'}
                                       {...field}
                                       className="h-8 text-sm"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="fileName"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>{'FILE_NAME'}</FormLabel>
                                 <div className="flex flex-row items-center justify-between">
                                    <FormControl>
                                       <Input
                                          disabled
                                          placeholder={'FILE_NAME'}
                                          {...field}
                                          className="h-8 text-sm flex rounded-none rounded-l-md"
                                       />
                                    </FormControl>
                                    <FormDescription className=" bg-muted/50 px-2 h-8 text-sm items-center justify-center flex rounded-r-md">
                                       <Clipboard
                                          onClick={() => {
                                             navigator.clipboard.writeText(field.value ?? '');
                                          }}
                                          className="size-4 text-muted-foreground cursor-pointer hover:text-primary"
                                       />
                                    </FormDescription>
                                 </div>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="path"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>{'PATH'}</FormLabel>
                                 <div className="flex flex-row items-center justify-between">
                                    <FormControl>
                                       <Input
                                          disabled
                                          placeholder={'PATH'}
                                          {...field}
                                          className="h-8 text-sm flex rounded-none rounded-l-md"
                                       />
                                    </FormControl>
                                    <FormDescription className=" bg-muted/50 px-2 h-8 text-sm items-center justify-center flex rounded-r-md">
                                       <Clipboard
                                          onClick={() => {
                                             navigator.clipboard.writeText(field.value ?? '');
                                          }}
                                          className="size-4 text-muted-foreground cursor-pointer hover:text-primary"
                                       />
                                    </FormDescription>
                                 </div>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="url"
                           render={({ field }) => (
                              <FormItem className="col-span-1 md:col-span-2 w-full">
                                 <FormLabel>{'URL'}</FormLabel>
                                 <div className="flex flex-row items-center justify-between">
                                    <FormControl>
                                       <Input
                                          disabled
                                          placeholder={'URL'}
                                          {...field}
                                          className="h-8 text-sm flex rounded-none rounded-l-md"
                                       />
                                    </FormControl>
                                    <FormDescription className=" bg-muted/50 px-2 h-8 text-sm items-center justify-center flex rounded-r-md">
                                       <Clipboard
                                          onClick={() => {
                                             navigator.clipboard.writeText(field.value ?? '');
                                          }}
                                          className="size-4 text-muted-foreground cursor-pointer hover:text-primary"
                                       />
                                    </FormDescription>
                                 </div>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>

                     <DrawerFooter className="flex flex-row items-center justify-between">
                        {isSubmitting || isPending ? (
                           <Button disabled size={'sm'}>
                              {'SAVING'}
                              <Loader className="ml-2 h-4 w-4 animate-spin" />
                           </Button>
                        ) : (
                           <Button type="submit" size={'sm'}>
                              {'SAVE'}
                           </Button>
                        )}
                        <DrawerClose asChild>
                           <Button variant="outline" size={'sm'}>
                              {'DONE'}
                           </Button>
                        </DrawerClose>
                     </DrawerFooter>
                  </form>
               </Form>
            </div>
         </DrawerContent>
      </Drawer>
   );
}

interface FormPageProps {
   data?: ImageGallerySchema;
   metod?: 'POST' | 'PUT' | 'DELETE';
   onClose?: () => void;
   open?: boolean;
}

export function FormPage({ data, metod = 'POST', onClose, open }: FormPageProps) {
   // Hook kurallarını ihlal etmemek için bileşeni iki farklı bileşene böldük
   if (metod === 'DELETE') {
      return <DeleteForm data={data} onClose={onClose} open={open} />;
   }

   return <EditForm data={data} metod={metod} onClose={onClose} open={open} />;
}
