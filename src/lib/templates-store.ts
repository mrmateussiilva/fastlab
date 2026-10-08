import fs from 'fs';
import path from 'path';
import { FESTA_TEMPLATES, FestaTemplate } from './templates';
import { getRedis } from './rate-limit';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const FILE_PATH = path.join(DATA_DIR, 'templates.json');
const REDIS_KEY = 'festalab:custom_templates';

/**
 * Lê os templates atuais com fallback em cascata:
 * 1. Redis (em produção / Vercel)
 * 2. Arquivo local src/data/templates.json (em desenvolvimento local)
 * 3. FESTA_TEMPLATES estático de src/lib/templates.ts
 */
export async function getTemplates(): Promise<FestaTemplate[]> {
  // 1. Tentar ler do Redis
  try {
    const redis = getRedis();
    if (redis) {
      const data = await redis.get<FestaTemplate[] | string>(REDIS_KEY);
      if (data) {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('[TemplatesStore] Falha ao ler do Redis, tentando arquivo local:', err);
  }

  // 2. Tentar ler do arquivo local
  try {
    if (fs.existsSync(FILE_PATH)) {
      const content = await fs.promises.readFile(FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[TemplatesStore] Falha ao ler arquivo local:', err);
  }

  // 3. Fallback para os templates padrão em código
  return FESTA_TEMPLATES;
}

/**
 * Salva a lista completa de templates no Redis e no arquivo local
 */
export async function saveTemplates(templates: FestaTemplate[]): Promise<void> {
  // 1. Salvar no Redis
  try {
    const redis = getRedis();
    if (redis) {
      await redis.set(REDIS_KEY, JSON.stringify(templates));
    }
  } catch (err) {
    console.error('[TemplatesStore] Erro ao salvar templates no Redis:', err);
  }

  // 2. Salvar localmente em arquivo
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
    }
    await fs.promises.writeFile(FILE_PATH, JSON.stringify(templates, null, 2), 'utf-8');
  } catch (err) {
    console.error('[TemplatesStore] Erro ao salvar templates no arquivo local:', err);
  }
}

/**
 * Busca um template específico por ID
 */
export async function getTemplateById(id: string): Promise<FestaTemplate | null> {
  const all = await getTemplates();
  return all.find((t) => t.id === id) || null;
}

/**
 * Cria ou atualiza um template específico
 */
export async function upsertTemplate(template: FestaTemplate): Promise<FestaTemplate> {
  const all = await getTemplates();
  const index = all.findIndex((t) => t.id === template.id);

  let updatedList: FestaTemplate[];
  if (index >= 0) {
    updatedList = [...all];
    updatedList[index] = template;
  } else {
    updatedList = [template, ...all];
  }

  await saveTemplates(updatedList);
  return template;
}

/**
 * Exclui um template por ID
 */
export async function deleteTemplate(id: string): Promise<boolean> {
  const all = await getTemplates();
  const filtered = all.filter((t) => t.id !== id);
  if (filtered.length === all.length) return false;

  await saveTemplates(filtered);
  return true;
}

/**
 * Restaura os templates de fábrica
 */
export async function resetTemplates(): Promise<FestaTemplate[]> {
  await saveTemplates(FESTA_TEMPLATES);
  return FESTA_TEMPLATES;
}
