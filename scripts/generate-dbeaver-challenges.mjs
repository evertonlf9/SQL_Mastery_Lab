import fs from 'node:fs';
import path from 'node:path';
import { courseModules } from '../client/src/data/course.js';

const root = path.resolve(import.meta.dirname, '..');
const outFile = path.join(root, 'db/dbeaver/03_challenges_no_answers.sql');

const total = courseModules.reduce((sum, module) => (
  sum + module.lessons.reduce((lessonSum, lesson) => lessonSum + lesson.challenges.length, 0)
), 0);

const wrapComment = (text, width = 92) => {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines.map((item) => `-- ${item}`).join('\n');
};

const header = (title) => [
  '',
  '='.repeat(78),
  `-- ${title}`,
  '='.repeat(78),
  '',
].join('\n');

const challengeBlock = (lesson, challenge) => {
  const tables = challenge.tables?.length
    ? challenge.tables.join(', ')
    : 'nenhuma tabela; exercício conceitual';

  return [
    `-- ${challenge.id.toUpperCase()} | ${challenge.difficulty} | ${challenge.title}`,
    `-- Aula: ${lesson.title}`,
    `-- Tabelas: ${tables}`,
    wrapComment(challenge.prompt),
    '',
    '-- SUA SOLUÇÃO:',
    '',
    '',
  ].join('\n');
};

const body = courseModules.map((module) => {
  const blocks = module.lessons.flatMap((lesson) => (
    lesson.challenges.map((challenge) => challengeBlock(lesson, challenge))
  ));

  return [
    header(`MÓDULO ${module.number} - ${module.title.toUpperCase()}`),
    ...blocks,
  ].join('\n');
}).join('\n');

const content = [
  `-- SQL MASTERY LAB - ${total} DESAFIOS PARA RESOLVER NO DBEAVER`,
  '-- Este arquivo NÃO contém respostas. As soluções ficam escondidas na interface React.',
  '-- Cada desafio informa as tabelas/fontes que devem orientar a consulta.',
  '-- Recomendação: escreva sua solução abaixo de cada enunciado.',
  '-- Para desfazer experimentos, execute db/init/01_lab.sql novamente.',
  body.trimEnd(),
  '',
].join('\n');

fs.writeFileSync(outFile, content, 'utf8');
console.log(`Gerado ${path.relative(root, outFile)} com ${total} desafios.`);
