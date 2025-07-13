'use client';
/**
 * @module ImportExportSelector
 *
 * This module provides the ImportExportSelector React component for importing and exporting editor content in various formats.
 * It displays options for importing from text, DOCX, or URL, and exporting to DOCX, HTML, or Markdown.
 * All UI strings should be localized via i18n for multi-language support.
 *
 * @remarks
 * - Integrates with Tiptap editor and supports import/export dialogs.
 * - Uses ImportExportDialog for handling file, URL, and text operations.
 * - Provides command functions for programmatic import/export dialogs.
 * - Displays tips and descriptions for each option.
 *
 * @example
 * ```tsx
 * <ImportExportSelector editor={editor} open={open} onOpenChange={setOpen} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 * @property open - Whether the selector popover is open.
 * @property onOpenChange - Callback fired when the selector is opened or closed.
 */

import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Upload, Download, ChevronDown, FileText, File, Link } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ImportExportDialog } from '../extensions/import-export';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from '@/components/ui/dialog';
import { i18n } from '../i18n';

/**
 * ImportExportSelector component for importing and exporting editor content.
 *
 * @param editor - The Tiptap editor instance.
 * @param open - Whether the selector popover is open.
 * @param onOpenChange - Callback fired when the selector is opened or closed.
 */

interface ImportExportSelectorProps {
   editor: Editor;
   showImportData?: boolean;
   showExportData?: boolean;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export const ImportExportSelector = ({
   editor,
   showImportData,
   showExportData,
   open,
   onOpenChange,
}: ImportExportSelectorProps) => {
   const [isImportOpen, setIsImportOpen] = React.useState(false);
   const [isExportOpen, setIsExportOpen] = React.useState(false);

   if (!editor) return null;

   const importOptions = [
      {
         title: 'IMPORT_TEXT',
         description: 'IMPORT_TEXT_DESC',
         icon: FileText,
         action: () => {
            setIsImportOpen(true);
            onOpenChange(false);
         },
      },
      {
         title: 'IMPORT_DOCX',
         description: 'IMPORT_DOCX_DESC',
         icon: File,
         action: () => {
            setIsImportOpen(true);
            onOpenChange(false);
         },
      },
      {
         title: 'IMPORT_URL',
         description: 'IMPORT_URL_DESC',
         icon: Link,
         action: () => {
            setIsImportOpen(true);
            onOpenChange(false);
         },
      },
   ];

   const exportOptions = [
      {
         title: 'EXPORT_DOCX',
         description: 'EXPORT_DOCX_DESC',
         icon: File,
         action: () => {
            setIsExportOpen(true);
            onOpenChange(false);
         },
      },
      {
         title: 'EXPORT_HTML',
         description: 'EXPORT_HTML_DESC',
         icon: FileText,
         action: () => {
            setIsExportOpen(true);
            onOpenChange(false);
         },
      },
      {
         title: 'EXPORT_MARKDOWN',
         description: 'EXPORT_MARKDOWN_DESC',
         icon: FileText,
         action: () => {
            setIsExportOpen(true);
            onOpenChange(false);
         },
      },
   ];

   return (
      <>
         <Popover modal={true} open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
               <Button
                  size="sm"
                  className="gap-2 rounded-none border-none min-w-[80px]"
                  variant="ghost"
                  title={i18n.t('IMPORT_EXPORT')}
               >
                  <Upload className="h-4 w-4" />
                  <Download className="h-4 w-4" />
                  <ChevronDown className="h-4 w-4" />
               </Button>
            </PopoverTrigger>

            <PopoverContent sideOffset={5} className="w-60 p-0" align="start">
               {/* Header */}
               <div className="flex items-center  p-2 border-b  justify-center">
                  <div className="text-sm font-semibold text-muted-foreground">
                     {i18n.t('IMPORT_EXPORT')}
                  </div>
               </div>

               <div className="p-2">
                  {/* Import Section */}
                  {showImportData && (
                     <>
                        <div className="mb-4">
                           <div className="flex items-center gap-2 px-2 py-1">
                              <Upload className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-600">
                                 {i18n.t('IMPORT')}
                              </span>
                           </div>

                           <div>
                              {importOptions.map((option) => {
                                 const Icon = option.icon;
                                 return (
                                    <button
                                       key={option.title}
                                       onClick={option.action}
                                       className={cn(
                                          'w-full flex items-start gap-3 px-2 py-1 rounded-md text-left',
                                          'hover:bg-accent transition-colors group items-center'
                                       )}
                                    >
                                       <Icon className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-foreground" />
                                       <div className="flex-1 min-w-0">
                                          <div className="text-sm font-medium group-hover:text-foreground">
                                             {i18n.t(option.title)}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                             {i18n.t(option.description)}
                                          </div>
                                       </div>
                                    </button>
                                 );
                              })}
                           </div>
                        </div>
                        <div className="border-t my-2" />
                     </>
                  )}

                  {/* Export Section */}
                  {showExportData && (
                     <>
                        <div>
                           <div className="flex items-center gap-2 px-2 py-1">
                              <Download className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-600">
                                 {i18n.t('EXPORT')}
                              </span>
                           </div>

                           <div>
                              {exportOptions.map((option) => {
                                 const Icon = option.icon;
                                 return (
                                    <button
                                       key={option.title}
                                       onClick={option.action}
                                       className={cn(
                                          'w-full flex items-start gap-3 px-2 py-1 rounded-md text-left',
                                          'hover:bg-accent transition-colors group items-center'
                                       )}
                                    >
                                       <Icon className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-foreground" />
                                       <div className="flex-1 min-w-0">
                                          <div className="text-sm font-medium group-hover:text-foreground">
                                             {i18n.t(option.title)}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                             {i18n.t(option.description)}
                                          </div>
                                       </div>
                                    </button>
                                 );
                              })}
                           </div>
                        </div>
                     </>
                  )}
               </div>

               {/* Footer */}
               <div className="border-t p-2 bg-muted/30">
                  <div className="text-xs text-muted-foreground text-center">
                     💡 {i18n.t('IMPORT_EXPORT_TIP')}
                  </div>
               </div>
            </PopoverContent>
         </Popover>

         {/* Import Dialog */}
         <ImportExportDialog
            editor={editor}
            open={isImportOpen}
            onOpenChange={setIsImportOpen}
            mode="import"
         />

         {/* Export Dialog */}
         <ImportExportDialog
            editor={editor}
            open={isExportOpen}
            onOpenChange={setIsExportOpen}
            mode="export"
         />
      </>
   );
};

/**
 * Opens the import dialog for the editor.
 *
 * @param editor - The Tiptap editor instance.
 */
export const importCommand = ({ editor }: { editor: Editor }) => {
   try {
      // Create a container for the dialog
      const container = document.createElement('div');
      document.body.appendChild(container);

      // Create root and cleanup function
      const root = createRoot(container);

      const cleanup = () => {
         try {
            root.unmount();
            if (document.body.contains(container)) {
               document.body.removeChild(container);
            }
         } catch (error) {
            console.error('Cleanup error:', error);
         }
      };

      // Create QueryClient instance
      const queryClient = new QueryClient({
         defaultOptions: {
            queries: {
               staleTime: 60 * 1000,
            },
         },
      });

      // Create the dialog component
      const DialogComponent = () => {
         const [open, setOpen] = React.useState(true);

         const handleClose = () => {
            setOpen(false);
            setTimeout(cleanup, 100);
         };

         return (
            <Dialog open={open} onOpenChange={handleClose}>
               <DialogContent className="w-[500px] p-0 gap-0">
                  <DialogHeader className="p-4 pb-0">
                     <DialogTitle className="flex items-center gap-2 text-lg">
                        <Upload className="w-5 h-5 text-blue-500" />
                        {i18n.t('IMPORT_EXPORT')}
                     </DialogTitle>
                     <DialogDescription>{i18n.t('IMPORT_EXPORT_DESC')}</DialogDescription>
                  </DialogHeader>
                  <QueryClientProvider client={queryClient}>
                     <ImportExportDialog
                        editor={editor}
                        open={true}
                        onOpenChange={handleClose}
                        mode="import"
                     />
                  </QueryClientProvider>
               </DialogContent>
            </Dialog>
         );
      };

      root.render(<DialogComponent />);
   } catch (error) {
      console.error('Import command error:', error);
   }
};

/**
 * Opens the export dialog for the editor.
 *
 * @param editor - The Tiptap editor instance.
 */
export const exportCommand = ({ editor }: { editor: Editor }) => {
   try {
      // Create a container for the dialog
      const container = document.createElement('div');
      document.body.appendChild(container);

      // Create root and cleanup function
      const root = createRoot(container);

      const cleanup = () => {
         try {
            root.unmount();
            if (document.body.contains(container)) {
               document.body.removeChild(container);
            }
         } catch (error) {
            console.error('Cleanup error:', error);
         }
      };

      // Create QueryClient instance
      const queryClient = new QueryClient({
         defaultOptions: {
            queries: {
               staleTime: 60 * 1000,
            },
         },
      });

      // Create the dialog component
      const DialogComponent = () => {
         const [open, setOpen] = React.useState(true);

         const handleClose = () => {
            setOpen(false);
            setTimeout(cleanup, 100);
         };

         return (
            <Dialog open={open} onOpenChange={handleClose}>
               <DialogContent className="w-[500px] p-0 gap-0">
                  <DialogHeader className="p-4 pb-0">
                     <DialogTitle className="flex items-center gap-2 text-lg">
                        <Download className="w-5 h-5 text-green-500" />
                        İçerik Dışa Aktar
                     </DialogTitle>
                     <DialogDescription>
                        Editör içeriğini farklı formatlarda kaydedin
                     </DialogDescription>
                  </DialogHeader>
                  <QueryClientProvider client={queryClient}>
                     <ImportExportDialog
                        editor={editor}
                        open={true}
                        onOpenChange={handleClose}
                        mode="export"
                     />
                  </QueryClientProvider>
               </DialogContent>
            </Dialog>
         );
      };

      root.render(<DialogComponent />);
   } catch (error) {
      console.error('Export command error:', error);
   }
};
