import { z } from 'zod';

export const imageGallerySchema = (translateFn?: (key: string) => string) => {
   const t = translateFn || ((key: string) => key);
   return z.object({
      id: z.string().optional(),
      name: z
         .string({
            required_error: t('IS_REQUIRED'),
            invalid_type_error: t('FIELD_MUST_BE_STRING'),
         })
         .min(1, { message: t('IS_REQUIRED') })
         .optional(),
      dataId: z.string().optional(),
      path: z.string().optional(),
      fullPath: z.string().optional(),
      fileName: z.string().optional(),
      type: z.string().optional(),
      size: z.coerce.number().positive().optional(),
      width: z.coerce.number().positive().optional(),
      height: z.coerce.number().positive().optional(),
      url: z.string().optional(),
      isActive: z.boolean().default(true).optional(),
   });
};

export type ImageGallerySchema = z.infer<ReturnType<typeof imageGallerySchema>>;
