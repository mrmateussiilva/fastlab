import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  console.error('Defina UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN no ambiente.');
  process.exit(1);
}

const redis = new Redis({ url, token });

const ids = await redis.zrange('festalab:leads:index', 0, -1);

console.log('whatsapp,email,created_at');

let exported = 0;
for (const id of ids) {
  const lead = await redis.hgetall(`festalab:lead:${id}`);
  if (!lead || !lead.whatsapp) continue;
  const email = String(lead.email || '').replace(/,/g, ';');
  const createdAt = String(lead.createdAt || '');
  console.log(`${lead.whatsapp},${email},${createdAt}`);
  exported++;
}

console.error(`${exported} lead(s) exportado(s) para stdout.`);
