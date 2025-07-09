import { NextRequest, NextResponse } from 'next/server';

interface MCPResourceRequest {
   resource: string;
   arguments: Record<string, unknown>;
}

interface PackageJson {
   dependencies?: Record<string, string>;
   devDependencies?: Record<string, string>;
   name?: string;
   version?: string;
   scripts?: Record<string, string>;
}

interface WorkspaceConfig {
   'package.json'?: PackageJson;
   'tsconfig.json'?: Record<string, unknown>;
   'next.config.js'?: string;
}

interface Component {
   name: string;
   path: string;
   size: number;
}

interface RecentFile {
   path: string;
   modified: Date;
}

interface MCPResult {
   content: string;
   type: string;
}

export async function GET() {
   return NextResponse.json({
      resources: [
         'project_structure',
         'component_list', 
         'recent_files',
         'workspace_config',
         'git_status'
      ]
   });
}

export async function POST(request: NextRequest) {
   try {
      const { resource }: MCPResourceRequest = await request.json();

      let result: MCPResult;

      switch (resource) {
         case 'project_structure':
            result = await getProjectStructure();
            break;

         case 'component_list':
            result = await getComponentList();
            break;

         case 'recent_files':
            result = await getRecentFiles();
            break;

         case 'workspace_config':
            result = await getWorkspaceConfig();
            break;

         case 'git_status':
            result = await getGitStatus();
            break;

         default:
            return NextResponse.json({ error: `Unknown resource: ${resource}` }, { status: 400 });
      }

      return NextResponse.json(result);
   } catch {
      return NextResponse.json({ error: 'MCP resource access failed' }, { status: 500 });
   }
}

async function getProjectStructure(): Promise<MCPResult> {
   const fs = await import('fs/promises');
   const path = await import('path');

   try {
      const projectRoot = process.cwd();

      const buildStructure = async (dir: string, depth = 0): Promise<Record<string, unknown>> => {
         if (depth > 3) return {}; // Derinlik sınırı

         const items = await fs.readdir(dir, { withFileTypes: true });
         const result: Record<string, unknown> = {};

         for (const item of items) {
            if (item.name.startsWith('.') || item.name === 'node_modules') continue;

            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
               result[item.name] = await buildStructure(fullPath, depth + 1);
            } else {
               result[item.name] = 'file';
            }
         }

         return result;
      };

      const projectStructure = await buildStructure(projectRoot);

      return {
         content: `**Proje Yapısı:**\n\n${JSON.stringify(projectStructure, null, 2)}`,
         type: 'structure',
      };
   } catch {
      return {
         content: 'Proje yapısı okunamadı.',
         type: 'error',
      };
   }
}

async function getComponentList(): Promise<MCPResult> {
   const fs = await import('fs/promises');
   const path = await import('path');

   try {
      const components: Component[] = [];
      const componentsDir = path.join(process.cwd(), 'components');

      const findComponents = async (dir: string): Promise<void> => {
         const items = await fs.readdir(dir, { withFileTypes: true });

         for (const item of items) {
            const fullPath = path.join(dir, item.name);

            if (item.isDirectory()) {
               await findComponents(fullPath);
            } else if (item.name.endsWith('.tsx')) {
               const relativePath = fullPath.replace(process.cwd(), '');
               const content = await fs.readFile(fullPath, 'utf-8');

               // Component ismini çıkar
               const componentMatch = content.match(
                  /export\s+(?:default\s+)?(?:function|const)\s+(\w+)/
               );
               const componentName = componentMatch
                  ? componentMatch[1]
                  : item.name.replace('.tsx', '');

               components.push({
                  name: componentName,
                  path: relativePath,
                  size: content.length,
               });
            }
         }
      };

      await findComponents(componentsDir);

      return {
         content: `**Component Listesi:**

${components
   .map(
      (comp) =>
         `**${comp.name}**
   - Dosya: ${comp.path}
   - Boyut: ${comp.size} karakter`
   )
   .join('\n\n')}`,
         type: 'components',
      };
   } catch {
      return {
         content: 'Component listesi oluşturulamadı.',
         type: 'error',
      };
   }
}

async function getRecentFiles(): Promise<MCPResult> {
   const fs = await import('fs/promises');
   const path = await import('path');

   try {
      const recentFiles: RecentFile[] = [];
      const searchDir = async (dir: string): Promise<void> => {
         const items = await fs.readdir(dir, { withFileTypes: true });

         for (const item of items) {
            if (item.name.startsWith('.') || item.name === 'node_modules') continue;

            const fullPath = path.join(dir, item.name);

            if (item.isDirectory()) {
               await searchDir(fullPath);
            } else if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) {
               const stats = await fs.stat(fullPath);
               recentFiles.push({
                  path: fullPath.replace(process.cwd(), ''),
                  modified: stats.mtime,
               });
            }
         }
      };

      await searchDir(process.cwd());

      // Son değiştirilen dosyalar
      const sorted = recentFiles
         .sort((a, b) => b.modified.getTime() - a.modified.getTime())
         .slice(0, 10);

      return {
         content: `**Son Değiştirilen Dosyalar:**

${sorted
   .map(
      (file) =>
         `**${file.path}**
   - Değiştirilme: ${file.modified.toLocaleString('tr-TR')}`
   )
   .join('\n\n')}`,
         type: 'recent',
      };
   } catch {
      return {
         content: 'Son dosyalar listesi oluşturulamadı.',
         type: 'error',
      };
   }
}

async function getWorkspaceConfig(): Promise<MCPResult> {
   const fs = await import('fs/promises');

   try {
      const configs: Partial<WorkspaceConfig> = {};

      // package.json
      try {
         const packageJson = await fs.readFile('package.json', 'utf-8');
         configs['package.json'] = JSON.parse(packageJson) as PackageJson;
      } catch {}

      // tsconfig.json
      try {
         const tsConfig = await fs.readFile('tsconfig.json', 'utf-8');
         configs['tsconfig.json'] = JSON.parse(tsConfig) as Record<string, unknown>;
      } catch {}

      // next.config.js
      try {
         await fs.readFile('next.config.js', 'utf-8');
         configs['next.config.js'] = 'Found';
      } catch {}

      return {
         content: `**Workspace Konfigürasyonu:**

${Object.keys(configs)
   .map((key) => `**${key}:** ${key === 'next.config.js' ? 'Mevcut' : 'Yapılandırılmış'}`)
   .join('\n')}

**Detaylar:**
- Next.js: ${
            configs['package.json']?.dependencies?.next
               ? 'v' + configs['package.json'].dependencies.next
               : 'Yok'
         }
- TypeScript: ${configs['tsconfig.json'] ? 'Aktif' : 'Yok'}
- Tailwind: ${configs['package.json']?.dependencies?.tailwindcss ? 'Aktif' : 'Yok'}`,
         type: 'config',
      };
   } catch {
      return {
         content: 'Workspace konfigürasyonu okunamadı.',
         type: 'error',
      };
   }
}

async function getGitStatus(): Promise<MCPResult> {
   const { exec } = await import('child_process');
   const { promisify } = await import('util');
   const execAsync = promisify(exec);

   try {
      const { stdout } = await execAsync('git status --porcelain');
      const changes = stdout
         .trim()
         .split('\n')
         .filter((line) => line);

      if (changes.length === 0) {
         return {
            content: '**Git Durumu:** Temiz - hiç değişiklik yok.',
            type: 'git',
         };
      }

      const modified = changes.filter((line) => line.startsWith(' M')).length;
      const added = changes.filter((line) => line.startsWith('A')).length;
      const deleted = changes.filter((line) => line.startsWith(' D')).length;
      const untracked = changes.filter((line) => line.startsWith('??')).length;

      return {
         content: `**Git Durumu:**

**Değiştirilen:** ${modified} dosya
**Eklenen:** ${added} dosya  
**Silinen:** ${deleted} dosya
**İzlenmeyen:** ${untracked} dosya

**Son Değişiklikler:**
${changes
   .slice(0, 5)
   .map((line) => `- ${line.trim()}`)
   .join('\n')}`,
         type: 'git',
      };
   } catch {
      return {
         content: 'Git durumu alınamadı. Bu bir git deposu olmayabilir.',
         type: 'error',
      };
   }
}
