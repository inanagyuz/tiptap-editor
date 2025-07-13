/**
 * @module useSelectors
 *
 * This custom React hook manages the open/close state for all selector popovers in the Tiptap editor UI.
 * It provides state and handlers for alignment, link, color, font family, font size, import/export, table, image, line height, YouTube, Twitter, and more.
 * Includes a `closeAll` function to close all selectors at once.
 *
 * @remarks
 * - Each selector returns `{ open, onOpenChange }` for controlling its visibility.
 * - The `image` selector also manages gallery and URL sub-selectors.
 * - Designed for use in toolbar and floating UI components.
 *
 * @example
 * ```tsx
 * const selectors = useSelectors();
 * selectors.link.onOpenChange(true); // Open link selector
 * selectors.closeAll(); // Close all selectors
 * ```
 *
 * @returns An object with open state and change handlers for each selector, plus a `closeAll` function.
 */
import { useState } from 'react';

export const useSelectors = () => {
   const [alignmentOpen, setAlignmentOpen] = useState(false);
   const [linkOpen, setLinkOpen] = useState(false);
   const [colorOpen, setColorOpen] = useState(false);
   const [fontFamilyOpen, setFontFamilyOpen] = useState(false);
   const [fontSizeOpen, setFontSizeOpen] = useState(false);
   const [importExportOpen, setImportExportOpen] = useState(false);
   const [isTableSelectorOpen, setIsTableSelectorOpen] = useState(false);
   const [isLineHeightOpen, setIsLineHeightOpen] = useState(false);
   const [isSelector, setIsSelector] = useState(false);
   const [isYoutubeSelectorOpen, setIsYoutubeSelectorOpen] = useState(false);
   const [isTwitterSelectorOpen, setIsTwitterSelectorOpen] = useState(false);
   const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
   const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
   const [isImageUrlOpen, setIsImageUrlOpen] = useState(false);

   const closeAll = () => {
      setAlignmentOpen(false);
      setLinkOpen(false);
      setColorOpen(false);
      setFontFamilyOpen(false);
      setFontSizeOpen(false);
      setImportExportOpen(false);
      setIsTableSelectorOpen(false);
      setIsImageGalleryOpen(false);
      setIsImageUrlOpen(false);
      setIsLineHeightOpen(false);
      setIsSelector(false);
      setIsImageSelectorOpen(false);
      setIsImageGalleryOpen(false);
      setIsImageUrlOpen(false);
      setIsYoutubeSelectorOpen(false);
      setIsTwitterSelectorOpen(false);
   };

   return {
      alignment: { open: alignmentOpen, onOpenChange: setAlignmentOpen },
      link: { open: linkOpen, onOpenChange: setLinkOpen },
      color: { open: colorOpen, onOpenChange: setColorOpen },
      fontFamily: { open: fontFamilyOpen, onOpenChange: setFontFamilyOpen },
      fontSize: { open: fontSizeOpen, onOpenChange: setFontSizeOpen },
      importExport: { open: importExportOpen, onOpenChange: setImportExportOpen },
      table: { open: isTableSelectorOpen, onOpenChange: setIsTableSelectorOpen },
      imageGallery: { open: isImageGalleryOpen, onOpenChange: setIsImageGalleryOpen },
      imageUrl: { open: isImageUrlOpen, onOpenChange: setIsImageUrlOpen },
      lineHeight: { open: isLineHeightOpen, onOpenChange: setIsLineHeightOpen },
      selector: { open: isSelector, onOpenChange: setIsSelector },
      image: {
         open: isImageSelectorOpen,
         onOpenChange: setIsImageSelectorOpen,
         imageGalleryOpen: isImageGalleryOpen,
         onImageGalleryOpenChange: setIsImageGalleryOpen,
         imageUrlOpen: isImageUrlOpen,
         onImageUrlOpenChange: setIsImageUrlOpen,
      },
      youtube: {
         open: isYoutubeSelectorOpen,
         onOpenChange: setIsYoutubeSelectorOpen,
      },
      twitter: {
         open: isTwitterSelectorOpen,
         onOpenChange: setIsTwitterSelectorOpen,
      },
      
      closeAll,
   };
};
