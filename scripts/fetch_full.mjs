// 抓取力扣中文站 100 题的完整题面（translatedContent，HTML），生成 data/full.js
import fs from 'fs';
import path from 'path';

const root = process.cwd(); // 从项目根目录运行

// 从数据文件提取题号
const ids = new Set();
for (const f of ['data1.js', 'data2.js', 'data3.js', 'data4.js', 'data5.js']) {
  const src = fs.readFileSync(path.join(root, 'data', f), 'utf8');
  for (const m of src.matchAll(/^\s*lc:\s*(\d+),/gm)) ids.add(Number(m[1]));
}
console.log('题目数:', ids.size);

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

const out = {};
const failed = [];
for (const id of [...ids].sort((a, b) => a - b)) {
  const slug = slugMap[String(id)];
  if (!slug) { failed.push(id + '(无slug)'); continue; }
  let content = null;
  for (let attempt = 1; attempt <= 3 && !content; attempt++) {
    try {
      content = await fetchOne(slug);
    } catch (e) {
      if (attempt === 3) console.error('LC' + id, slug, '失败:', e.message);
      await new Promise(r => setTimeout(r, 800 * attempt));
    }
  }
  if (content) {
    out[id] = content;
    console.log('ok LC' + id, slug, content.length + 'B');
  } else {
    failed.push(id);
  }
  await new Promise(r => setTimeout(r, 250));
}

fs.writeFileSync(path.join(root, 'data', 'full.js'),
  'window.HOT100_FULL = ' + JSON.stringify(out) + ';\n');
console.log('完成:', Object.keys(out).length, '/', ids.size, failed.length ? ' 失败: ' + failed.join(',') : '');
