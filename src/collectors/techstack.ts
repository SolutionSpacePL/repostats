import * as fs from 'fs';
import * as path from 'path';
import { DetectedTech } from '../types';

interface DetectionRule {
  file: string;
  contentMatch?: string;
  tech: string;
  category: DetectedTech['category'];
}

const rules: DetectionRule[] = [
  // Languages (detected via manifest files, not extensions)
  { file: 'go.mod', tech: 'Go', category: 'language' },
  { file: 'Cargo.toml', tech: 'Rust', category: 'language' },
  { file: 'mix.exs', tech: 'Elixir', category: 'language' },
  { file: 'build.gradle', tech: 'Java/Kotlin', category: 'language' },
  { file: 'pom.xml', tech: 'Java', category: 'language' },
  { file: 'Gemfile', tech: 'Ruby', category: 'language' },
  { file: 'composer.json', tech: 'PHP', category: 'language' },

  // JS/TS Frameworks
  { file: 'package.json', contentMatch: '"react"', tech: 'React', category: 'framework' },
  { file: 'package.json', contentMatch: '"next"', tech: 'Next.js', category: 'framework' },
  { file: 'package.json', contentMatch: '"vue"', tech: 'Vue', category: 'framework' },
  { file: 'package.json', contentMatch: '"nuxt"', tech: 'Nuxt', category: 'framework' },
  { file: 'package.json', contentMatch: '"svelte"', tech: 'Svelte', category: 'framework' },
  { file: 'package.json', contentMatch: '"angular"', tech: 'Angular', category: 'framework' },
  { file: 'package.json', contentMatch: '"express"', tech: 'Express', category: 'framework' },
  { file: 'package.json', contentMatch: '"fastify"', tech: 'Fastify', category: 'framework' },
  { file: 'package.json', contentMatch: '"nestjs"', tech: 'NestJS', category: 'framework' },
  { file: 'package.json', contentMatch: '"hono"', tech: 'Hono', category: 'framework' },
  { file: 'package.json', contentMatch: '"astro"', tech: 'Astro', category: 'framework' },
  { file: 'package.json', contentMatch: '"remix"', tech: 'Remix', category: 'framework' },
  { file: 'package.json', contentMatch: '"electron"', tech: 'Electron', category: 'framework' },
  { file: 'package.json', contentMatch: '"tailwindcss"', tech: 'Tailwind CSS', category: 'framework' },

  // Python frameworks
  { file: 'requirements.txt', contentMatch: 'django', tech: 'Django', category: 'framework' },
  { file: 'requirements.txt', contentMatch: 'flask', tech: 'Flask', category: 'framework' },
  { file: 'requirements.txt', contentMatch: 'fastapi', tech: 'FastAPI', category: 'framework' },
  { file: 'pyproject.toml', contentMatch: 'django', tech: 'Django', category: 'framework' },
  { file: 'pyproject.toml', contentMatch: 'fastapi', tech: 'FastAPI', category: 'framework' },

  // Ruby frameworks
  { file: 'Gemfile', contentMatch: 'rails', tech: 'Rails', category: 'framework' },

  // Databases
  { file: 'package.json', contentMatch: '"prisma"', tech: 'Prisma', category: 'database' },
  { file: 'package.json', contentMatch: '"mongoose"', tech: 'MongoDB', category: 'database' },
  { file: 'package.json', contentMatch: '"pg"', tech: 'PostgreSQL', category: 'database' },
  { file: 'package.json', contentMatch: '"mysql2"', tech: 'MySQL', category: 'database' },
  { file: 'package.json', contentMatch: '"redis"', tech: 'Redis', category: 'database' },
  { file: 'package.json', contentMatch: '"drizzle-orm"', tech: 'Drizzle', category: 'database' },
  { file: 'docker-compose.yml', contentMatch: 'postgres', tech: 'PostgreSQL', category: 'database' },
  { file: 'docker-compose.yml', contentMatch: 'mongo', tech: 'MongoDB', category: 'database' },
  { file: 'docker-compose.yml', contentMatch: 'redis', tech: 'Redis', category: 'database' },
  { file: 'docker-compose.yml', contentMatch: 'mysql', tech: 'MySQL', category: 'database' },

  // Infrastructure
  { file: 'Dockerfile', tech: 'Docker', category: 'infrastructure' },
  { file: 'docker-compose.yml', tech: 'Docker Compose', category: 'infrastructure' },
  { file: 'docker-compose.yaml', tech: 'Docker Compose', category: 'infrastructure' },
  { file: 'kubernetes.yml', tech: 'Kubernetes', category: 'infrastructure' },
  { file: 'k8s.yml', tech: 'Kubernetes', category: 'infrastructure' },
  { file: 'serverless.yml', tech: 'Serverless', category: 'infrastructure' },
  { file: 'vercel.json', tech: 'Vercel', category: 'infrastructure' },
  { file: 'netlify.toml', tech: 'Netlify', category: 'infrastructure' },
  { file: 'fly.toml', tech: 'Fly.io', category: 'infrastructure' },
  { file: 'render.yaml', tech: 'Render', category: 'infrastructure' },
  { file: 'railway.json', tech: 'Railway', category: 'infrastructure' },
  { file: 'wrangler.toml', tech: 'Cloudflare Workers', category: 'infrastructure' },

  // Terraform
  { file: 'main.tf', tech: 'Terraform', category: 'infrastructure' },
  { file: 'terraform.tfvars', tech: 'Terraform', category: 'infrastructure' },

  // CI/CD
  { file: '.github/workflows', tech: 'GitHub Actions', category: 'ci' },
  { file: '.gitlab-ci.yml', tech: 'GitLab CI', category: 'ci' },
  { file: 'Jenkinsfile', tech: 'Jenkins', category: 'ci' },
  { file: '.circleci/config.yml', tech: 'CircleCI', category: 'ci' },
  { file: '.travis.yml', tech: 'Travis CI', category: 'ci' },
  { file: 'bitbucket-pipelines.yml', tech: 'Bitbucket Pipelines', category: 'ci' },

  // Testing
  { file: 'package.json', contentMatch: '"jest"', tech: 'Jest', category: 'testing' },
  { file: 'package.json', contentMatch: '"vitest"', tech: 'Vitest', category: 'testing' },
  { file: 'package.json', contentMatch: '"mocha"', tech: 'Mocha', category: 'testing' },
  { file: 'package.json', contentMatch: '"cypress"', tech: 'Cypress', category: 'testing' },
  { file: 'package.json', contentMatch: '"playwright"', tech: 'Playwright', category: 'testing' },
  { file: 'pytest.ini', tech: 'Pytest', category: 'testing' },
  { file: 'pyproject.toml', contentMatch: 'pytest', tech: 'Pytest', category: 'testing' },

  // Tools
  { file: '.eslintrc.json', tech: 'ESLint', category: 'tool' },
  { file: '.eslintrc.js', tech: 'ESLint', category: 'tool' },
  { file: 'eslint.config.js', tech: 'ESLint', category: 'tool' },
  { file: '.prettierrc', tech: 'Prettier', category: 'tool' },
  { file: 'prettier.config.js', tech: 'Prettier', category: 'tool' },
  { file: 'tsconfig.json', tech: 'TypeScript', category: 'tool' },
  { file: 'webpack.config.js', tech: 'Webpack', category: 'tool' },
  { file: 'vite.config.ts', tech: 'Vite', category: 'tool' },
  { file: 'vite.config.js', tech: 'Vite', category: 'tool' },
  { file: 'rollup.config.js', tech: 'Rollup', category: 'tool' },
  { file: 'esbuild.config.js', tech: 'esbuild', category: 'tool' },
  { file: 'turbo.json', tech: 'Turborepo', category: 'tool' },
  { file: 'nx.json', tech: 'Nx', category: 'tool' },
  { file: 'lerna.json', tech: 'Lerna', category: 'tool' },
  { file: '.husky', tech: 'Husky', category: 'tool' },
  { file: 'biome.json', tech: 'Biome', category: 'tool' },
];

export async function collectTechStack(): Promise<DetectedTech[]> {
  const detected = new Map<string, DetectedTech>();
  const cwd = process.cwd();
  const fileContentCache = new Map<string, string>();

  for (const rule of rules) {
    if (detected.has(rule.tech)) continue;

    const filePath = path.join(cwd, rule.file);

    // Check if file/directory exists
    try {
      const stat = await fs.promises.stat(filePath);

      if (stat.isDirectory()) {
        detected.set(rule.tech, { name: rule.tech, category: rule.category });
        continue;
      }

      if (!rule.contentMatch) {
        detected.set(rule.tech, { name: rule.tech, category: rule.category });
        continue;
      }

      // Read file content (cached)
      let content = fileContentCache.get(filePath);
      if (content === undefined) {
        content = await fs.promises.readFile(filePath, 'utf-8');
        fileContentCache.set(filePath, content);
      }

      if (content.toLowerCase().includes(rule.contentMatch.toLowerCase())) {
        detected.set(rule.tech, { name: rule.tech, category: rule.category });
      }
    } catch {
      // File doesn't exist — skip
    }
  }

  return Array.from(detected.values());
}
