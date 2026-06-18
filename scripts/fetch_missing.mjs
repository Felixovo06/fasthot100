// 仅抓取新增 11 题的完整题面，合并进现有 data/full.js（不破坏已有 89 题）
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const NEW_IDS = [4, 23, 32, 41, 51, 72, 76, 84, 124, 239, 295];

// 读出现有 full.js（window.HOT100_FULL = {...};）
const fullPath = path.join(root, 'data', 'full.js');
const existing = JSON.parse(
  fs.readFileSync(fullPath, 'utf8').replace(/^window\.HOT100_FULL\s*=\s*/, '').replace(/;\s*$/, '')
);
console.log('现有题面:', Object.keys(existing).length, '条');

// 题号 → slug
const all = await (await fetch('https://leetcode.cn/api/problems/all/', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
})).json();
const slugMap = {};
for (const p of all.stat_status_pairs) {
  slugMap[String(p.stat.frontend_question_id)] = p.stat.question__title_slug;
}

const QUERY = `query questionData($titleSlug: String!) {
  question(titleSlug: $titleSlug) { questionFrontendId translatedTitle translatedContent }
}`;

async function fetchOne(slug) {
  const res = await fetch('https://leetcode.cn/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0',
      'Referer': 'https://leetcode.cn/problems/' + slug + '/'
    },
    body: JSON.stringify({ operationName: 'questionData', variables: { titleSlug: slug }, query: QUERY })
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const j = await res.json();
  return j.data && j.data.question && j.data.question.translatedContent;
}

const failed = [];
for (const id of NEW_IDS) {
  const slug = slugMap[String(id)];
  if (!slug) { failed.push(id + '(无slug)'); continue; }
  let content = null;
  for (let attempt = 1; attempt <= 3 && !content; attempt++) {
    try { content = await fetchOne(slug); }
    catch (e) {
      if (attempt === 3) console.error('LC' + id, slug, '失败:', e.message);
      await new Promise(r => setTimeout(r, 800 * attempt));
    }
  }
  if (content) { existing[id] = content; console.log('ok LC' + id, slug, content.length + 'B'); }
  else failed.push(id);
  await new Promise(r => setTimeout(r, 250));
}

fs.writeFileSync(fullPath, 'window.HOT100_FULL = ' + JSON.stringify(existing) + ';\n');
console.log('完成，总计:', Object.keys(existing).length, '条', failed.length ? ' 失败: ' + failed.join(',') : '');
