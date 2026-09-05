import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';

// Reuse the exact application, equations and styles; only packaging changes.
const skyline = `data:image/webp;base64,${(await readFile('public/assets/financial-skyline.webp')).toString('base64')}`;
const result = await build({entryPoints:['src/offline.tsx'],bundle:true,write:false,format:'iife',minify:true,jsx:'automatic',define:{'process.env.NODE_ENV':'"production"','import.meta.env.BASE_URL':'"./"','import.meta.env.OFFLINE_SKYLINE':JSON.stringify(skyline)}});
let css='';
// Only include styles referenced by this build; stale hashed files may remain.
const index = await readFile('dist/index.html', 'utf8');
const styles = [...index.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)].map(match => match[1]);
if (!styles.length) throw new Error('No application stylesheet found in the built page.');
for (const href of styles) css += await readFile(resolve('dist/_astro', basename(href)), 'utf8');
const urls=[...new Set([...css.matchAll(/url\(([^)]+)\)/g)].map(m=>m[1].replace(/^["']|["']$/g,'')))];
for(const url of urls){
  if(url.startsWith('data:'))continue;
  const name=basename(url);const bytes=await readFile(resolve('dist/_astro',name));
  const mime=name.endsWith('.woff2')?'font/woff2':name.endsWith('.woff')?'font/woff':'font/ttf';
  css=css.split(url).join(`data:${mime};base64,${bytes.toString('base64')}`);
}
const js=result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script');
const html=`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#041426"><title>Fundamentos de los bonos</title><style>${css}</style><body><div id="app"></div><noscript>Activa JavaScript para recorrer esta presentación.</noscript><script>${js}</script></body></html>`;
await writeFile('dist/fundamentos-bonos.html',html);
console.log(`Standalone presentation: ${(Buffer.byteLength(html)/1024/1024).toFixed(2)} MB, all assets embedded.`);
