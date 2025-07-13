/**
 * @module TableSelector
 *
 * This module provides the TableSelector React component for inserting and editing tables in the Tiptap editor.
 * It displays a grid for quick table insertion and a compact menu for table actions such as adding/removing rows and columns, merging/splitting cells, toggling headers, fixing tables, and deleting tables.
 * All UI strings should be localized via i18n for multi-language support.
 *
 * @remarks
 * - Integrates with Tiptap editor's table commands.
 * - Shows a grid for selecting table size (up to 6x6).
 * - Displays available actions when inside a table.
 * - Supports quick actions for common table sizes.
 * - Highlights active header rows/columns and disables unavailable actions.
 *
 * @example
 * ```tsx
 * <TableSelector editor={editor} open={open} onOpenChange={setOpen} />
 * ```
 *
 * @property editor - The Tiptap editor instance.
 * @property open - Whether the selector popover is open.
 * @property onOpenChange - Callback fired when the selector is opened or closed.
 */
'use client';
import { useState } from 'react';
import { Editor } from '@tiptap/react';
import {
   Table,
   Plus,
   Minus,
   Merge,
   Split,
   RowsIcon,
   Columns,
   Trash2,
   Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { i18n } from '../i18n';

interface TableSelectorProps {
   editor: Editor;
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

export const TableSelector = ({ editor, open, onOpenChange }: TableSelectorProps) => {
   const [hoveredCell, setHoveredCell] = useState({ row: 0, col: 0 });

   // Table durumlarını kontrol et
   const isInTable = editor.isActive('table');
   const canMergeCells = editor.can().mergeCells();
   const canSplitCell = editor.can().splitCell();
   const canAddColumnBefore = editor.can().addColumnBefore();
   const canAddColumnAfter = editor.can().addColumnAfter();
   const canDeleteColumn = editor.can().deleteColumn();
   const canAddRowBefore = editor.can().addRowBefore();
   const canAddRowAfter = editor.can().addRowAfter();
   const canDeleteRow = editor.can().deleteRow();
   const canDeleteTable = editor.can().deleteTable();

   // Grid için tablo oluştur
   const handleInsertTable = (rows: number, cols: number) => {
      editor
         .chain()
         .focus()
         .insertTable({
            rows,
            cols,
            withHeaderRow: true,
         })
         .run();
      onOpenChange(false);
   };

   // Grid görselleştirme - Daha kompakt
   const renderTableGrid = () => {
      const maxRows = 6; // ✅ Daha az satır
      const maxCols = 6; // ✅ Daha az sütun

      return (
         <div className="p-3 space-y-2 w-48 overflow-hidden">
            {/* ✅ Fixed width + overflow hidden */}
            <div className="text-sm font-medium truncate">{i18n.t('INSERT_TABLE')}</div>
            <div
               className="grid gap-0.5"
               style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}
               onMouseLeave={() => setHoveredCell({ row: 0, col: 0 })}
            >
               {Array.from({ length: maxRows * maxCols }).map((_, index) => {
                  const row = Math.floor(index / maxCols) + 1;
                  const col = (index % maxCols) + 1;
                  const isHovered = row <= hoveredCell.row && col <= hoveredCell.col;

                  return (
                     <div
                        key={index}
                        className={cn(
                           'w-5 h-5 border border-gray-300 cursor-pointer transition-all duration-150',
                           isHovered
                              ? 'bg-blue-500 border-blue-600 shadow-sm'
                              : 'bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'
                        )}
                        onMouseEnter={() => setHoveredCell({ row, col })}
                        onClick={() => handleInsertTable(row, col)}
                     />
                  );
               })}
            </div>
            <div className="text-xs text-muted-foreground text-center py-1 truncate">
               {hoveredCell.row > 0 && hoveredCell.col > 0
                  ? `${hoveredCell.row} × ${hoveredCell.col}`
                  : i18n.t('SELECT_TABLE_SIZE')}
            </div>
            {/* Quick Actions - Daha kompakt */}
            <div className="flex gap-1 pt-2 border-t">
               <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInsertTable(2, 2)}
                  className="flex-1 h-6 text-xs px-1"
               >
                  2×2
               </Button>
               <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInsertTable(3, 3)}
                  className="flex-1 h-6 text-xs px-1"
               >
                  3×3
               </Button>
               <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleInsertTable(4, 4)}
                  className="flex-1 h-6 text-xs px-1"
               >
                  4×4
               </Button>
            </div>
         </div>
      );
   };

   // Table actions menüsü - Kompakt versiyon
   const renderTableActions = () => {
      return (
         <div className="p-2 space-y-1 w-48 overflow-hidden">
            {/* ✅ Fixed width + overflow hidden */}
            <div className="text-xs font-medium text-muted-foreground px-1 py-1 truncate">
               {i18n.t('TABLE_ACTIONS')}
            </div>
            {/* ✅ Column Actions - Horizontal layout */}
            <div className="space-y-1">
               <div className="text-xs text-muted-foreground px-1 truncate">Columns</div>
               <div className="flex gap-1">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        editor.chain().focus().addColumnBefore().run();
                        onOpenChange(false);
                     }}
                     disabled={!canAddColumnBefore}
                     className="flex-1 h-6 text-xs px-1"
                     title={i18n.t('ADD_COLUMN_BEFORE')}
                  >
                     <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        editor.chain().focus().addColumnAfter().run();
                        onOpenChange(false);
                     }}
                     disabled={!canAddColumnAfter}
                     className="flex-1 h-6 text-xs px-1"
                     title={i18n.t('ADD_COLUMN_AFTER')}
                  >
                     <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        editor.chain().focus().deleteColumn().run();
                        onOpenChange(false);
                     }}
                     disabled={!canDeleteColumn}
                     className="h-6 w-6 p-0 text-red-600"
                     title={i18n.t('DELETE_COLUMN')}
                  >
                     <Minus className="h-3 w-3" />
                  </Button>
               </div>
            </div>
            {/* ✅ Row Actions */}
            <div className="space-y-1">
               <div className="text-xs text-muted-foreground px-1 truncate">{i18n.t('ROWS')}</div>
               <div className="flex gap-1">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        editor.chain().focus().addRowBefore().run();
                        onOpenChange(false);
                     }}
                     disabled={!canAddRowBefore}
                     className="flex-1 h-6 text-xs px-1"
                     title={i18n.t('ADD_ROW_BEFORE')}
                  >
                     <RowsIcon className="h-3 w-3" />
                  </Button>
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        editor.chain().focus().addRowAfter().run();
                        onOpenChange(false);
                     }}
                     disabled={!canAddRowAfter}
                     className="flex-1 h-6 text-xs px-1"
                     title={i18n.t('ADD_ROW_AFTER')}
                  >
                     <RowsIcon className="h-3 w-3" />
                  </Button>
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        editor.chain().focus().deleteRow().run();
                        onOpenChange(false);
                     }}
                     disabled={!canDeleteRow}
                     className="h-6 w-6 p-0 text-red-600"
                     title={i18n.t('DELETE_ROW')}
                  >
                     <Minus className="h-3 w-3" />
                  </Button>
               </div>
            </div>
            {/* ✅ Cell Actions */}
            <div className="space-y-1">
               <div className="text-xs text-muted-foreground px-1 truncate">Cells</div>
               <div className="flex gap-1">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        editor.chain().focus().mergeCells().run();
                        onOpenChange(false);
                     }}
                     disabled={!canMergeCells}
                     className="flex-1 h-6 text-xs px-1"
                     title={i18n.t('MERGE_CELLS')}
                  >
                     <Merge className="h-3 w-3" />
                  </Button>
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        editor.chain().focus().splitCell().run();
                        onOpenChange(false);
                     }}
                     disabled={!canSplitCell}
                     className="flex-1 h-6 text-xs px-1"
                     title={i18n.t('SPLIT_CELLS')}
                  >
                     <Split className="h-3 w-3" />
                  </Button>
               </div>
            </div>
            {/* ✅ Header toggles */}
            <div className="space-y-1">
               <div className="text-xs text-muted-foreground px-1 truncate">Headers</div>
               <div className="flex gap-1">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        editor.chain().focus().toggleHeaderRow().run();
                        onOpenChange(false);
                     }}
                     className={cn(
                        'flex-1 h-6 text-xs px-1 relative',
                        editor.isActive('tableRow', { header: true }) && 'bg-blue-100 text-blue-700'
                     )}
                     title={i18n.t('TOGGLE_HEADER_ROW')}
                  >
                     <RowsIcon className="h-3 w-3" />
                     {editor.isActive('tableRow', { header: true }) && (
                        <div className="w-1 h-1 bg-blue-500 rounded-full absolute top-1 right-1" />
                     )}
                  </Button>
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => {
                        editor.chain().focus().toggleHeaderColumn().run();
                        onOpenChange(false);
                     }}
                     className={cn(
                        'flex-1 h-6 text-xs px-1 relative',
                        editor.isActive('tableCell', { header: true }) &&
                           'bg-blue-100 text-blue-700'
                     )}
                     title={i18n.t('TOGGLE_HEADER_COLUMN')}
                  >
                     <Columns className="h-3 w-3" />
                     {editor.isActive('tableCell', { header: true }) && (
                        <div className="w-1 h-1 bg-blue-500 rounded-full absolute top-1 right-1" />
                     )}
                  </Button>
               </div>
            </div>
            {/* ✅ Utility actions */}
            <div className="pt-1 border-t space-y-1">
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                     editor.chain().focus().fixTables().run();
                     onOpenChange(false);
                  }}
                  className="w-full justify-start gap-1 h-6 text-xs px-1"
               >
                  <Settings className="h-3 w-3" />
                  <span className="truncate">{i18n.t('FIX_TABLE')}</span>
               </Button>

               <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                     editor.chain().focus().deleteTable().run();
                     onOpenChange(false);
                  }}
                  disabled={!canDeleteTable}
                  className="w-full justify-start gap-1 h-6 text-xs px-1 text-red-600 hover:text-red-700 hover:bg-red-50"
               >
                  <Trash2 className="h-3 w-3" />
                  <span className="truncate">{i18n.t('DELETE')}</span>
               </Button>
            </div>
         </div>
      );
   };

   return (
      <Popover open={open} onOpenChange={onOpenChange}>
         <PopoverTrigger asChild>
            <Button
               variant="ghost"
               size="sm"
               className={cn(
                  'h-8 gap-2',
                  isInTable && 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
               )}
            >
               <Table className="h-4 w-4" />
               <span className="hidden sm:inline truncate">
                  {isInTable ? i18n.t('TABLE_OPTIONS') : null}
               </span>
            </Button>
         </PopoverTrigger>

         <PopoverContent
            className="w-auto p-0 overflow-hidden"
            align="start"
            side="bottom"
            sideOffset={8}
            collisionPadding={10}
         >
            {isInTable ? renderTableActions() : renderTableGrid()}
         </PopoverContent>
      </Popover>
   );
};
