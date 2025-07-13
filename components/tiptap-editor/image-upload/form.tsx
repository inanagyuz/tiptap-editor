'use client';
/**
 * @module ImageGalleryForm
 *
 * This module provides form components for editing and deleting image gallery items in the Tiptap editor.
 * It includes mutation logic for API requests, multi-language support via i18n, and mobile-friendly UI with Drawer and AlertDialog.
 *
 * @remarks
 * - Supports create, update, and delete operations for image gallery items.
 * - Uses react-hook-form and zod for validation.
 * - Displays loading, success, and error messages with toast notifications.
 * - All UI strings are localized via i18n for multi-language support.
 * - Clipboard integration for copying file and path values.
 *
 * @example
 * ```tsx
 * <FormPage data={item} metod="PUT" open={open} onClose={handleClose} />
 * <FormPage data={item} metod="DELETE" open={open} onClose={handleClose} />
 * ```
 *
 * @property data - The image gallery item to edit or delete.
 * @property metod - The operation method ('POST', 'PUT', or 'DELETE').
 * @property open - Whether the form dialog is open.
 * @property onClose - Callback fired when the dialog is closed.
 */

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
import { i18n } from '../i18n';

type Method = 'POST' | 'PUT' | 'DELETE';

interface MutationParams {
   data: ImageGallerySchema;
   metod: Method;
   id?: string;
}

/**
 * Mutation function for image gallery API requests.
 *
 * @param params - Mutation parameters including data, method, and id.
 * @returns API response data.
 */
async function mutationFn({ data, metod, id }: MutationParams) {
   const url = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
   if (!url) {
      throw new Error(i18n.t('NO_IMAGE_GALLERY_URL'));
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

/**
 * Custom hook for image gallery mutations.
 *
 * @returns Mutation object for use in forms.
 */
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

/**
 * Default values for image gallery form.
 */
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

/**
 * DeleteForm component for confirming and deleting an image gallery item.
 *
 * @param data - The image gallery item to delete.
 * @param onClose - Callback fired when the dialog is closed.
 * @param open - Whether the dialog is open.
 */
function DeleteForm({ data, onClose, open }: DeleteFormProps) {
   const { mutateAsync, isPending } = useFormMutation();

   const handleDelete = async () => {
      if (!data?.id) return;
      const loadingToast = toast.loading(i18n.t('DELETING'));

      try {
         await mutateAsync({
            data: data,
            metod: 'DELETE',
            id: data.id,
         });
         toast.success(i18n.t('DELETE_SUCCESS'));
         onClose?.();
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
         return toast.error(error?.message || i18n.t('DELETE_ERROR'));
      } finally {
         toast.dismiss(loadingToast);
      }
   };

   return (
      <AlertDialog open={open} onOpenChange={(val) => !val && onClose?.()}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{i18n.t('CONFIRM_DELETE_TITLE')}</AlertDialogTitle>
               <AlertDialogDescription>{i18n.t('CONFIRM_DELETE_DESC')}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel>{i18n.t('CONFIRM')}</AlertDialogCancel>
               <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                  {isPending ? (
                     <>
                        {i18n.t('DELETING')}
                        <Loader className="ml-2 h-4 w-4 animate-spin" />
                     </>
                  ) : (
                     i18n.t('CONFIRM')
                  )}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}

/**
 * EditForm component for editing or creating an image gallery item.
 *
 * @param data - The image gallery item to edit.
 * @param metod - The operation method ('POST' or 'PUT').
 * @param onClose - Callback fired when the dialog is closed.
 * @param open - Whether the dialog is open.
 */

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
                  toast.success(metod === 'POST' ? i18n.t('SAVING') : i18n.t('UPDATING'));
                  if (metod === 'POST') {
                     form.reset();
                  }
                  if (metod === 'PUT') {
                     onClose?.();
                  }
               },
               onError: (error: Error) => {
                  return toast.error(error?.message || i18n.t('ERROR'));
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
               <DrawerTitle>{metod === 'POST' ? i18n.t('EDIT') : i18n.t('EDIT')}</DrawerTitle>
               <DrawerDescription>
                  {metod === 'POST' ? i18n.t('EDIT') : i18n.t('EDIT')}
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
                                 <FormLabel>{i18n.t('NAME')}</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder={i18n.t('NAME')}
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
                                 <FormLabel>{i18n.t('STATUS')}</FormLabel>
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
                                 <FormLabel>{i18n.t('TYPE')}</FormLabel>
                                 <FormControl>
                                    <Input
                                       disabled
                                       placeholder={i18n.t('TYPE')}
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
                                 <FormLabel>{i18n.t('SIZE')}</FormLabel>
                                 <div className="flex flex-row items-center justify-between">
                                    <FormControl>
                                       <Input
                                          disabled
                                          placeholder={i18n.t('SIZE')}
                                          {...field}
                                          className="h-8 text-sm flex rounded-none rounded-l-md"
                                       />
                                    </FormControl>
                                    <FormDescription className=" bg-muted/50 px-2 h-8 text-sm items-center justify-center flex rounded-r-md">
                                       {'kb'}
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
                                 <FormLabel>{i18n.t('WIDTH')}</FormLabel>
                                 <FormControl>
                                    <Input
                                       disabled
                                       placeholder={i18n.t('WIDTH')}
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
                                 <FormLabel>{i18n.t('HEIGHT')}</FormLabel>
                                 <FormControl>
                                    <Input
                                       disabled
                                       placeholder={i18n.t('HEIGHT')}
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
                                 <FormLabel>{i18n.t('FILE_NAME')}</FormLabel>
                                 <div className="flex flex-row items-center justify-between">
                                    <FormControl>
                                       <Input
                                          disabled
                                          placeholder={i18n.t('FILE_NAME')}
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
                                 <FormLabel>{i18n.t('PATH')}</FormLabel>
                                 <div className="flex flex-row items-center justify-between">
                                    <FormControl>
                                       <Input
                                          disabled
                                          placeholder={i18n.t('PATH')}
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
                                 <FormLabel>{i18n.t('URL')}</FormLabel>
                                 <div className="flex flex-row items-center justify-between">
                                    <FormControl>
                                       <Input
                                          disabled
                                          placeholder={i18n.t('URL')}
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
                              {i18n.t('SAVING')}
                              <Loader className="ml-2 h-4 w-4 animate-spin" />
                           </Button>
                        ) : (
                           <Button type="submit" size={'sm'}>
                              {i18n.t('SAVE')}
                           </Button>
                        )}
                        <DrawerClose asChild>
                           <Button variant="outline" size={'sm'}>
                              {i18n.t('DONE')}
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

/**
 * FormPage component for rendering either the EditForm or DeleteForm based on the method.
 *
 * @param data - The image gallery item.
 * @param metod - The operation method.
 * @param onClose - Callback fired when the dialog is closed.
 * @param open - Whether the dialog is open.
 */

export function FormPage({ data, metod = 'POST', onClose, open }: FormPageProps) {
   if (metod === 'DELETE') {
      return <DeleteForm data={data} onClose={onClose} open={open} />;
   }

   return <EditForm data={data} metod={metod} onClose={onClose} open={open} />;
}
