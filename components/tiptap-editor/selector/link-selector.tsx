/**
 * @module LinkSelector
 *
 * This module provides the LinkSelector React component for adding, editing, and validating links in the Tiptap editor.
 * It includes security checks for protocols and domains, displays current link info, and allows setting link targets.
 * All UI strings should be localized via i18n for multi-language support.
 *
 * @remarks
 * - Validates URLs for allowed protocols (HTTP/HTTPS) and blocks suspicious domains.
 * - Supports adding links to selected text or inserting as new text.
 * - Displays validation errors and security warnings.
 * - Allows removing links and changing link target (_self, _blank).
 * - Shows preview of display text for the link.
 *
 * @example
 * ```tsx
 * <LinkSelector editor={editor} open={open} onOpenChange={setOpen} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 * @property open - Whether the selector popover is open.
 * @property onOpenChange - Callback fired when the selector is opened or closed.
 */
'use client';
import { Button } from '@/components/ui/button';
import { PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { Editor } from '@tiptap/react';
import { Check, Trash, Link, AlertTriangle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { i18n } from '../i18n';

// Güvenlik kontrolleri
const DISALLOWED_PROTOCOLS = ['ftp', 'file', 'mailto'];
const DISALLOWED_DOMAINS = [
   'example-phishing.com',
   'malicious-site.net',
   'suspicious-site.com',
   'fake-bank.com',
];
const ALLOWED_PROTOCOLS = ['http', 'https'];

export function isValidUrl(url: string) {
   try {
      new URL(url);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
   } catch (_e) {
      return false;
   }
}

export function getUrlFromString(str: string) {
   if (isValidUrl(str)) return str;
   try {
      if (str.includes('.') && !str.includes(' ')) {
         return new URL(`https://${str}`).toString();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
   } catch (_e) {
      return null;
   }
}

export function validateUrl(url: string): { isValid: boolean; error?: string } {
   try {
      const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`);

      const protocol = parsedUrl.protocol.replace(':', '');
      if (DISALLOWED_PROTOCOLS.includes(protocol)) {
         return {
            isValid: false,
            error: i18n
               .t('LINK_ERROR_PROTOCOL_NOT_ALLOWED')
               .replace('{protocol}', protocol.toString()),
         };
      }

      if (!ALLOWED_PROTOCOLS.includes(protocol)) {
         return {
            isValid: false,
            error: i18n.t('LINK_ERROR_ONLY_HTTP_HTTPS'),
         };
      }

      const domain = parsedUrl.hostname.toLowerCase();
      if (DISALLOWED_DOMAINS.includes(domain)) {
         return {
            isValid: false,
            error: i18n.t('LINK_ERROR_BLOCKED_DOMAIN').replace('{protocol}', domain),
         };
      }

      if (domain.includes('phishing') || domain.includes('malware')) {
         return {
            isValid: false,
            error: i18n.t('LINK_ERROR_SUSPICIOUS_DOMAIN').replace('{protocol}', domain),
         };
      }

      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipRegex.test(domain)) {
         return {
            isValid: false,
            error: i18n.t('LINK_ERROR_IP_NOT_ALLOWED'),
         };
      }

      return { isValid: true };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
   } catch (error) {
      return {
         isValid: false,
         error: i18n.t('LINK_ERROR_INVALID_FORMAT'),
      };
   }
}

interface LinkSelectorProps {
   editor: Editor;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export const LinkSelector = ({ editor, open, onOpenChange }: LinkSelectorProps) => {
   const inputRef = useRef<HTMLInputElement>(null);
   const [url, setUrl] = useState('');
   const [validationError, setValidationError] = useState<string>('');
   const [isValidating, setIsValidating] = useState(false);

   useEffect(() => {
      if (open && editor) {
         const currentUrl = editor.getAttributes('link').href || '';
         setUrl(currentUrl);
         setValidationError('');
      }
   }, [open, editor]);

   useEffect(() => {
      if (open) {
         setTimeout(() => inputRef.current?.focus(), 100);
      }
   }, [open]);

   useEffect(() => {
      if (url.trim()) {
         setIsValidating(true);
         const timer = setTimeout(() => {
            const validation = validateUrl(url);
            setValidationError(validation.error || '');
            setIsValidating(false);
         }, 500);

         return () => clearTimeout(timer);
      } else {
         setValidationError('');
         setIsValidating(false);
      }
   }, [url]);

   if (!editor) return null;

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const validation = validateUrl(url);
      if (!validation.isValid) {
         setValidationError(validation.error || i18n.t('LINK_ERROR_INVALID_FORMAT'));
         return;
      }

      const validUrl = getUrlFromString(url);
      if (!validUrl) return;

      // ✅ Seçili metin var mı kontrol et
      const { from, to } = editor.state.selection;
      const hasSelection = from !== to;

      if (hasSelection) {
         // ✅ Metin seçiliyse, mevcut metni link yap
         editor.chain().focus().setLink({ href: validUrl }).run();
      } else {
         // ✅ Metin seçili değilse, URL'yi metin olarak ekle ve link yap
         const displayText = getDisplayText(validUrl);

         editor
            .chain()
            .focus()
            .insertContent(displayText)
            .setTextSelection({ from: from, to: from + displayText.length })
            .setLink({ href: validUrl })
            .run();
      }

      onOpenChange(false);
      setValidationError('');
   };

   // ✅ URL'den okunabilir metin oluştur
   const getDisplayText = (url: string): string => {
      try {
         const urlObj = new URL(url);
         const hostname = urlObj.hostname;

         // www. prefix'ini kaldır
         const cleanHostname = hostname.replace(/^www\./, '');

         // Pathname varsa ekle (kısaltılmış)
         let path = urlObj.pathname;
         if (path && path !== '/') {
            // Path çok uzunsa kısalt
            if (path.length > 20) {
               path = path.substring(0, 17) + '...';
            }
            return cleanHostname + path;
         }

         return cleanHostname;
      } catch {
         // URL parse edilemezse, orijinal URL'yi kısalt
         if (url.length > 50) {
            return url.substring(0, 47) + '...';
         }
         return url;
      }
   };

   const handleRemoveLink = () => {
      editor.chain().focus().unsetLink().run();
      setUrl('');
      setValidationError('');
      onOpenChange(false);
   };

   const isLinkActive = editor.isActive('link');
   const currentLink = editor.getAttributes('link').href;
   const hasError = validationError.length > 0;
   const canSubmit = url.trim() && !hasError && !isValidating;

   // ✅ Seçili metin kontrolü UI için
   const { from, to } = editor.state.selection;
   const hasSelection = from !== to;
   const selectedText = hasSelection ? editor.state.doc.textBetween(from, to) : '';

   return (
      <Popover modal={true} open={open} onOpenChange={onOpenChange}>
         <PopoverTrigger asChild>
            <Button
               size="sm"
               variant="ghost"
               className={cn('gap-2 rounded-none border-none', isLinkActive && 'bg-accent')}
            >
               <Link className="h-4 w-4" />
            </Button>
         </PopoverTrigger>
         <PopoverContent align="start" className="w-75 p-0" sideOffset={10}>
            <div className="p-4">
               <div className="space-y-3">
                  <div>
                     {hasSelection && (
                        <div className="mb-2 p-1 bg-muted/50 rounded text-xs">
                           <span className="text-muted-foreground">
                              {i18n.t('LINK_SELECTOR_SELECTED_TEXT_LABEL')}
                           </span>
                           <span className="font-medium">{selectedText}</span>
                        </div>
                     )}

                     <form onSubmit={handleSubmit} className="flex gap-2">
                        <div className="flex-1">
                           <Input
                              ref={inputRef}
                              type="text"
                              placeholder={
                                 hasSelection
                                    ? i18n.t('LINK_SELECTOR_PLACEHOLDER_SELECTED')
                                    : i18n.t('LINK_SELECTOR_PLACEHOLDER_UNSELECTED')
                              }
                              className={cn(
                                 'w-full h-7 bg-background border rounded px-3 py-2 text-sm outline-none',
                                 'focus:ring-2 focus:ring-blue-500',
                                 hasError ? 'border-red-500' : 'border-border'
                              )}
                              value={url}
                              onChange={(e) => setUrl(e.target.value)}
                           />

                           {/* Validation mesajı */}
                           {(hasError || isValidating) && (
                              <div className="mt-1 flex items-center gap-1 text-xs">
                                 {isValidating ? (
                                    <span className="text-muted-foreground">
                                       {i18n.t('LINK_SELECTOR_VALIDATING')}
                                    </span>
                                 ) : hasError ? (
                                    <>
                                       <AlertTriangle className="h-3 w-3 text-red-500" />
                                       <span className="text-red-600">{validationError}</span>
                                    </>
                                 ) : null}
                              </div>
                           )}

                           {/* ✅ URL preview (metin seçili değilse) */}
                           {!hasSelection && url && !hasError && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                 <span>{i18n.t('LINK_SELECTOR_PREVIEW_LABEL')}: </span>
                                 <span className="font-medium">{getDisplayText(url)}</span>
                              </div>
                           )}
                        </div>

                        <Button
                           type="submit"
                           variant="outline"
                           className="w-10 h-7"
                           disabled={!canSubmit}
                        >
                           <Check className="h-4 w-4" />
                           <span className="sr-only">{i18n.t('LINK_SELECTOR_SUBMIT')}</span>
                        </Button>
                     </form>
                  </div>

                  {/* Güvenlik bildirimi
                  <div className="bg-muted/50 rounded p-3 text-xs text-muted-foreground">
                     <p className="font-medium mb-1">🔒 Güvenlik Kontrolleri:</p>
                     <ul className="space-y-1">
                        <li>• Sadece HTTP/HTTPS protokollerine izin verilir</li>
                        <li>• Zararlı siteler otomatik engellenir</li>
                        <li>• IP adresi linklerine izin verilmez</li>
                     </ul>
                  </div> */}

                  {/* Mevcut link varsa göster */}
                  {currentLink && (
                     <div className="border-t pt-3">
                        <div className="flex items-center justify-between">
                           <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground mb-1">
                                 {i18n.t('CURRENT_LINK')}
                              </p>
                              <p className="text-sm truncate text-blue-600">{currentLink}</p>
                           </div>
                           <Button
                              size="sm"
                              variant="outline"
                              onClick={handleRemoveLink}
                              className="ml-2 h-7 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                           >
                              <Trash className="h-4 w-4 mr-1" />
                           </Button>
                        </div>
                     </div>
                  )}

                  {/* Link hedef seçenekleri */}
                  <div className="border-t pt-3">
                     <div className="flex gap-2">
                        <Button
                           size="sm"
                           variant={
                              editor.getAttributes('link').target === '_self'
                                 ? 'default'
                                 : 'outline'
                           }
                           onClick={() => {
                              if (currentLink) {
                                 editor
                                    .chain()
                                    .focus()
                                    .setLink({
                                       href: currentLink,
                                       target: '_self',
                                    })
                                    .run();
                              }
                           }}
                           className="h-7"
                           disabled={!currentLink}
                        >
                           {i18n.t('SAME_TAB')}
                        </Button>
                        <Button
                           size="sm"
                           variant={
                              editor.getAttributes('link').target === '_blank'
                                 ? 'default'
                                 : 'outline'
                           }
                           onClick={() => {
                              if (currentLink) {
                                 editor
                                    .chain()
                                    .focus()
                                    .setLink({
                                       href: currentLink,
                                       target: '_blank',
                                    })
                                    .run();
                              }
                           }}
                           className="h-7"
                           disabled={!currentLink}
                        >
                           {i18n.t('NEW_TAB')}
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </PopoverContent>
      </Popover>
   );
};
