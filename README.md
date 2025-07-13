# Tiptap Editor

A modern, feature-rich rich text editor built with Tiptap and Next.js. This editor provides a comprehensive writing experience with AI integration, multi-language support, and extensive formatting capabilities.

## Features

-  🎨 **Rich Text Editing** - Full-featured WYSIWYG editor with modern UI
-  🤖 **AI Integration** - Context-aware AI assistance for content creation and editing
-  🌐 **Multi-language Support** - Built-in i18n support (Turkish, English, German, French, Spanish)
-  📷 **Media Support** - Image upload, URL embedding, gallery integration
-  📊 **Tables** - Advanced table creation and editing capabilities
-  🎬 **Embeds** - YouTube videos, Twitter/X posts integration
-  📤 **Import/Export** - DOCX, HTML, Markdown, JSON format support
-  ⌨️ **Keyboard Shortcuts** - Efficient editing with slash commands and shortcuts
-  📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Getting Started

### Prerequisites

-  Node.js 18+
-  npm, yarn, pnpm, or bun

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd tiptap-editor
```

2.Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3.Set up environment variables (see [Environment Variables](#environment-variables))

4.Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5.Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Image upload API endpoint
NEXT_PUBLIC_IMAGE_UPLOAD_API=

# File API endpoint for document operations
NEXT_PUBLIC_FILE_API=

# OpenAI API key for AI features
OPENAI_API_KEY=

# AI API endpoint
NEXT_PUBLIC_AI_API=
```

## Required Dependencies

### ShadCN UI Components

```bash
npx shadcn@latest init
npm install next-themes  # Optional for theme support
npx shadcn@latest add button
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add separator
npx shadcn@latest add dialog
npx shadcn@latest add drawer
npx shadcn@latest add alert-dialog
npx shadcn@latest add switch
npx shadcn@latest add scroll-area
npx shadcn@latest add command
npx shadcn@latest add textarea
npx shadcn@latest add tabs
```

### Core Dependencies

```bash
npm install --save clsx
npm install zod
npm install react-hook-form
npm install @hookform/resolvers
npm i sonner
npm i react-tweet
npm i lucide-react
npm install lowlight
npm i highlight.js
npm i use-debounce --save
npm i react-markdown
npm install ai@beta @ai-sdk/openai@beta @ai-sdk/react@beta
npm i ts-pattern
npm i @floating-ui/dom
npm i file-saver
npm i html-to-docx
npm i cheerio
npm i mammoth
```

### Tiptap Editor Extensions

```bash
npm i @tiptap/react@3.0.0-beta.21
npm i @tiptap/pm@beta@3.0.0-beta.21
npm i @tiptap/starter-kit@3.0.0-beta.21
npm i @tiptap/extension-youtube@3.0.0-beta.21
npm i @tiptap/extension-superscript@3.0.0-beta.21
npm i @tiptap/extension-subscript@3.0.0-beta.21
npm i @tiptap/extension-mathematics@3.0.0-beta.21 katex
npm i @tiptap/extension-code-block-lowlight@3.0.0-beta.21
npm i @tiptap/extension-drag-handle-react@3.0.0-beta.21
npm i @tiptap/extension-list@3.0.0-beta.21
npm i @tiptap/extension-text-align@3.0.0-beta.21
npm i @tiptap/extension-highlight@3.0.0-beta.21
npm i @tiptap/extension-text-style@3.0.0-beta.21
npm i @tiptap/extension-typography@3.0.0-beta.21
npm i @tiptap/extensions@3.0.0-beta.21
npm i @tiptap/extension-link@3.0.0-beta.21
npm i @tiptap/extension-image@3.0.0-beta.21
npm install @tiptap/suggestion@3.0.0-beta.21
npm install @tiptap/extension-table@3.0.0-beta.21
```

## Usage

### Basic Implementation

```tsx
import { Tiptap } from '@/components/tiptap-editor/tiptap';

function MyEditor() {
   const [content, setContent] = useState('');

   return (
      <Tiptap
         initialValue={content}
         onChange={setContent}
         showBubbleMenu={true}
         showImageUpload={true}
         showImageGallery={true}
         showImportData={true}
         showExportData={true}
      />
   );
}
```

### Configuration Options

```tsx
interface TiptapProps {
   initialValue?: string;
   onChange?: (value: string) => void;
   editable?: boolean;
   className?: string;
   showBubbleMenu?: boolean;
   showTableMenu?: boolean;
   showFooMenu?: boolean;
   showImageUrl?: boolean;
   showImageUpload?: boolean;
   showImageGallery?: boolean;
   showImportData?: boolean;
   showExportData?: boolean;
}
```

## AI Features

The editor includes advanced AI capabilities:

-  **Context Analysis** - Smart content understanding
-  **Quick Commands** - Text improvement, summarization, translation
-  **MCP Integration** - Model Context Protocol for enhanced AI interactions
-  **Multi-language AI** - AI assistance in multiple languages

## File Formats

### Import Support

-  DOCX files
-  HTML content
-  Markdown files
-  Plain text
-  JSON documents
-  Web page URLs

### Export Support

-  DOCX format
-  Clean HTML
-  Markdown
-  Plain text
-  JSON format

## Keyboard Shortcuts

-  `/` - Open slash command menu
-  `Ctrl/Cmd + B` - Bold text
-  `Ctrl/Cmd + I` - Italic text
-  `Ctrl/Cmd + U` - Underline text
-  `Ctrl/Cmd + Shift + S` - Strikethrough
-  `Ctrl/Cmd + E` - Inline code
-  And many more...

## Learn More

To learn more about the technologies used:

-  [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
-  [Tiptap Documentation](https://tiptap.dev/) - Comprehensive Tiptap guide
-  [ShadCN UI](https://ui.shadcn.com/) - Re-usable components built with Tailwind CSS
-  [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Other Platforms

The editor can be deployed on any platform that supports Next.js:

-  Netlify
-  AWS Amplify
-  Railway
-  DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
