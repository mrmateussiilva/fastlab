import fs from 'fs';
import path from 'path';
import { FESTA_TEMPLATES, FestaTemplate } from './templates';
import { getRedis } from './rate-limit';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const FILE_PATH = path.join(DATA_DIR, 'templates.json');
const TMP_FILE_PATH = path.join('/tmp', 'festalab_templates.json');
const REDIS_KEY = 'festalab:custom_templates';

// Cache em memória persistido durante o ciclo de vida da instância do servidor
let memoryTemplatesCache: FestaTemplate[] | null = null;

/**
 * Lê os templates atuais com fallback em cascata:
 * 1. Cache em memória (mais rápido)
 * 2. Redis (em produção / Vercel com Upstash)
 * 3. Arquivo em /tmp (para lambdas serverless)
 * 4. Arquivo local src/data/templates.json (em desenvolvimento local)
 * 5. FESTA_TEMPLATES estático de src/lib/templates.ts
 */
export async function getTemplates(): Promise<FestaTemplate[]> {
  // 1. Tentar ler do Cache em memória se já houver alterações registradas
  if (memoryTemplatesCache && memoryTemplatesCache.length > 0) {
    const missingOfficial = FESTA_TEMPLATES.filter((f) => !memoryTemplatesCache!.some((p: FestaTemplate) => p.id === f.id));
    return missingOfficial.length > 0 ? [...memoryTemplatesCache, ...missingOfficial] : memoryTemplatesCache;
  }

  // 2. Tentar ler do Redis
  try {
    const redis = getRedis();
    if (redis) {
      const data = await redis.get<FestaTemplate[] | string>(REDIS_KEY);
      if (data) {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasNewTemplates = parsed.some((t: FestaTemplate) => t.id === 'mickey-disney');
          if (!hasNewTemplates) {
            console.log('[TemplatesStore] Atualizando cache do Redis com os 21 novos temas oficiais...');
            await redis.set(REDIS_KEY, JSON.stringify(FESTA_TEMPLATES));
            memoryTemplatesCache = FESTA_TEMPLATES;
            return FESTA_TEMPLATES;
          }
          const missingOfficial = FESTA_TEMPLATES.filter((f) => !parsed.some((p: FestaTemplate) => p.id === f.id));
          const result = [...parsed, ...missingOfficial];
          memoryTemplatesCache = result;
          return result;
        }
      }
    }
  } catch (err) {
    console.warn('[TemplatesStore] Falha ao ler do Redis, tentando arquivos:', err);
  }

  // 3. Tentar ler de /tmp (serverless)
  try {
    if (fs.existsSync(TMP_FILE_PATH)) {
      const content = await fs.promises.readFile(TMP_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const missingOfficial = FESTA_TEMPLATES.filter((f) => !parsed.some((p: FestaTemplate) => p.id === f.id));
        const result = [...parsed, ...missingOfficial];
        memoryTemplatesCache = result;
        return result;
      }
    }
  } catch (err) {
    console.warn('[TemplatesStore] Falha ao ler de /tmp:', err);
  }

  // 4. Tentar ler do arquivo local src/data/templates.json
  try {
    if (fs.existsSync(FILE_PATH)) {
      const content = await fs.promises.readFile(FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const missingOfficial = FESTA_TEMPLATES.filter((f) => !parsed.some((p: FestaTemplate) => p.id === f.id));
        const result = [...parsed, ...missingOfficial];
        memoryTemplatesCache = result;
        return result;
      }
    }
  } catch (err) {
    console.warn('[TemplatesStore] Falha ao ler arquivo local:', err);
  }

  // 5. Fallback oficial direto
  memoryTemplatesCache = FESTA_TEMPLATES;
  return FESTA_TEMPLATES;
}

/**
 * Salva a lista completa de templates no cache em memória, Redis, /tmp e arquivo local
 */
export async function saveTemplates(templates: FestaTemplate[]): Promise<void> {
  // 1. Atualizar cache em memória imediatamente
  memoryTemplatesCache = [...templates];

  // 2. Salvar no Redis
  try {
    const redis = getRedis();
    if (redis) {
      await redis.set(REDIS_KEY, JSON.stringify(templates));
    }
  } catch (err) {
    console.error('[TemplatesStore] Erro ao salvar templates no Redis:', err);
  }

  // 3. Salvar em /tmp (sempre gravável em ambientes Linux/Vercel)
  try {
    await fs.promises.writeFile(TMP_FILE_PATH, JSON.stringify(templates, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[TemplatesStore] Não foi possível salvar em /tmp:', err);
  }

  // 4. Salvar localmente em arquivo se for gravável
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await fs.promises.mkdir(DATA_DIR, { recursive: true });
    }
    await fs.promises.writeFile(FILE_PATH, JSON.stringify(templates, null, 2), 'utf-8');
  } catch (err) {
    // Silencia em ambientes read-only como Vercel
    console.warn('[TemplatesStore] Arquivo local read-only, persistido em memória/Redis/tmp.');
  }
}

/**
 * Busca um template específico por ID
 */
export async function getTemplateById(id: string): Promise<FestaTemplate | null> {
  const all = await getTemplates();
  const found = all.find((t) => t.id === id);
  if (found) return found;

  // Fallback garantido para a lista estática oficial
  return FESTA_TEMPLATES.find((t) => t.id === id) || null;
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
