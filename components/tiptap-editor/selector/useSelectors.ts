// hooks/useSelectors.ts
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

      // Tüm selector'ları kapatmak için fonksiyon
      closeAll,
   };
};
