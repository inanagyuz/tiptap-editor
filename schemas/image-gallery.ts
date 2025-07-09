/**
 * @file imageGallery.ts
 * @author Inan Agyuz
 * @version 1.0.0
 * @description Görsel galeri için Zod şeması ve tip tanımı.
 */

import { z } from 'zod';

/**
 * Görsel galeri şeması.
 *
 * @returns {z.ZodObject} Görsel galeri için Zod doğrulama şeması
 *
 * @property {string} [id] - Görselin benzersiz kimliği
 * @property {string} [name] - Görsel adı
 * @property {string} [dataId] - Depolama servisindeki dosya ID'si
 * @property {string} [path] - Depolama servisindeki dosya yolu
 * @property {string} [fullPath] - Dosyanın tam yolu
 * @property {string} [fileName] - Dosya adı
 * @property {string} [type] - Dosya türü (örn: jpeg, png)
 * @property {number} [size] - Dosya boyutu (byte)
 * @property {number} [width] - Görsel genişliği (px)
 * @property {number} [height] - Görsel yüksekliği (px)
 * @property {string} [url] - Görselin herkese açık bağlantısı
 * @property {boolean} [isActive=true] - Görsel aktiflik durumu
 */
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

/**
 * Görsel galeri şeması tip tanımı.
 * @typedef {object} ImageGallerySchema
 * @property {string} [id]
 * @property {string} [name]
 * @property {string} [dataId]
 * @property {string} [path]
 * @property {string} [fullPath]
 * @property {string} [fileName]
 * @property {string} [type]
 * @property {number} [size]
 * @property {number} [width]
 * @property {number} [height]
 * @property {string} [url]
 * @property {boolean} [isActive]
 */
export type ImageGallerySchema = z.infer<ReturnType<typeof imageGallerySchema>>;
