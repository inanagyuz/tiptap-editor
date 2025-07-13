'use client';

/**
 * @module ContextAI
 *
 * This module provides the ContextAI React component and command for AI-powered content generation and editing in the Tiptap editor.
 * It supports multi-language UI via i18n, quick text commands, smart context tools, and resource integration.
 *
 * @remarks
 * - Integrates with AI backend for text completion and context-aware suggestions.
 * - Includes quick commands (continue, improve, summarize, expand, fix grammar, change tone, translate).
 * - Provides smart context tools (project analysis, code search, documentation reading, database query, code analysis).
 * - Displays context resources and allows interaction with them.
 * - All UI strings are localized via i18n.
 * - Includes a dialog command for opening the ContextAI interface.
 *
 * @example
 * ```tsx
 * <ContextAI editor={editor} onOpenChange={handleClose} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 * @property onOpenChange - Callback fired when the dialog is opened or closed.
 */

import { type Editor } from '@tiptap/react';
import {
   ArrowUp,
   FileText,
   Search,
   Brain,
   Database,
   Code,
   Wand2,
   ArrowDownWideNarrow,
   ArrowUpWideNarrow,
   CheckCheck,
   Type,
   Languages,
   ArrowRight,
   Sparkles,
} from 'lucide-react';
import { CrazySpinner } from '../icon';
import { useCompletion } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Markdown from 'react-markdown';
import { RefreshCcwDot, SquareCheck } from 'lucide-react';
import {
   Command,
   CommandGroup,
   CommandItem,
   CommandList,
   CommandSeparator,
} from '@/components/ui/command';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from '@/components/ui/dialog';
import React from 'react';
import { i18n } from '../i18n';

/**
 * Props for the ContextAI component.
 *
 * @property editor - The Tiptap editor instance.
 * @property onOpenChange - Callback fired when the dialog is opened or closed.
 */

interface ContextAIProps {
   editor: Editor;
   onOpenChange: (open: boolean) => void;
}

/**
 * Resource interface for MCP context resources.
 */

interface MCPResource {
   uri: string;
   name: string;
   description: string;
   type: 'file' | 'database' | 'api' | 'project';
}


/**
 * ContextAI component provides AI-powered content generation and editing for the Tiptap editor.
 *
 * @param editor - The Tiptap editor instance.
 * @param onOpenChange - Callback fired when the dialog is opened or closed.
 */

interface MCPTool {
   name: string;
   description: string;
   icon: React.ComponentType<{ className?: string }>;
   action: string;
}

export function ContextAI({ editor, onOpenChange }: ContextAIProps) {
   const inputRef = useRef<HTMLInputElement>(null);
   const [inputValue, setInputValue] = useState('');
   const [mcpResources, setMcpResources] = useState<MCPResource[]>([]);
   const [mcpLoading, setMcpLoading] = useState(false);

   const apiUrl = process.env.NEXT_PUBLIC_AI_API;
   if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_AI_API environment variable is not set');
   }

   const { completion, complete, isLoading, setCompletion } = useCompletion({
      api: `${apiUrl}/generate`,
      onError: (error) => {
         console.error('🚨 Completion error:', error);
      },
   });

   const hasCompletion = completion.length > 0;

   const handleRetry = () => {
      setCompletion('');
      setInputValue('');
   };

   const getSelectedText = () => {
      const selection = editor.state.selection;
      return editor.state.doc.textBetween(selection.from, selection.to);
   };

   const selectedText = getSelectedText();
   const hasSelectedText = selectedText.trim().length > 0;

   const quickTextCommands = [
      {
         name: 'continue',
         label: i18n.t('AI_CONTINUE_LABEL'),
         description: i18n.t('AI_CONTINUE_DESC'),
         icon: ArrowRight,
         command: i18n.t('AI_CONTINUE_COMMAND'),
         isTranslation: false,
      },
      {
         name: 'improve',
         label: i18n.t('AI_IMPROVE_LABEL'),
         description: i18n.t('AI_IMPROVE_DESC'),
         icon: Wand2,
         command: i18n.t('AI_IMPROVE_COMMAND'),
         isTranslation: false,
      },
      {
         name: 'summarize',
         label: i18n.t('AI_SUMMARIZE_LABEL'),
         description: i18n.t('AI_SUMMARIZE_DESC'),
         icon: ArrowDownWideNarrow,
         command: i18n.t('AI_SUMMARIZE_COMMAND'),
         isTranslation: false,
      },
      {
         name: 'expand',
         label: i18n.t('AI_EXPAND_LABEL'),
         description: i18n.t('AI_EXPAND_DESC'),
         icon: ArrowUpWideNarrow,
         command: i18n.t('AI_EXPAND_COMMAND'),
         isTranslation: false,
      },
      {
         name: 'fix_grammar',
         label: i18n.t('AI_FIX_GRAMMAR_LABEL'),
         description: i18n.t('AI_FIX_GRAMMAR_DESC'),
         icon: CheckCheck,
         command: i18n.t('AI_FIX_GRAMMAR_COMMAND'),
         isTranslation: false,
      },
      {
         name: 'change_tone',
         label: i18n.t('AI_CHANGE_TONE_LABEL'),
         description: i18n.t('AI_CHANGE_TONE_DESC'),
         icon: Type,
         command: i18n.t('AI_CHANGE_TONE_COMMAND'),
         isTranslation: false,
      },
      {
         name: 'translate_english',
         label: i18n.t('AI_TRANSLATE_ENGLISH_LABEL'),
         description: i18n.t('AI_TRANSLATE_ENGLISH_DESC'),
         icon: Languages,
         command: i18n.t('AI_CHANGE_TONE_LABEL'),
         isTranslation: true,
      },
      {
         name: 'translate_turkish',
         label: i18n.t('AI_TRANSLATE_TURKISH_LABEL'),
         description: i18n.t('AI_TRANSLATE_TURKISH_DESC'),
         icon: Languages,
         command: i18n.t('AI_TRANSLATE_TURKISH_COMMAND'),
         isTranslation: true,
      },
      {
         name: 'translate_german',
         label: i18n.t('AI_TRANSLATE_GERMAN_LABEL'),
         description: i18n.t('AI_TRANSLATE_GERMAN_DESC'),
         icon: Languages,
         command: i18n.t('AI_TRANSLATE_GERMAN_COMMAND'),
         isTranslation: true,
      },
   ];

   const handleQuickCommand = async (command: (typeof quickTextCommands)[0]) => {
      const selection = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(selection.from, selection.to);

      if (!selectedText.trim()) {
         alert('Lütfen düzenlemek istediğiniz metni seçin');
         return;
      }

      try {
         // Çeviri komutları ve continue için özel API seçenekleri
         let apiOption = 'zap';

         if (command.name === 'continue') {
            apiOption = 'continue';
         } else if (command.isTranslation) {
            switch (command.name) {
               case 'translate_english':
                  apiOption = 'english';
                  break;
               case 'translate_turkish':
                  apiOption = 'turkish';
                  break;
               case 'translate_german':
                  apiOption = 'german';
                  break;
            }
         }

         await complete(selectedText, {
            body: {
               option: apiOption,
               command:
                  command.isTranslation || command.name === 'continue'
                     ? undefined
                     : command.command,
            },
         });
      } catch (error) {
         console.error('Quick command error:', error);
      }
   };

   // MCP Araçları
   const mcpTools: MCPTool[] = [
      {
         name: 'analyze_project',
         description: i18n.t('MCP_ANALYZE_PROJECT'),
         icon: Brain,
         action: 'project_analysis',
      },
      {
         name: 'search_codebase',
         description: i18n.t('MCP_SEARCH_CODEBASE'),
         icon: Search,
         action: 'code_search',
      },
      {
         name: 'read_documentation',
         description: i18n.t('MCP_READ_DOCUMENTATION'),
         icon: FileText,
         action: 'doc_read',
      },
      {
         name: 'query_database',
         description: i18n.t('MCP_QUERY_DATABASE'),
         icon: Database,
         action: 'db_query',
      },
      {
         name: 'analyze_code',
         description: i18n.t('MCP_ANALYZE_CODE'),
         icon: Code,
         action: 'code_analysis',
      },
   ];

   // MCP Client Hook
   const useMCPClient = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const callMCPTool = async (toolName: string, args: Record<string, any> = {}) => {
         setMcpLoading(true);
         try {
            const response = await fetch(`${apiUrl}/tools`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ tool: toolName, arguments: args }),
            });

            if (!response.ok) {
               throw new Error('MCP tool call failed');
            }

            const result = await response.json();
            return result;
         } catch (error) {
            throw error;
         } finally {
            setMcpLoading(false);
         }
      };

      const getMCPResources = async () => {
         try {
            // Mock resources for now - actual implementation would call MCP resources API
            const mockResources = [
               {
                  uri: 'project://structure',
                  name: 'Proje Yapısı',
                  description: 'Dosya ve klasör yapısı',
                  type: 'project' as const,
               },
               {
                  uri: 'components://list',
                  name: 'Component Listesi',
                  description: 'Tüm React bileşenleri',
                  type: 'file' as const,
               },
               {
                  uri: 'git://status',
                  name: 'Git Durumu',
                  description: 'Repository değişiklikleri',
                  type: 'api' as const,
               },
            ];

            setMcpResources(mockResources);
            return mockResources;
         } catch (error) {
            console.error('Failed to get MCP resources:', error);
            return [];
         }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const callMCPResource = async (resourceName: string, args: Record<string, any> = {}) => {
         setMcpLoading(true);
         try {
            const response = await fetch(`${apiUrl}/resources`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ resource: resourceName, arguments: args }),
            });

            if (!response.ok) {
               throw new Error('MCP resource call failed');
            }

            const result = await response.json();
            return result;
         } catch (error) {
            throw error;
         } finally {
            setMcpLoading(false);
         }
      };

      return { callMCPTool, getMCPResources, callMCPResource };
   };

   const { callMCPTool, getMCPResources, callMCPResource } = useMCPClient();

   // MCP Resources yükle
   useEffect(() => {
      getMCPResources();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleResourceClick = async (resource: MCPResource) => {
      try {
         let resourceResult;

         switch (resource.uri) {
            case 'project://structure':
               resourceResult = await callMCPResource('project_structure');
               break;
            case 'components://list':
               resourceResult = await callMCPResource('component_list');
               break;
            case 'git://status':
               resourceResult = await callMCPResource('git_status');
               break;
            default:
               resourceResult = { content: 'Kaynak bulunamadı.', type: 'error' };
         }

         if (resourceResult?.content) {
            await complete(resourceResult.content, {
               body: {
                  option: 'mcp_resource',
                  command: `kaynaktan bilgi: ${resource.name}`,
                  mcpContext: true,
               },
            });
         }
      } catch (error) {
         console.error('Resource click error:', error);
      }
   };

   const cleanCompletion = (text: string) => {
      try {
         const parsed = JSON.parse(text);
         if (typeof parsed === 'object' && parsed !== null) {
            const firstStringValue = Object.values(parsed).find(
               (value) => typeof value === 'string'
            );
            return firstStringValue || text;
         }
         return text;
      } catch {
         return text.trim().replace(/^["']|["']$/g, '');
      }
   };

   const handleMCPToolCall = async (tool: MCPTool) => {
      if (!inputValue.trim()) {
         // Input boşsa, kaynaktan bilgi al
         try {
            let contextData = '';

            switch (tool.action) {
               case 'project_analysis':
                  const projectData = await callMCPTool('analyze_project');
                  contextData = projectData.content || 'Proje analizi tamamlandı.';
                  break;

               case 'code_search':
                  const searchData = await callMCPTool('search_code', {
                     query: editor.state.doc.textContent || 'React component',
                  });
                  contextData = searchData.content || 'Kod arama tamamlandı.';
                  break;

               case 'doc_read':
                  const docData = await callMCPTool('read_docs', {
                     path: 'README.md',
                  });
                  contextData = docData.content || 'Dokümantasyon okundu.';
                  break;

               case 'db_query':
                  const dbData = await callMCPTool('query_db', {
                     table: 'pages',
                  });
                  contextData = dbData.content || 'Veritabanı sorgulandı.';
                  break;

               case 'code_analysis':
                  const selectedText = editor.state.doc.textBetween(
                     editor.state.selection.from,
                     editor.state.selection.to
                  );
                  const analysisData = await callMCPTool('analyze_code', {
                     code: selectedText,
                  });
                  contextData = analysisData.content || 'Kod analizi tamamlandı.';
                  break;
            }

            await complete(contextData, {
               body: {
                  option: 'mcp_context',
                  command: `düzenle: ${tool.description} sonuçlarını açıkla`,
                  mcpContext: true,
               },
            });
         } catch (error) {
            console.error('MCP Tool Error:', error);
         }
      } else {
         // Input varsa, input + context ile çalış
         try {
            const command = `düzenle: ${inputValue}`;
            const selectedText = editor.state.doc.textBetween(
               editor.state.selection.from,
               editor.state.selection.to
            );

            await complete(selectedText || inputValue, {
               body: {
                  option: 'mcp_enhanced',
                  command: command,
                  mcpTool: tool.action,
                  mcpContext: true,
               },
            });

            setInputValue('');
         } catch (error) {
            console.error('MCP Enhanced Error:', error);
         }
      }
   };

   const handleStandardComplete = async () => {
      const trimmedValue = inputValue.trim();
      if (!trimmedValue) return;

      try {
         const command = `düzenle: ${trimmedValue}`;
         const text = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to
         );

         await complete(text, {
            body: { option: 'standard', command: command },
         });

         setInputValue('');
      } catch (error) {
         console.error('Standard completion error:', error);
      }
   };

   const handleAccept = () => {
      const cleanedCompletion = cleanCompletion(completion);
      const { from, to } = editor.state.selection;

      if (from !== to) {
         // Seçili metin varsa değiştir
         editor.chain().focus().deleteRange({ from, to }).insertContent(cleanedCompletion).run();
      } else {
         // Seçili metin yoksa cursor pozisyonuna ekle
         editor.chain().focus().insertContent(cleanedCompletion).run();
      }

      onOpenChange(false);
   };

   useEffect(() => {
      if (inputRef.current && !hasCompletion) {
         setTimeout(() => {
            inputRef.current?.focus();
         }, 100);
      }
   }, [hasCompletion]);

   if (!editor) return null;

   return (
      <Command className="min-h-[300px] rounded-lg border-none shadow-md w-[420px]">
         <CommandList>
            {/* Header */}
            <div className="p-3 border-b bg-gradient-to-r from-purple-50 to-blue-50">
               <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900">ContextAI</span>
                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                     MCP Powered
                  </span>
               </div>
               <p className="text-xs text-purple-700 mt-1">{i18n.t('AI_ASSISTANT_DESC')}</p>
            </div>

            {(isLoading || mcpLoading) && (
               <CommandGroup>
                  <CommandItem disabled>
                     <div className="flex items-center gap-2 text-muted-foreground">
                        <CrazySpinner />
                        {mcpLoading ? i18n.t('MCP_ANALYZING') : i18n.t('AI_THINKING')}
                     </div>
                  </CommandItem>
               </CommandGroup>
            )}

            {!isLoading && !mcpLoading && (
               <>
                  {/* Input Area */}
                  <CommandGroup className="relative">
                     <CommandItem>
                        <div className="relative w-full">
                           <input
                              ref={inputRef}
                              type="text"
                              value={inputValue}
                              placeholder={
                                 hasCompletion
                                    ? i18n.t('AI_NEXT_INSTRUCTION')
                                    : i18n.t('AI_INPUT_PLACEHOLDER')
                              }
                              onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleStandardComplete();
                                 }
                              }}
                              onChange={(e) => setInputValue(e.target.value)}
                              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 pr-12"
                              autoComplete="off"
                              autoFocus
                           />
                           <Button
                              size="sm"
                              onClick={handleStandardComplete}
                              className="absolute right-1 top-1 h-8 w-8 p-0 bg-purple-600 hover:bg-purple-700"
                              disabled={!inputValue.trim()}
                           >
                              <ArrowUp className="h-4 w-4" />
                           </Button>
                        </div>
                     </CommandItem>
                  </CommandGroup>

                  {/* Hızlı Metin Komutları */}
                  {!hasCompletion && (
                     <>
                        <CommandSeparator />
                        <CommandGroup>
                           <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                              {i18n.t('QUICK_COMMANDS_TITLE')}
                           </div>
                           {!hasSelectedText && (
                              <CommandItem disabled>
                                 <div className="w-full text-center">
                                    <div className="text-sm text-muted-foreground">
                                       {i18n.t('AI_SELECT_TEXT_ALERT')}
                                    </div>
                                 </div>
                              </CommandItem>
                           )}
                           {hasSelectedText &&
                              quickTextCommands.map((cmd) => {
                                 const IconComponent = cmd.icon;
                                 return (
                                    <CommandItem key={cmd.name}>
                                       <button
                                          onClick={() => handleQuickCommand(cmd)}
                                          className="w-full text-left rounded flex items-center gap-3 hover:bg-accent transition-colors"
                                          disabled={isLoading}
                                       >
                                          <IconComponent className="h-4 w-4 text-purple-600" />
                                          <div className="flex-1">
                                             <div className="text-sm font-medium">{cmd.label}</div>
                                             <div className="text-xs text-muted-foreground">
                                                {cmd.description}
                                             </div>
                                          </div>
                                       </button>
                                    </CommandItem>
                                 );
                              })}
                        </CommandGroup>
                     </>
                  )}

                  {/* MCP Tools */}
                  {!hasCompletion && (
                     <>
                        <CommandSeparator />
                        <CommandGroup>
                           <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                              {i18n.t('MCP_TOOLS_TITLE')}
                           </div>
                           {mcpTools.map((tool) => {
                              const IconComponent = tool.icon;
                              return (
                                 <CommandItem key={tool.name}>
                                    <button
                                       onClick={() => handleMCPToolCall(tool)}
                                       className="w-full text-left rounded flex items-center gap-3 hover:bg-accent transition-colors"
                                       disabled={mcpLoading}
                                    >
                                       <IconComponent className="h-4 w-4 text-blue-600" />
                                       <div className="flex-1">
                                          <div className="text-sm font-medium">
                                             {tool.description}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                             MCP: {tool.action}
                                          </div>
                                       </div>
                                    </button>
                                 </CommandItem>
                              );
                           })}
                        </CommandGroup>
                     </>
                  )}

                  {/* Resources */}
                  {mcpResources.length > 0 && !hasCompletion && (
                     <>
                        <CommandSeparator />
                        <CommandGroup>
                           <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                              {i18n.t('MCP_RESOURCES_TITLE')}
                           </div>
                           {mcpResources.slice(0, 3).map((resource) => (
                              <CommandItem key={resource.uri}>
                                 <button
                                    onClick={() => handleResourceClick(resource)}
                                    className="w-full text-left rounded flex items-center gap-2 hover:bg-accent transition-colors p-1"
                                 >
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <div className="flex-1">
                                       <div className="text-xs font-medium">{resource.name}</div>
                                       <div className="text-xs text-muted-foreground truncate">
                                          {resource.description}
                                       </div>
                                    </div>
                                 </button>
                              </CommandItem>
                           ))}
                        </CommandGroup>
                     </>
                  )}

                  {/* Completion Display */}
                  {hasCompletion && (
                     <>
                        <CommandGroup>
                           <CommandItem disabled>
                              <ScrollArea className="w-full">
                                 <div
                                    className="prose prose-sm"
                                    style={
                                       {
                                          color: 'var(--foreground)',
                                          '--tw-prose-body': 'var(--foreground)',
                                          '--tw-prose-headings': 'var(--foreground)',
                                          '--tw-prose-links': 'var(--foreground)',
                                          '--tw-prose-bold': 'var(--foreground)',
                                          '--tw-prose-counters': 'var(--foreground)',
                                          '--tw-prose-bullets': 'var(--foreground)',
                                          '--tw-prose-hr': 'var(--border)',
                                          '--tw-prose-quotes': 'var(--muted-foreground)',
                                          '--tw-prose-quote-borders': 'var(--border)',
                                          '--tw-prose-captions': 'var(--muted-foreground)',
                                          '--tw-prose-code': 'var(--foreground)',
                                          '--tw-prose-pre-code': 'var(--foreground)',
                                          '--tw-prose-pre-bg': 'var(--muted)',
                                          '--tw-prose-th-borders': 'var(--border)',
                                          '--tw-prose-td-borders': 'var(--border)',
                                       } as React.CSSProperties
                                    }
                                 >
                                    <Markdown>{cleanCompletion(completion)}</Markdown>
                                 </div>
                              </ScrollArea>
                           </CommandItem>
                        </CommandGroup>

                        {/* Accept/Reject Actions */}
                        <CommandSeparator />
                        <CommandGroup>
                           <CommandItem>
                              <button
                                 onClick={handleAccept}
                                 className="w-full text-left rounded flex items-center gap-2 bg-green-50 hover:bg-green-100 p-2 transition-colors"
                              >
                                 <SquareCheck className="h-4 w-4 text-green-600" />
                                 <span className="text-green-700 font-medium">
                                    {i18n.t('AI_ACCEPT')}
                                 </span>
                              </button>
                           </CommandItem>
                           <CommandItem>
                              <button
                                 onClick={handleRetry}
                                 className="w-full text-left rounded flex items-center gap-2 hover:bg-accent p-2 transition-colors"
                              >
                                 <RefreshCcwDot className="h-4 w-4 text-orange-500" />
                                 <span>{i18n.t('AI_RETRY')}</span>
                              </button>
                           </CommandItem>
                        </CommandGroup>
                     </>
                  )}
               </>
            )}
         </CommandList>
      </Command>
   );
}

/**
 * ContextAI command function.
 * Opens the ContextAI dialog for AI-powered content generation and editing.
 *
 * @param editor - The Tiptap editor instance.
 */

export const contextAICommand = ({ editor }: { editor: Editor }) => {
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

      // Create QueryClient instance for this dialog
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
            // Clean up the container after dialog closes
            setTimeout(cleanup, 100);
         };

         return (
            <Dialog open={open} onOpenChange={handleClose}>
               <DialogContent className="w-[420px] p-0 gap-0">
                  <DialogHeader className="hidden">
                     <DialogTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                     </DialogTitle>
                     <DialogDescription className="hidden">
                       {
                           i18n.t('CONTEXT_AI_DIALOG_DESC')
                       }
                     </DialogDescription>
                  </DialogHeader>
                  <QueryClientProvider client={queryClient}>
                     <ContextAI editor={editor} onOpenChange={handleClose} />
                  </QueryClientProvider>
               </DialogContent>
            </Dialog>
         );
      };

      // Render the dialog with QueryClient provider
      root.render(<DialogComponent />);
   } catch (error) {
      console.error('ContextAI command error:', error);
   }
};
