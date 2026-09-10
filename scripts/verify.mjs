import fs from 'node:fs';
import path from 'node:path';
import { courseModules, sqlReference, schemaTables } from '../client/src/data/course.js';

const root = path.resolve(import.meta.dirname, '..');
const mustExist = [
  'client/index.html',
  'client/src/App.jsx',
  'client/src/styles.css',
  'client/src/data/course.js',
  'server/src/index.js',
  'db/init/01_lab.sql',
  'db/dbeaver/00_create_database.sql',
  'db/dbeaver/02_dbeaver_practice.sql',
  'docker-compose.yml',
  'README.md',
];

for (const file of mustExist) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Arquivo ausente: ${file}`);
}

const lessonIds = new Set();
const challengeIds = new Set();
let lessons = 0;
let challenges = 0;
for (const module of courseModules) {
  if (!module.id || !module.title || !module.lessons?.length) throw new Error(`Módulo inválido: ${module.id}`);
  for (const lesson of module.lessons) {
    lessons++;
    if (lessonIds.has(lesson.id)) throw new Error(`Aula duplicada: ${lesson.id}`);
    lessonIds.add(lesson.id);
    if (!lesson.theory?.length) throw new Error(`Aula sem teoria: ${lesson.id}`);
    for (const c of lesson.challenges || []) {
      challenges++;
      if (challengeIds.has(c.id)) throw new Error(`Desafio duplicado: ${c.id}`);
      challengeIds.add(c.id);
      if (!c.prompt || !c.hint || !c.solution || !c.explanation) throw new Error(`Desafio incompleto: ${c.id}`);
    }
  }
}

const sql = fs.readFileSync(path.join(root, 'db/init/01_lab.sql'), 'utf8');
for (const table of schemaTables) {
  if (!sql.includes(`CREATE TABLE ${table.name}`)) throw new Error(`Tabela não encontrada no SQL: ${table.name}`);
}

console.log('SQL Mastery Lab - verificação estrutural OK');
console.log(`Módulos: ${courseModules.length}`);
console.log(`Aulas: ${lessons}`);
console.log(`Desafios: ${challenges}`);
console.log(`Itens de referência SQL: ${sqlReference.length}`);
console.log(`Tabelas de estudo: ${schemaTables.length}`);
