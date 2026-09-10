import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Carrega primeiro o .env da raiz do projeto e, se existir, permite override local em server/.env.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });
const { Pool } = pg;
const app = express();
const PORT = Number(process.env.PORT || 3001);
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://sql_student:sql_student_password@localhost:5432/sql_mastery';
const RESET_SQL_PATH = process.env.RESET_SQL_PATH || path.resolve(__dirname, '../../db/init/01_lab.sql');

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  statement_timeout: 15000,
  query_timeout: 17000,
});

app.use(cors({ origin: true }));
app.use(express.json({ limit: '200kb' }));

function normalizeResult(result) {
  const last = Array.isArray(result) ? result[result.length - 1] : result;
  if (!last) return { command: 'OK', rowCount: 0, fields: [], rows: [] };
  return {
    command: last.command || 'OK',
    rowCount: last.rowCount ?? last.rows?.length ?? 0,
    fields: (last.fields || []).map((f) => ({ name: f.name, dataTypeID: f.dataTypeID })),
    rows: last.rows || [],
  };
}

app.get('/api/health', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT current_database() AS database, version() AS version, now() AS now');
    res.json({ ok: true, ...rows[0] });
  } catch (error) {
    res.status(503).json({ ok: false, error: error.message });
  }
});

app.get('/api/schema', async (_req, res) => {
  try {
    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    const columns = await pool.query(`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);
    const counts = {};
    for (const { table_name } of tables.rows) {
      const safeName = '"' + table_name.replaceAll('"', '""') + '"';
      const result = await pool.query(`SELECT count(*)::int AS count FROM ${safeName}`);
      counts[table_name] = result.rows[0].count;
    }
    const grouped = tables.rows.map(({ table_name }) => ({
      name: table_name,
      count: counts[table_name],
      columns: columns.rows.filter((c) => c.table_name === table_name),
    }));
    res.json({ tables: grouped });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/query', async (req, res) => {
  const sql = String(req.body?.sql || '').trim();
  if (!sql) return res.status(400).json({ error: 'Digite uma consulta SQL.' });
  if (sql.length > 50000) return res.status(413).json({ error: 'SQL muito grande para o laboratório.' });

  const started = performance.now();
  try {
    const result = await pool.query(sql);
    res.json({ ...normalizeResult(result), executionTimeMs: Number((performance.now() - started).toFixed(2)) });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      position: error.position,
      executionTimeMs: Number((performance.now() - started).toFixed(2)),
    });
  }
});

app.post('/api/reset', async (_req, res) => {
  try {
    const sql = await fs.readFile(RESET_SQL_PATH, 'utf8');
    const client = await pool.connect();
    try {
      await client.query('SELECT pg_advisory_lock(84173421)');
      await client.query(sql);
      await client.query('SELECT pg_advisory_unlock(84173421)');
    } finally {
      client.release();
    }
    res.json({ ok: true, message: 'Banco restaurado para o estado inicial.' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`SQL Mastery API em http://localhost:${PORT}`);
});
