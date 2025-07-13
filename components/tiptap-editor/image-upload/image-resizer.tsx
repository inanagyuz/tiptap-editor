/**
 * @module ImageResizer
 * @description Adds image resizing, alignment and rotation controls for Tiptap extension.
 * @author İnan Ağyüz
 * @version 1.0.0
 * @date May 26, 2025
 */

import Image from '@tiptap/extension-image';

/**
 * HTMLAttributes definition for extension configuration.
 * @interface ImageResizerOptions
 * @property {Record<string, any>} HTMLAttributes - HTML attributes
 */
interface ImageResizerOptions {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   HTMLAttributes: Record<string, any>;
}

/**
 * Image resizing, alignment and rotation extension.
 * @constant ImageResizer
 * @description Advanced image control extension for Tiptap editor
 */
export const ImageResizer = Image.extend<ImageResizerOptions>({
   name: 'imageResizer',

   /**
    * Defines attributes for image node
    * @returns {Object} Node attributes
    */
   addAttributes() {
      return {
         ...this.parent?.(),
         style: {
            default: 'width: 100%; height: auto; cursor: pointer;',
            parseHTML: (element) => {
               const width = element.getAttribute('width');
               return width
                  ? `width: ${width}px; height: auto; cursor: pointer;`
                  : `${element.style.cssText}`;
            },
         },
         wrapperStyle: {
            default: 'display: flex;',
            parseHTML: (element) => {
               const wrapper = element.parentElement;
               return wrapper ? wrapper.style.cssText : 'display: flex;';
            },
         },
      };
   },

   /**
    * Creates visual view for image node
    * @returns {Function} Node view function
    */
   addNodeView() {
      return ({ node, editor, getPos }) => {
         const {
            view,
            options: { editable },
         } = editor;
         const { style, wrapperStyle } = node.attrs;
         const $wrapper = document.createElement('div');
         const $container = document.createElement('div');
         const $img = document.createElement('img');
         const iconStyle = 'width: 24px; height: 24px; cursor: pointer;';

         /**
          * Dispatch operation for node updates
          * @function dispatchNodeView
          * @description Applies image changes to editor state
          */
         const dispatchNodeView = () => {
            if (typeof getPos === 'function') {
               const pos = getPos();
               if (typeof pos === 'number') {
                  const newAttrs = {
                     ...node.attrs,
                     style: `${$img.style.cssText}`,
                     wrapperStyle: `${$wrapper.style.cssText}`,
                  };
                  view.dispatch(view.state.tr.setNodeMarkup(pos, null, newAttrs));
               }
            }
         };

         /**
          * Parses current rotation angle
          * @function parseCurrentRotation
          * @returns {number} Current rotation angle (degrees)
          */
         const parseCurrentRotation = (): number => {
            const match = $img.style.transform.match(/rotate\(([^)]+)deg\)/);
            return match ? parseInt(match[1]) || 0 : 0;
         };

         /**
          * Rotates image by specified angle
          * @function rotateImage
          * @param {number} angle - Rotation angle (degrees)
          */
         const rotateImage = (angle: number) => {
            const currentRotation = parseCurrentRotation();
            const newRotation = currentRotation + angle;
            const otherTransforms = $img.style.transform.replace(/rotate\([^)]*\)/, '').trim();
            $img.style.transform = `${otherTransforms} rotate(${newRotation}deg)`.trim();
            dispatchNodeView();
         };

         /**
          * Creates control panel and icons (alignment + rotation + inline float)
          * @function paintPositionController
          * @description Creates control panel and buttons for image
          */
         const paintPositionController = () => {
            const $positionController = document.createElement('div');
            const $leftController = document.createElement('img');
            const $centerController = document.createElement('img');
            const $rightController = document.createElement('img');
            const $floatLeftController = document.createElement('img');
            const $floatRightController = document.createElement('img');
            const $rotateLeftController = document.createElement('img');
            const $rotateRightController = document.createElement('img');
            const $rotate15Left = document.createElement('img');
            const $rotate15Right = document.createElement('img');
            const $rotateSlider = document.createElement('input');

            /**
             * Mouse over effect
             * @param {Event} e - Mouse event
             */
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const controllerMouseOver = (e: any) => {
               e.target.style.opacity = '0.3';
            };

            /**
             * Mouse out effect
             * @param {Event} e - Mouse event
             */
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const controllerMouseOut = (e: any) => {
               e.target.style.opacity = '1';
            };

            // Panel style settings - width increased (for float buttons)
            $positionController.setAttribute(
               'style',
               'position: absolute; top: 0; left: 50%; width: 340px; height: 35px; z-index: 999; ' +
                  'background-color: rgba(255, 255, 255, 0.9); border-radius: 6px; border: 2px solid #6C6C6C; ' +
                  'transform: translateX(-50%); display: flex; justify-content: space-around; align-items: center; padding: 0 8px; ' +
                  'box-shadow: 0 2px 8px rgba(0,0,0,0.15);'
            );

            // Alignment icons
            $leftController.setAttribute(
               'src',
               'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_left/default/20px.svg'
            );
            $leftController.title = 'Align left';

            $centerController.setAttribute(
               'src',
               'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_center/default/20px.svg'
            );
            $centerController.title = 'Center align';

            $rightController.setAttribute(
               'src',
               'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/format_align_right/default/20px.svg'
            );
            $rightController.title = 'Align right';

            // Float icons (inline feature)
            $floatLeftController.setAttribute(
               'src',
               'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="6" height="6" rx="1"/><path d="M10 4h10"/><path d="M10 8h6"/><rect x="2" y="11" width="6" height="6" rx="1"/><path d="M10 12h10"/><path d="M10 16h6"/></svg>'
            );
            $floatLeftController.title = 'Float left - text will flow on the right';

            $floatRightController.setAttribute(
               'src',
               'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="16" y="3" width="6" height="6" rx="1"/><path d="M2 4h10"/><path d="M8 8h6"/><rect x="16" y="11" width="6" height="6" rx="1"/><path d="M2 12h10"/><path d="M8 16h6"/></svg>'
            );
            $floatRightController.title = 'Float right - text will flow on the left';

            [
               $leftController,
               $centerController,
               $rightController,
               $floatLeftController,
               $floatRightController,
            ].forEach(($btn) => {
               $btn.setAttribute('style', iconStyle + ' opacity: 0.8; transition: opacity 0.2s;');
               $btn.addEventListener('mouseover', controllerMouseOver);
               $btn.addEventListener('mouseout', controllerMouseOut);
            });

            // Alignment event listeners (updated - including wrapper cleanup)
            $leftController.addEventListener('click', () => {
               // Clear wrapper float
               $wrapper.style.float = 'none';
               $wrapper.style.margin = '0';
               $wrapper.style.display = 'flex';

               // Normal alignment
               $img.style.float = 'none';
               $img.style.margin = '0 auto 0 0';
               $img.style.display = 'block';
               dispatchNodeView();
            });

            $centerController.addEventListener('click', () => {
               // Clear wrapper float
               $wrapper.style.float = 'none';
               $wrapper.style.margin = '0';
               $wrapper.style.display = 'flex';

               // Normal alignment
               $img.style.float = 'none';
               $img.style.margin = '0 auto';
               $img.style.display = 'block';
               dispatchNodeView();
            });

            $rightController.addEventListener('click', () => {
               // Clear wrapper float
               $wrapper.style.float = 'none';
               $wrapper.style.margin = '0';
               $wrapper.style.display = 'flex';

               // Normal alignment
               $img.style.float = 'none';
               $img.style.margin = '0 0 0 auto';
               $img.style.display = 'block';
               dispatchNodeView();
            });

            // Float event listeners (FIX - apply to wrapper)
            $floatLeftController.addEventListener('click', () => {
               // Apply float to wrapper
               $wrapper.style.float = 'left';
               $wrapper.style.margin = '0 15px 10px 0'; // Right and bottom margin
               $wrapper.style.width = 'auto';
               $wrapper.style.display = 'block';

               // Reset container and img
               $container.style.margin = '0';
               $img.style.margin = '0';
               $img.style.float = 'none';
               $img.style.display = 'block';
               dispatchNodeView();
            });

            $floatRightController.addEventListener('click', () => {
               // Apply float to wrapper
               $wrapper.style.float = 'right';
               $wrapper.style.margin = '0 0 10px 15px'; // Left and bottom margin
               $wrapper.style.width = 'auto';
               $wrapper.style.display = 'block';

               // Reset container and img
               $container.style.margin = '0';
               $img.style.margin = '0';
               $img.style.float = 'none';
               $img.style.display = 'block';
               dispatchNodeView();
            });

            // 90° rotation icons
            $rotateLeftController.setAttribute(
               'src',
               'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/rotate_left/default/20px.svg'
            );
            $rotateLeftController.title = 'Rotate 90° left';

            $rotateRightController.setAttribute(
               'src',
               'https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/rotate_right/default/20px.svg'
            );
            $rotateRightController.title = 'Rotate 90° right';

            // 15° rotation icons (as SVG)
            $rotate15Left.setAttribute(
               'src',
               'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7.11 8.53L5.7 7.11C4.8 8.27 4.24 9.61 4.07 11h2.02c.14-.87.49-1.72 1.02-2.47z"/><text x="12" y="16" font-size="8" text-anchor="middle">15°</text></svg>'
            );
            $rotate15Left.title = 'Rotate 15° left';

            $rotate15Right.setAttribute(
               'src',
               'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16.89 15.47l1.41 1.42C19.2 15.73 19.76 14.39 19.93 13h-2.02c-.14.87-.49 1.72-1.02 2.47z"/><text x="12" y="16" font-size="8" text-anchor="middle">15°</text></svg>'
            );
            $rotate15Right.title = 'Rotate 15° right';

            [$rotateLeftController, $rotateRightController, $rotate15Left, $rotate15Right].forEach(
               ($btn) => {
                  $btn.setAttribute(
                     'style',
                     iconStyle + ' opacity: 0.8; transition: opacity 0.2s;'
                  );
                  $btn.addEventListener('mouseover', controllerMouseOver);
                  $btn.addEventListener('mouseout', controllerMouseOut);
               }
            );

            // Rotation event listeners
            $rotateLeftController.addEventListener('click', () => rotateImage(-90));
            $rotateRightController.addEventListener('click', () => rotateImage(90));
            $rotate15Left.addEventListener('click', () => rotateImage(-15));
            $rotate15Right.addEventListener('click', () => rotateImage(15));

            // Rotation slider
            $rotateSlider.type = 'range';
            $rotateSlider.min = '0';
            $rotateSlider.max = '360';
            $rotateSlider.value = parseCurrentRotation().toString();
            $rotateSlider.style.cssText = 'width: 60px; height: 20px; cursor: pointer;';
            $rotateSlider.title = 'Free rotation (0-360°)';

            $rotateSlider.addEventListener('input', (e) => {
               const value = parseInt((e.target as HTMLInputElement).value);
               const otherTransforms = $img.style.transform.replace(/rotate\([^)]*\)/, '').trim();
               $img.style.transform = `${otherTransforms} rotate(${value}deg)`.trim();
               dispatchNodeView();
            });

            // Add controls to panel (including float buttons)
            $positionController.append(
               $leftController,
               $centerController,
               $rightController,
               $floatLeftController,
               $floatRightController,
               $rotate15Left,
               $rotateLeftController,
               $rotateRightController,
               $rotate15Right,
               $rotateSlider
            );
            $container.appendChild($positionController);
         };

         /**
          * Adds drag rotation handle
          * @function addRotationHandle
          * @description Adds drag rotation handle on top of image
          */
         const addRotationHandle = () => {
            const $rotateHandle = document.createElement('div');
            $rotateHandle.setAttribute(
               'style',
               'position: absolute; top: -35px; left: 50%; width: 24px; height: 24px; ' +
                  'background: linear-gradient(45deg, #007acc, #0056b3); border: 2px solid white; ' +
                  'border-radius: 50%; cursor: grab; transform: translateX(-50%); ' +
                  'box-shadow: 0 2px 6px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;'
            );
            $rotateHandle.innerHTML = '↻';
            $rotateHandle.style.color = 'white';
            $rotateHandle.style.fontSize = '14px';
            $rotateHandle.style.fontWeight = 'bold';
            $rotateHandle.title = 'Drag to rotate';

            let isDragging = false;
            let startAngle = 0;
            let initialRotation = 0;

            $rotateHandle.addEventListener('mousedown', (e) => {
               e.preventDefault();
               isDragging = true;
               $rotateHandle.style.cursor = 'grabbing';

               const rect = $container.getBoundingClientRect();
               const centerX = rect.left + rect.width / 2;
               const centerY = rect.top + rect.height / 2;
               startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
               initialRotation = parseCurrentRotation();

               const onMouseMove = (eMove: MouseEvent) => {
                  if (!isDragging) return;
                  const currentAngle = Math.atan2(eMove.clientY - centerY, eMove.clientX - centerX);
                  const angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
                  const newRotation = initialRotation + angleDiff;

                  const otherTransforms = $img.style.transform
                     .replace(/rotate\([^)]*\)/, '')
                     .trim();
                  $img.style.transform = `${otherTransforms} rotate(${newRotation}deg)`.trim();
               };

               const onMouseUp = () => {
                  if (!isDragging) return;
                  isDragging = false;
                  $rotateHandle.style.cursor = 'grab';
                  dispatchNodeView();
                  document.removeEventListener('mousemove', onMouseMove);
                  document.removeEventListener('mouseup', onMouseUp);
               };

               document.addEventListener('mousemove', onMouseMove);
               document.addEventListener('mouseup', onMouseUp);
            });

            $container.appendChild($rotateHandle);
         };

         // Wrapper and visual setup
         $wrapper.setAttribute('style', wrapperStyle || 'display: flex;');
         $container.setAttribute('style', style);
         Object.entries(node.attrs).forEach(([key, value]) => {
            if (value != null && key !== 'wrapperStyle') {
               $img.setAttribute(key, value as string);
            }
         });
         $container.appendChild($img);
         $wrapper.appendChild($container);

         // If not editable, just return the visual
         if (!editable) return { dom: $wrapper };

         // Add control panel and resize points on click
         let isResizing = false;
         let startX: number;
         let startWidth: number;

         $container.addEventListener('click', (e) => {
            e.stopPropagation();

            // Clear existing controls
            while ($container.childElementCount > 1) {
               $container.removeChild($container.lastChild as Node);
            }

            // Draw control panel
            paintPositionController();
            addRotationHandle();

            $container.setAttribute(
               'style',
               `position: relative; border: 2px dashed #007acc; ${style} cursor: pointer; border-radius: 4px;`
            );

            // Resize points
            const dots = ['nw', 'ne', 'sw', 'se'] as const;
            dots.forEach((pos) => {
               const $dot = document.createElement('div');
               const size = document.documentElement.clientWidth < 768 ? 18 : 12;
               const dotStyle =
                  `position: absolute; width: ${size}px; height: ${size}px; ` +
                  `background: #007acc; border: 2px solid white; border-radius: 50%; ` +
                  `box-shadow: 0 2px 4px rgba(0,0,0,0.2); ` +
                  (pos === 'nw'
                     ? `top: -${size / 2}px; left: -${size / 2}px; cursor: nwse-resize;`
                     : pos === 'ne'
                     ? `top: -${size / 2}px; right: -${size / 2}px; cursor: nesw-resize;`
                     : pos === 'sw'
                     ? `bottom: -${size / 2}px; left: -${size / 2}px; cursor: nesw-resize;`
                     : `bottom: -${size / 2}px; right: -${size / 2}px; cursor: nwse-resize;`);
               $dot.setAttribute('style', dotStyle);

               $dot.addEventListener('mousedown', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  isResizing = true;
                  startX = e.clientX;
                  startWidth = $container.offsetWidth;

                  const onMouseMove = (eMove: MouseEvent) => {
                     if (!isResizing) return;
                     const delta = ['nw', 'sw'].includes(pos)
                        ? startWidth - (eMove.clientX - startX)
                        : startWidth + (eMove.clientX - startX);
                     const newWidth = Math.max(50, Math.min(1200, delta)); // Min 50px, max 1200px
                     $container.style.width = `${newWidth}px`;
                     $img.style.width = `${newWidth}px`;
                  };

                  const onMouseUp = () => {
                     if (isResizing) {
                        isResizing = false;
                        dispatchNodeView();
                     }
                     document.removeEventListener('mousemove', onMouseMove);
                     document.removeEventListener('mouseup', onMouseUp);
                  };

                  document.addEventListener('mousemove', onMouseMove);
                  document.addEventListener('mouseup', onMouseUp);
               });
               $container.appendChild($dot);
            });
         });

         // Close panel on page clicks
         const closeControls = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!$container.contains(target)) {
               $container.setAttribute('style', style);
               while ($container.childElementCount > 1) {
                  $container.removeChild($container.lastChild as Node);
               }
            }
         };

         document.addEventListener('click', closeControls);

         // Cleanup function
         const cleanup = () => {
            document.removeEventListener('click', closeControls);
         };

         return {
            dom: $wrapper,
            destroy: cleanup,
         };
      };
   },
});