'use client';

/**
 * @module ImageUploadNode
 *
 * This module provides the ImageUploadNode React component for TipTap editor.
 * It enables uploading images directly within the editor, with drag-and-drop, file picker, progress display, and error handling.
 * All UI strings are localized via i18n for multi-language support.
 *
 * @remarks
 * - Supports file size and count limits, custom upload logic, and progress callbacks.
 * - Displays upload progress, success, and error states.
 * - Allows removing files before upload is complete.
 * - Shows formatted file size and localized messages.
 * - Integrates with TipTap node view system.
 *
 * @example
 * ```tsx
 * <ImageUploadNode {...props} />
 * ```
 *
 * @property fileItem - The current file being uploaded.
 * @property uploadFiles - Function to upload selected files.
 * @property clearFileItem - Function to clear the current file item.
 */

import * as React from 'react';
import type { NodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { CloseIcon, CloudUploadIcon, FileIcon, FileCornerIcon } from '../icon';
import './image-upload.scss';
import { i18n } from '../i18n';

export interface FileItem {
   id: string;
   file: File;
   progress: number;
   status: 'uploading' | 'success' | 'error';
   url?: string;
   abortController?: AbortController;
}

interface UploadOptions {
   maxSize: number;
   limit: number;
   accept: string;
   upload: (
      file: File,
      onProgress: (event: { progress: number }) => void,
      signal: AbortSignal
   ) => Promise<string>;
   onSuccess?: (url: string) => void;
   onError?: (error: Error) => void;
}

/**
 * Custom hook for handling file upload logic and state.
 *
 * @param options - Upload options including limits and callbacks.
 * @returns File upload state and functions.
 */

function useFileUpload(options: UploadOptions) {
   const [fileItem, setFileItem] = React.useState<FileItem | null>(null);

   const uploadFile = async (file: File): Promise<string | null> => {
      if (file.size > options.maxSize) {
         const maxSizeMB = options.maxSize / 1024 / 1024;
         const error = new Error(
            i18n.t('FILE_SIZE_EXCEEDS').replace('{maxSizeMB}', maxSizeMB.toString())
         );
         options.onError?.(error);
         return null;
      }

      const abortController = new AbortController();

      const newFileItem: FileItem = {
         id: crypto.randomUUID(),
         file,
         progress: 0,
         status: 'uploading',
         abortController,
      };

      setFileItem(newFileItem);

      try {
         if (!options.upload) {
            throw new Error(i18n.t('UPLOAD_FUNCTION_NOT_DEFINED'));
         }

         const url = await options.upload(
            file,
            (event: { progress: number }) => {
               setFileItem((prev) => {
                  if (!prev) return null;
                  return {
                     ...prev,
                     progress: event.progress,
                  };
               });
            },
            abortController.signal
         );

         if (!url) throw new Error(i18n.t('UPLOAD_FAILED_NO_URL'));

         if (!abortController.signal.aborted) {
            setFileItem((prev) => {
               if (!prev) return null;
               return {
                  ...prev,
                  status: 'success',
                  url,
                  progress: 100,
               };
            });
            options.onSuccess?.(url);
            return url;
         }

         return null;
      } catch (error) {
         if (!abortController.signal.aborted) {
            setFileItem((prev) => {
               if (!prev) return null;
               return {
                  ...prev,
                  status: 'error',
                  progress: 0,
               };
            });
            options.onError?.(error instanceof Error ? error : new Error(i18n.t('UPLOAD_FAILED')));
         }
         return null;
      }
   };

   const uploadFiles = async (files: File[]): Promise<string | null> => {
      if (!files || files.length === 0) {
         options.onError?.(new Error(i18n.t('NO_FILES_TO_UPLOAD')));
         return null;
      }

      if (options.limit && files.length > options.limit) {
         options.onError?.(
            new Error(i18n.t('MAXIMUM_FILES_ALLOWED').replace('{limit}', options.limit.toString()))
         );
         return null;
      }

      const file = files[0];
      if (!file) {
         options.onError?.(new Error(i18n.t('NO_FILE_SELECTED')));
         return null;
      }

      return uploadFile(file);
   };

   const clearFileItem = () => {
      if (!fileItem) return;

      if (fileItem.abortController) {
         fileItem.abortController.abort();
      }
      if (fileItem.url) {
         URL.revokeObjectURL(fileItem.url);
      }
      setFileItem(null);
   };

   return {
      fileItem,
      uploadFiles,
      clearFileItem,
   };
}

interface ImageUploadDragAreaProps {
   onFile: (files: File[]) => void;
   children?: React.ReactNode;
}

const ImageUploadDragArea: React.FC<ImageUploadDragAreaProps> = ({ onFile, children }) => {
   const [dragover, setDragover] = React.useState(false);

   const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
      setDragover(false);
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.dataTransfer.files);
      onFile(files);
   };

   const onDragover = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragover(true);
   };

   const onDragleave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragover(false);
   };

   return (
      <div
         className={`tiptap-image-upload-dragger ${
            dragover ? 'tiptap-image-upload-dragger-active' : ''
         }`}
         onDrop={onDrop}
         onDragOver={onDragover}
         onDragLeave={onDragleave}
      >
         {children}
      </div>
   );
};

/**
 * Drag-and-drop area for uploading images.
 *
 * @param onFile - Callback for dropped files.
 * @param children - Content to render inside the drop area.
 */

interface ImageUploadPreviewProps {
   file: File;
   progress: number;
   status: 'uploading' | 'success' | 'error';
   onRemove: () => void;
}

/**
 * Preview component for showing file upload progress and info.
 *
 * @param file - The file being uploaded.
 * @param progress - Upload progress percentage.
 * @param status - Upload status.
 * @param onRemove - Callback to remove the file.
 */

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
   file,
   progress,
   status,
   onRemove,
}) => {
   const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
   };

   return (
      <div className="tiptap-image-upload-preview">
         {status === 'uploading' && (
            <div className="tiptap-image-upload-progress" style={{ width: `${progress}%` }} />
         )}

         <div className="tiptap-image-upload-preview-content">
            <div className="tiptap-image-upload-file-info">
               <div className="tiptap-image-upload-file-icon">
                  <CloudUploadIcon />
               </div>
               <div className="tiptap-image-upload-details">
                  <span className="tiptap-image-upload-text">{file.name}</span>
                  <span className="tiptap-image-upload-subtext">{formatFileSize(file.size)}</span>
               </div>
            </div>
            <div className="tiptap-image-upload-actions">
               {status === 'uploading' && (
                  <span className="tiptap-image-upload-progress-text">{progress}%</span>
               )}
               <button
                  className="tiptap-image-upload-close-btn"
                  onClick={(e) => {
                     e.stopPropagation();
                     onRemove();
                  }}
               >
                  <CloseIcon />
               </button>
            </div>
         </div>
      </div>
   );
};

/**
 * Drop zone content for image upload, including icons and instructions.
 *
 * @param maxSize - Maximum file size in bytes.
 */

const DropZoneContent: React.FC<{ maxSize: number }> = ({ maxSize }) => (
   <>
      <div className="tiptap-image-upload-dropzone">
         <FileIcon />
         <FileCornerIcon />
         <div className="tiptap-image-upload-icon-container">
            <CloudUploadIcon />
         </div>
      </div>

      <div className="tiptap-image-upload-content">
         <span className="tiptap-image-upload-text">
            <em>{i18n.t('CLICK_TO_UPLOAD')}</em> {i18n.t('OR_DRAG_AND_DROP')}
         </span>
         <span className="tiptap-image-upload-subtext">
            {i18n.t('MAXIMUM_FILE_SIZE').replace('{maxSizeMB}', (maxSize / 1024 / 1024).toString())}
         </span>
      </div>
   </>
);

/**
 * ImageUploadNode component for TipTap editor node view.
 *
 * @param props - NodeViewProps from TipTap.
 */

export const ImageUploadNode: React.FC<NodeViewProps> = (props) => {
   const { accept, limit, maxSize } = props.node.attrs;
   const inputRef = React.useRef<HTMLInputElement>(null);
   const extension = props.extension;

   const uploadOptions: UploadOptions = {
      maxSize,
      limit,
      accept,
      upload: extension.options.upload,
      onSuccess: extension.options.onSuccess,
      onError: extension.options.onError,
   };

   const { fileItem, uploadFiles, clearFileItem } = useFileUpload(uploadOptions);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) {
         extension.options.onError?.(new Error(i18n.t('NO_FILE_SELECTED')));
         return;
      }
      handleUpload(Array.from(files));
   };

   const handleUpload = async (files: File[]) => {
      const url = await uploadFiles(files);

      if (url) {
         const pos = props.getPos();
         const filename = files[0]?.name.replace(/\.[^/.]+$/, '') || 'unknown';

         if (typeof pos === 'number') {
            props.editor
               .chain()
               .focus()
               .deleteRange({ from: pos, to: pos + 1 })
               .insertContentAt(pos, [
                  {
                     type: 'image',
                     attrs: { src: url, alt: filename, title: filename },
                  },
               ])
               .run();
         } else {
            extension.options.onError?.(new Error(i18n.t('COULD_NOT_DETERMINE_POSITION')));
         }
      }
   };

   const handleClick = () => {
      if (inputRef.current && !fileItem) {
         inputRef.current.value = '';
         inputRef.current.click();
      }
   };

   return (
      <NodeViewWrapper className="tiptap-image-upload" tabIndex={0} onClick={handleClick}>
         {!fileItem && (
            <ImageUploadDragArea onFile={handleUpload}>
               <DropZoneContent maxSize={maxSize} />
            </ImageUploadDragArea>
         )}

         {fileItem && (
            <ImageUploadPreview
               file={fileItem.file}
               progress={fileItem.progress}
               status={fileItem.status}
               onRemove={clearFileItem}
            />
         )}

         <input
            ref={inputRef}
            name="file"
            accept={accept}
            type="file"
            onChange={handleChange}
            onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
         />
      </NodeViewWrapper>
   );
};
