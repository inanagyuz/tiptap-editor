'use client';
/**
 * @module ImportExportDialog
 *
 * This module provides the ImportExportDialog React component for importing and exporting editor content in various formats.
 * It supports HTML, Markdown, plain text, DOCX, JSON, and URL-based import/export, with file upload and preview capabilities.
 *
 * @remarks
 * - Allows users to import content from files, clipboard, URLs, or DOCX documents.
 * - Supports exporting editor content as DOCX, HTML, Markdown, plain text, or JSON.
 * - Includes loading indicators, file name input, and format selection.
 * - All UI strings should be localized via i18n for multi-language support.
 * - Helper functions are provided for converting between Markdown and HTML.
 *
 * @example
 * ```tsx
 * <ImportExportDialog editor={editor} open={open} onOpenChange={setOpen} mode="import" />
 * <ImportExportDialog editor={editor} open={open} onOpenChange={setOpen} mode="export" />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 * @property open - Whether the dialog is open.
 * @property onOpenChange - Callback fired when the dialog is opened or closed.
 * @property mode - Dialog mode, either 'import' or 'export'.
 */
import { useState, useRef, SetStateAction } from 'react';
import { Editor, generateHTML } from '@tiptap/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, FileText, Link, Copy, File } from 'lucide-react';
import { saveAs } from 'file-saver';
import { defaultExtensions } from '../extensions';
import { i18n } from '../i18n';

export const apiUrl = process.env.NEXT_PUBLIC_FILE_API || '/api/file';

/**
 * Props for the ImportExportDialog component.
 *
 * @property editor - The Tiptap editor instance.
 * @property open - Whether the dialog is open.
 * @property onOpenChange - Callback fired when the dialog is opened or closed.
 * @property mode - Dialog mode, either 'import' or 'export'.
 */

interface ImportExportDialogProps {
   editor: Editor;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   mode: 'import' | 'export';
}

/**
 * ImportExportDialog component for importing and exporting editor content.
 *
 * @param editor - The Tiptap editor instance.
 * @param open - Whether the dialog is open.
 * @param onOpenChange - Callback fired when the dialog is opened or closed.
 * @param mode - Dialog mode, either 'import' or 'export'.
 */

export const ImportExportDialog = ({
   editor,
   open,
   onOpenChange,
   mode,
}: ImportExportDialogProps) => {
   const [content, setContent] = useState('');
   const [url, setUrl] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [fileName, setFileName] = useState('document');

   // ✅ File input refs
   const fileInputRef = useRef<HTMLInputElement>(null);
   const docxInputRef = useRef<HTMLInputElement>(null);

   // ✅ File input trigger functions
   const triggerFileUpload = () => {
      fileInputRef.current?.click();
   };

   const triggerDocxUpload = () => {
      docxInputRef.current?.click();
   };

   const getCleanHTML = () => {
      const json = editor.getJSON();
      const html = generateHTML(json, defaultExtensions);
      return cleanHTML(html);
   };

   const cleanHTML = (html: string): string => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const elementsWithClass = doc.querySelectorAll('[class]');
      elementsWithClass.forEach((el) => {
         el.removeAttribute('class');
      });

      const elementsWithStyle = doc.querySelectorAll('[style]');
      elementsWithStyle.forEach((el) => {
         const style = el.getAttribute('style');
         if (style) {
            const importantStyles = style
               .split(';')
               .filter(
                  (s) =>
                     s.includes('font-size') ||
                     s.includes('color') ||
                     s.includes('text-align') ||
                     s.includes('line-height')
               )
               .join(';');

            if (importantStyles) {
               el.setAttribute('style', importantStyles);
            } else {
               el.removeAttribute('style');
            }
         }
      });
      doc.querySelectorAll('[data-type]').forEach((el) => {
         el.removeAttribute('data-type');
      });

      return doc.body.innerHTML;
   };

   const handleJSONImport = (jsonString: string) => {
      try {
         const json = JSON.parse(jsonString);
         editor.chain().focus().setContent(json).run();
         onOpenChange(false);
      } catch (error) {
         console.error('JSON import error:', error);
      }
   };

   const handleImportContent = async (type: 'html' | 'markdown' | 'text' | 'json') => {
      if (!content.trim()) return;

      setIsLoading(true);
      try {
         let processedContent = content;

         switch (type) {
            case 'html':
               editor.chain().focus().setContent(processedContent).run();
               break;
            case 'markdown':
               processedContent = convertMarkdownToHTML(processedContent);
               editor.chain().focus().setContent(processedContent).run();
               break;
            case 'text':
               const paragraphs = processedContent.split('\n').filter((p) => p.trim());
               const htmlContent = paragraphs.map((p) => `<p>${p}</p>`).join('');
               editor.chain().focus().setContent(htmlContent).run();
               break;
            case 'json':
               handleJSONImport(processedContent);
               break;
         }

         setContent('');
         onOpenChange(false);
      } catch (error) {
         console.error('Import error:', error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleImportFromUrl = async () => {
      if (!url.trim()) return;
      setIsLoading(true);
      try {
         const response = await fetch(`${apiUrl}/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
         });

         if (response.ok) {
            const data = await response.json();
            if (data.success) {
               editor.chain().focus().setContent(data.content).run();
               setUrl('');
               onOpenChange(false);
            } else {
               console.error('URL import failed:', data.error);
            }
         } else {
            console.error('URL import failed:', response.statusText);
         }
      } catch (error) {
         console.error('URL import error:', error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      setIsLoading(true);

      fetch(`${apiUrl}/upload`, {
         method: 'POST',
         body: formData,
      })
         .then((response) => response.json())
         .then((data) => {
            if (data.success) {
               if (data.contentType === 'json') {
                  editor.chain().focus().setContent(data.content).run();
               } else {
                  editor.chain().focus().setContent(data.content).run();
               }
               onOpenChange(false);
            } else {
               console.error('File upload failed:', data.error);
            }
         })
         .catch((error) => {
            console.error('File upload error:', error);
         })
         .finally(() => {
            setIsLoading(false);
            if (event.target) {
               event.target.value = '';
            }
         });
   };

   const handleExportDocx = async () => {
      setIsLoading(true);
      try {
         const cleanHtml = getCleanHTML();

         const response = await fetch(`${apiUrl}/export`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ html: cleanHtml, fileName }),
         });

         if (response.ok) {
            const blob = await response.blob();
            saveAs(blob, `${fileName}.docx`);
            onOpenChange(false);
         } else {
            console.error('DOCX export failed:', response.statusText);
         }
      } catch (error) {
         console.error('DOCX export error:', error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleExportHtml = () => {
      const cleanHtml = getCleanHTML();
      const blob = new Blob([cleanHtml], { type: 'text/html' });
      saveAs(blob, `${fileName}.html`);
      onOpenChange(false);
   };
   const handleExportJSON = () => {
      const json = editor.getJSON();
      const jsonString = JSON.stringify(json, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      saveAs(blob, `${fileName}.json`);
      onOpenChange(false);
   };

   const handleExportMarkdown = () => {
      const cleanHtml = getCleanHTML();
      const markdown = convertHTMLToMarkdown(cleanHtml);
      const blob = new Blob([markdown], { type: 'text/markdown' });
      saveAs(blob, `${fileName}.md`);
      onOpenChange(false);
   };

   const handleExportText = () => {
      const text = editor.getText();
      const blob = new Blob([text], { type: 'text/plain' });
      saveAs(blob, `${fileName}.txt`);
      onOpenChange(false);
   };

   const handlePasteFromClipboard = async () => {
      try {
         const text = await navigator.clipboard.readText();
         setContent(text);
      } catch (error) {
         console.error('Clipboard error:', error);
      }
   };

   if (mode === 'export') {
      return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
               <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                     <Download className="h-5 w-5" />
                     {i18n.t('EXPORT_DOCUMENT')}
                  </DialogTitle>
               </DialogHeader>

               <div className="space-y-4">
                  {/* File Name */}
                  <div className="space-y-2">
                     <label className="text-sm font-medium">{i18n.t('FILE_NAME')}</label>
                     <input
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        placeholder={i18n.t('DOCUMENT')}
                     />
                  </div>

                  {/* Export Options */}
                  <div className="grid grid-cols-2 gap-3">
                     <Button
                        onClick={handleExportDocx}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                     >
                        <File className="h-4 w-4" />
                        {isLoading ? i18n.t('EXPORTING') : i18n.t('EXPORT_DOCX')}
                     </Button>
                     <Button
                        onClick={handleExportJSON}
                        variant="outline"
                        className="flex items-center gap-2"
                     >
                        <FileText className="h-4 w-4" />
                        {i18n.t('EXPORT_JSON')}
                     </Button>
                     <Button
                        onClick={handleExportHtml}
                        variant="outline"
                        className="flex items-center gap-2"
                     >
                        <FileText className="h-4 w-4" />
                        {i18n.t('EXPORT_HTML')}
                     </Button>
                     <Button
                        onClick={handleExportMarkdown}
                        variant="outline"
                        className="flex items-center gap-2"
                     >
                        <FileText className="h-4 w-4" />
                        {i18n.t('EXPORT_MARKDOWN')}
                     </Button>
                     <Button
                        onClick={handleExportText}
                        variant="outline"
                        className="flex items-center gap-2"
                     >
                        <FileText className="h-4 w-4" />
                        {i18n.t('EXPORT_TEXT')}
                     </Button>
                  </div>

                  {/* Preview Tabs */}
                  <Tabs defaultValue="clean" className="w-full">
                     <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="clean"> {i18n.t('CLEAN_HTML')} </TabsTrigger>
                        <TabsTrigger value="json">JSON</TabsTrigger>
                        <TabsTrigger value="text">{i18n.t('TEXT')}</TabsTrigger>
                     </TabsList>

                     <TabsContent value="clean" className="space-y-2">
                        <label className="text-sm font-medium">
                           {i18n.t('CLEAN_HTML_PREVIEW')}{' '}
                        </label>
                        <Textarea
                           value={getCleanHTML()}
                           readOnly
                           className="min-h-[150px] font-mono text-xs"
                        />
                     </TabsContent>

                     <TabsContent value="json" className="space-y-2">
                        <label className="text-sm font-medium">{i18n.t('JSON_PREVIEW')} </label>
                        <Textarea
                           value={JSON.stringify(editor.getJSON(), null, 2)}
                           readOnly
                           className="min-h-[150px] font-mono text-xs"
                        />
                     </TabsContent>

                     <TabsContent value="text" className="space-y-2">
                        <label className="text-sm font-medium">{i18n.t('TEXT_PREVIEW')}</label>
                        <Textarea
                           value={editor.getText()}
                           readOnly
                           className="min-h-[150px] text-sm"
                        />
                     </TabsContent>
                  </Tabs>
               </div>
            </DialogContent>
         </Dialog>
      );
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {i18n.t('IMPORT_DOCUMENT')}
               </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="file" className="w-full">
               <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="file" className="flex items-center gap-2">
                     <Upload className="h-4 w-4" />
                     <span className="hidden md:flex">{i18n.t('FILE_UPLOAD')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center gap-2">
                     <FileText className="h-4 w-4" />
                     <span className="hidden md:flex">{i18n.t('TEXT_CONTENT')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center gap-2">
                     <Link className="h-4 w-4" />
                     <span className="hidden md:flex">{i18n.t('FROM_URL')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="docx" className="flex items-center gap-2">
                     <File className="h-4 w-4" />
                     <span className="hidden md:flex">{i18n.t('DOCX_IMPORT')}</span>
                  </TabsTrigger>
               </TabsList>

               {/* File Upload Tab */}
               <TabsContent value="file" className="space-y-4">
                  <div
                     className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                     onClick={triggerFileUpload}
                  >
                     <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                     <div className="space-y-2">
                        <h3 className="font-medium">{i18n.t('UPLOAD_FILE')}</h3>
                        <p className="text-sm text-muted-foreground">
                           {i18n.t('SUPPORTED_FORMATS')}: HTML, Markdown, TXT, DOCX, JSON
                        </p>
                        <input
                           ref={fileInputRef}
                           type="file"
                           accept=".html,.htm,.md,.markdown,.txt,.docx,.json"
                           onChange={handleFileUpload}
                           className="hidden"
                           disabled={isLoading}
                        />
                        <Button
                           variant="outline"
                           disabled={isLoading}
                           onClick={(e) => {
                              e.stopPropagation(); // Parent click'i durdur
                              triggerFileUpload();
                           }}
                        >
                           {isLoading ? i18n.t('UPLOADING') : i18n.t('CHOOSE_FILE')}
                        </Button>
                     </div>
                  </div>

                  {/* Loading indicator */}
                  {isLoading && (
                     <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                           <span className="text-sm text-blue-600">
                              {i18n.t('PROCESSING_FILE')}
                           </span>
                        </div>
                     </div>
                  )}
               </TabsContent>

               {/* DOCX Tab */}
               <TabsContent value="docx" className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                     <h4 className="font-medium mb-2 flex items-center gap-2">
                        <File className="h-4 w-4" />
                        {i18n.t('DOCX_IMPORT')}
                     </h4>
                     <p className="text-sm text-muted-foreground mb-4">{i18n.t('DOCX_IMPORT_DESC')}</p>
                     <input
                        ref={docxInputRef}
                        type="file"
                        accept=".docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isLoading}
                     />
                     <Button variant="outline" disabled={isLoading} onClick={triggerDocxUpload}>
                        {isLoading ? i18n.t('IMPORTING') : i18n.t('CHOOSE_DOCX_FILE')}
                     </Button>
                  </div>

                  {/* Loading indicator */}
                  {isLoading && (
                     <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                           <span className="text-sm text-blue-600">
                              {i18n.t('CONVERTING_DOCX')}
                           </span>
                        </div>
                     </div>
                  )}
               </TabsContent>

               {/* Text Content Tab */}
               <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">{i18n.t('PASTE_CONTENT')}</label>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={handlePasteFromClipboard}
                           className="flex items-center gap-2"
                        >
                           <Copy className="h-3 w-3" />
                           {i18n.t('PASTE_FROM_CLIPBOARD')}
                        </Button>
                     </div>
                     <Textarea
                        value={content}
                        onChange={(e: { target: { value: SetStateAction<string> } }) =>
                           setContent(e.target.value)
                        }
                        placeholder={i18n.t('PASTE_HTML_MARKDOWN_TEXT')}
                        className="min-h-[200px] font-mono text-sm"
                     />
                  </div>

                  <div className="flex gap-2 flex-wrap">
                     <Button
                        onClick={() => handleImportContent('html')}
                        disabled={!content.trim() || isLoading}
                        className="flex-1 min-w-[120px]"
                     >
                        {i18n.t('IMPORT_AS_HTML')}
                     </Button>
                     <Button
                        onClick={() => handleImportContent('markdown')}
                        disabled={!content.trim() || isLoading}
                        variant="outline"
                        className="flex-1 min-w-[120px]"
                     >
                        {i18n.t('IMPORT_AS_MARKDOWN')}
                     </Button>
                     <Button
                        onClick={() => handleImportContent('text')}
                        disabled={!content.trim() || isLoading}
                        variant="outline"
                        className="flex-1 min-w-[120px]"
                     >
                        {i18n.t('IMPORT_AS_TEXT')}
                     </Button>
                     <Button
                        onClick={() => handleImportContent('json')}
                        disabled={!content.trim() || isLoading}
                        variant="outline"
                        className="flex-1 min-w-[120px]"
                     >
                        {i18n.t('IMPORT_AS_JSON')}
                     </Button>
                  </div>
               </TabsContent>

               {/* URL Tab */}
               <TabsContent value="url" className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-sm font-medium">{i18n.t('WEBSITE_URL')} </label>
                     <div className="flex gap-2">
                        <input
                           type="url"
                           value={url}
                           onChange={(e) => setUrl(e.target.value)}
                           placeholder="https://example.com/article"
                           className="flex-1 px-3 py-2 border rounded-md text-sm"
                           disabled={isLoading}
                        />
                        <Button onClick={handleImportFromUrl} disabled={!url.trim() || isLoading}>
                           {isLoading ? i18n.t('IMPORTING') : i18n.t('IMPORT')}
                        </Button>
                     </div>
                  </div>

                  {/* Loading indicator */}
                  {isLoading && (
                     <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                           <span className="text-sm text-blue-600">
                              {i18n.t('FETCHING_CONTENT')}
                           </span>
                        </div>
                     </div>
                  )}

                  <div className="bg-muted/50 rounded-lg p-4">
                     <h4 className="font-medium mb-2">{i18n.t('SUPPORTED_SOURCES')}</h4>
                     <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• {i18n.t('BLOG_ARTICLES')}</li>
                        <li>• {i18n.t('WIKIPEDIA_PAGES')}</li>
                        <li>• {i18n.t('NEWS_ARTICLES')}</li>
                        <li>• {i18n.t('DOCUMENTATION_PAGES')}</li>
                     </ul>
                  </div>
               </TabsContent>
            </Tabs>
         </DialogContent>
      </Dialog>
   );
};

/**
 * Converts Markdown string to HTML string.
 *
 * @param markdown - Markdown content.
 * @returns HTML string.
 */
function convertMarkdownToHTML(markdown: string): string {
   return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      .replace(/`([^`]*)`/gim, '<code>$1</code>')
      .replace(/^\* (.+)$/gim, '<li>$1</li>')
      .replace(/(<li>[\s\S]*<\/li>)/, '<ul>$1</ul>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/^(?!<[h1-6]|<ul|<pre|<code)(.+)$/gim, '<p>$1</p>');
}
/**
 * Converts HTML string to Markdown string.
 *
 * @param html - HTML content.
 * @returns Markdown string.
 */
function convertHTMLToMarkdown(html: string): string {
   return html
      .replace(/<h1>(.*?)<\/h1>/gim, '# $1\n')
      .replace(/<h2>(.*?)<\/h2>/gim, '## $1\n')
      .replace(/<h3>(.*?)<\/h3>/gim, '### $1\n')
      .replace(/<strong>(.*?)<\/strong>/gim, '**$1**')
      .replace(/<em>(.*?)<\/em>/gim, '*$1*')
      .replace(/<a href="([^"]*)"[^>]*>(.*?)<\/a>/gim, '[$2]($1)')
      .replace(/<p>(.*?)<\/p>/gim, '$1\n\n')
      .replace(/<br\s*\/?>/gim, '\n')
      .replace(/<[^>]*>/gim, '');
}
