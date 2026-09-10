import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen, Check, ChevronDown, ChevronRight, Clipboard, Code2, Database,
  Eye, EyeOff, GraduationCap, LayoutDashboard, Play, RefreshCw, Search,
  Server, Sparkles, Table2, TerminalSquare, Trophy, X, Zap
} from 'lucide-react';
import { courseModules, schemaTables, sqlReference, studyPath } from './data/course.js';
import { sqlArenaCategories, sqlArenaChallenges, sqlArenaStats } from './data/sqlArenaChallenges.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

function CodeBlock({ children, compact = false }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(children || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className={cx('code-block', compact && 'compact')}>
      <div className="code-toolbar">
        <span>SQL</span>
        <button className="ghost icon-text" onClick={copy} title="Copiar SQL">
          {copied ? <Check size={15} /> : <Clipboard size={15} />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre><code>{children}</code></pre>
    </div>
  );
}

function Badge({ children, tone = 'default' }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function Sidebar({ view, setView, selectedModuleId, setSelectedModuleId, completed, search, setSearch }) {
  const totalLessons = courseModules.reduce((n, m) => n + m.lessons.length, 0);
  const progress = Math.round((completed.size / totalLessons) * 100);
  const nav = [
    ['dashboard', LayoutDashboard, 'Visão geral'],
    ['course', BookOpen, 'Curso completo'],
    ['arena', Trophy, 'SQL Arena'],
    ['schema', Database, 'Banco de estudo'],
    ['playground', TerminalSquare, 'Playground SQL'],
    ['reference', Code2, 'Referência SQL'],
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark"><Database size={23} /></div>
        <div><strong>SQL Mastery</strong><span>PostgreSQL Lab</span></div>
      </div>

      <div className="search-box">
        <Search size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar no curso e Arena..." />
        {search && <button onClick={() => setSearch('')}><X size={14} /></button>}
      </div>

      <nav className="primary-nav">
        {nav.map(([id, Icon, label]) => (
          <button key={id} className={cx(view === id && 'active')} onClick={() => setView(id)}>
            <Icon size={18} /> {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-progress">
        <div className="row between"><span>Seu progresso</span><strong>{progress}%</strong></div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        <small>{completed.size} de {totalLessons} aulas concluídas</small>
      </div>

      <div className="module-list">
        <div className="side-label">Módulos</div>
        {courseModules.map((m) => {
          const done = m.lessons.filter((l) => completed.has(l.id)).length;
          return (
            <button key={m.id} className={cx('module-mini', selectedModuleId === m.id && view === 'course' && 'active')}
              onClick={() => { setSelectedModuleId(m.id); setView('course'); }}>
              <span className="module-number">{m.number}</span>
              <span className="module-mini-copy"><b>{m.title}</b><small>{done}/{m.lessons.length} aulas</small></span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function Dashboard({ setView, setSelectedModuleId, completed, apiStatus }) {
  const totalLessons = courseModules.reduce((n, m) => n + m.lessons.length, 0);
  const totalChallenges = courseModules.reduce((n, m) => n + m.lessons.reduce((x, l) => x + l.challenges.length, 0), 0);
  const next = courseModules.flatMap((m) => m.lessons.map((l) => ({ ...l, module: m }))).find((l) => !completed.has(l.id));
  return (
    <div className="content-page dashboard-page">
      <section className="hero">
        <div>
          <Badge tone="accent"><Sparkles size={13} /> Do zero ao SQL avançado</Badge>
          <h1>Aprenda SQL praticando em um banco PostgreSQL real.</h1>
          <p>Teoria clara, exemplos executáveis, um único banco fictício, desafios progressivos e soluções escondidas para você tentar antes de conferir.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => { setSelectedModuleId(next?.module.id || 'm00'); setView('course'); }}><Play size={17} /> {next ? 'Continuar estudando' : 'Revisar o curso'}</button>
            <button className="secondary" onClick={() => setView('schema')}><Database size={17} /> Ver banco de estudo</button>
          </div>
        </div>
        <div className="hero-terminal">
          <div className="terminal-head"><span /><span /><span /><b>DBeaver / PostgreSQL</b></div>
          <pre><span className="kw">SELECT</span> c.name,
       <span className="fn">SUM</span>(v.total_amount) <span className="kw">AS</span> revenue
<span className="kw">FROM</span> customers c
<span className="kw">JOIN</span> vw_order_totals v
  <span className="kw">ON</span> v.customer_id = c.id
<span className="kw">GROUP BY</span> c.id
<span className="kw">ORDER BY</span> revenue <span className="kw">DESC</span>;</pre>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card"><BookOpen /><div><strong>{courseModules.length}</strong><span>módulos</span></div></div>
        <div className="stat-card"><GraduationCap /><div><strong>{totalLessons}</strong><span>aulas detalhadas</span></div></div>
        <div className="stat-card"><Trophy /><div><strong>{totalChallenges + sqlArenaStats.total}</strong><span>desafios no total</span></div></div>
        <div className="stat-card"><Server /><div><strong>{apiStatus.ok ? 'Online' : 'Opcional'}</strong><span>executor no navegador</span></div></div>
      </section>

      <section className="two-columns">
        <div className="panel">
          <div className="section-title"><div><span className="eyebrow">Rota recomendada</span><h2>Como estudar</h2></div><Zap size={22} /></div>
          <ol className="study-path">
            {studyPath.map((item, i) => <li key={item}><span>{i + 1}</span><p>{item}</p></li>)}
          </ol>
        </div>
        <div className="panel dbeaver-panel">
          <div className="section-title"><div><span className="eyebrow">Seu fluxo</span><h2>Prática no DBeaver</h2></div><Database size={22} /></div>
          <p>O projeto foi preparado para você usar o DBeaver como ferramenta principal de treino. A aplicação funciona como curso e guia; o DBeaver fica como seu editor SQL profissional.</p>
          <div className="steps-compact">
            <div><span>1</span><p>Execute <code>db/dbeaver/00_create_database.sql</code> conectado ao banco <b>postgres</b>.</p></div>
            <div><span>2</span><p>Abra uma conexão para <b>sql_mastery</b> e execute <code>db/init/01_lab.sql</code>.</p></div>
            <div><span>3</span><p>Use <code>db/dbeaver/02_dbeaver_practice.sql</code> como caderno inicial.</p></div>
            <div><span>4</span><p>Resolva cada desafio sem abrir a solução. Depois compare sua abordagem.</p></div>
          </div>
          <button className="secondary wide" onClick={() => setView('playground')}><TerminalSquare size={17} /> Ver playground opcional</button>
        </div>
      </section>

      <section className="module-cards-section">
        <div className="section-heading"><span className="eyebrow">Currículo completo</span><h2>Do primeiro SELECT ao SQL analítico</h2></div>
        <div className="module-cards">
          {courseModules.map((m) => {
            const done = m.lessons.every((l) => completed.has(l.id));
            return (
              <button key={m.id} className="module-card" onClick={() => { setSelectedModuleId(m.id); setView('course'); }}>
                <div className="module-card-top"><span>{m.number}</span>{done ? <Check size={18} /> : <ChevronRight size={18} />}</div>
                <Badge tone={m.level === 'Iniciante' ? 'green' : m.level === 'Intermediário' ? 'blue' : m.level === 'Especialista' ? 'purple' : 'orange'}>{m.level}</Badge>
                <h3>{m.title}</h3><p>{m.description}</p><small>{m.lessons.length} aulas</small>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ChallengeCard({ c }) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  return (
    <div className="challenge-card">
      <div className="challenge-head">
        <div><span className="challenge-id">{c.id.toUpperCase()}</span><h4>{c.title}</h4></div>
        <Badge tone={c.difficulty.includes('Avançado') || c.difficulty.includes('Especialista') ? 'orange' : c.difficulty.includes('Médio') ? 'blue' : 'green'}>{c.difficulty}</Badge>
      </div>
      <p>{c.prompt}</p>
      <div className="challenge-meta">
        <b>Tabelas usadas</b>
        <p>
          {c.tables?.length
            ? c.tables.map((t) => <code key={t}>{t}</code>)
            : <span>nenhuma tabela; exercício conceitual</span>}
        </p>
      </div>
      <div className="challenge-actions">
        <button className="ghost" onClick={() => setShowHint((v) => !v)}>{showHint ? <EyeOff size={15} /> : <Eye size={15} />}{showHint ? 'Esconder dica' : 'Mostrar dica'}</button>
        <button className={cx('solution-toggle', showSolution && 'open')} onClick={() => setShowSolution((v) => !v)}>
          {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
          {showSolution ? 'Ocultar resposta' : 'Revelar resposta'}
          <ChevronDown size={16} />
        </button>
      </div>
      {showHint && <div className="hint-box"><b>Dica:</b> {c.hint}</div>}
      {showSolution && (
        <div className="solution-box">
          <div className="solution-label"><Check size={16} /> Resposta de referência</div>
          <CodeBlock>{c.solution}</CodeBlock>
          <p><b>Por que funciona:</b> {c.explanation}</p>
          <small>Você não precisa escrever exatamente o mesmo SQL. Se sua consulta entrega o mesmo resultado de forma correta, ela pode ser uma solução válida.</small>
        </div>
      )}
    </div>
  );
}

function LessonCard({ lesson: l, completed, toggleCompleted }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={cx('lesson-card', completed && 'completed')}>
      <button className="lesson-header" onClick={() => setOpen((v) => !v)}>
        <div className="lesson-check">{completed ? <Check size={15} /> : <BookOpen size={15} />}</div>
        <div className="lesson-title"><span>{l.level}</span><h3>{l.title}</h3><p>{l.objective}</p></div>
        <ChevronDown className={cx('chevron', open && 'rotated')} />
      </button>
      {open && (
        <div className="lesson-body">
          <section><h4>O que você precisa entender</h4>{l.theory.map((p) => <p key={p}>{p}</p>)}</section>
          {l.syntax && <section><h4>Sintaxe-base</h4><CodeBlock>{l.syntax}</CodeBlock></section>}
          {l.examples.length > 0 && <section><h4>Exemplos comentados</h4>{l.examples.map((e) => <div className="example" key={e.title}><h5>{e.title}</h5><CodeBlock>{e.sql}</CodeBlock><p>{e.explanation}</p></div>)}</section>}
          {l.dbeaverTip && <div className="dbeaver-tip"><Database size={18} /><div><b>Dica de DBeaver</b><p>{l.dbeaverTip}</p></div></div>}
          {l.challenges.length > 0 && <section className="challenges"><div className="challenge-section-title"><Trophy size={19} /><div><h4>Desafios</h4><p>Tente resolver antes de revelar a resposta.</p></div></div>{l.challenges.map((c) => <ChallengeCard key={c.id} c={c} />)}</section>}
          <div className="lesson-footer"><button className={completed ? 'secondary' : 'primary'} onClick={() => toggleCompleted(l.id)}>{completed ? <><Check size={16} /> Aula concluída</> : <><Check size={16} /> Marcar como concluída</>}</button></div>
        </div>
      )}
    </article>
  );
}

function Course({ selectedModuleId, setSelectedModuleId, completed, toggleCompleted, search }) {
  const filteredModules = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courseModules;
    return courseModules.map((m) => ({
      ...m,
      lessons: m.lessons.filter((l) => [m.title, m.description, l.title, l.objective, ...l.theory, ...l.challenges.flatMap((c) => [c.title, c.prompt])].join(' ').toLowerCase().includes(q))
    })).filter((m) => m.lessons.length > 0 || m.title.toLowerCase().includes(q));
  }, [search]);

  const selected = filteredModules.find((m) => m.id === selectedModuleId) || filteredModules[0];
  useEffect(() => { if (selected && selected.id !== selectedModuleId) setSelectedModuleId(selected.id); }, [selected, selectedModuleId, setSelectedModuleId]);

  if (!selected) return <div className="content-page empty"><Search /><h2>Nenhuma aula encontrada</h2><p>Tente outra palavra na busca.</p></div>;
  const done = selected.lessons.filter((l) => completed.has(l.id)).length;
  return (
    <div className="content-page course-page">
      <div className="module-hero">
        <div className="module-index">{selected.number}</div>
        <div><div className="row gap"><Badge tone="accent">{selected.level}</Badge><span>{done}/{selected.lessons.length} concluídas</span></div><h1>{selected.title}</h1><p>{selected.description}</p></div>
      </div>
      {search && <div className="search-result-note"><Search size={15} /> Exibindo aulas compatíveis com “{search}”.</div>}
      <div className="lessons-list">{selected.lessons.map((l) => <LessonCard key={l.id} lesson={l} completed={completed.has(l.id)} toggleCompleted={toggleCompleted} />)}</div>
      <div className="module-pagination">
        {courseModules.findIndex((m) => m.id === selected.id) > 0 && <button className="secondary" onClick={() => setSelectedModuleId(courseModules[courseModules.findIndex((m) => m.id === selected.id) - 1].id)}>← Módulo anterior</button>}
        {courseModules.findIndex((m) => m.id === selected.id) < courseModules.length - 1 && <button className="primary" onClick={() => { setSelectedModuleId(courseModules[courseModules.findIndex((m) => m.id === selected.id) + 1].id); window.scrollTo(0, 0); }}>Próximo módulo →</button>}
      </div>
    </div>
  );
}


function ArenaChallengeCard({ c, solved, toggleSolved }) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const tone = c.difficulty === 'Difícil' ? 'orange' : c.difficulty === 'Médio' ? 'blue' : 'green';

  return (
    <article className={cx('arena-challenge', solved && 'solved')}>
      <div className="arena-challenge-top">
        <div className="arena-title-wrap">
          <span className="challenge-id">{c.id}</span>
          <h3>{c.title}</h3>
          <div className="arena-tags">
            <Badge tone={tone}>{c.difficulty}</Badge>
            <Badge>{c.category}</Badge>
          </div>
        </div>
        <button className={solved ? 'secondary arena-solved-btn' : 'ghost arena-solved-btn'} onClick={() => toggleSolved(c.id)}>
          <Check size={15} /> {solved ? 'Resolvido' : 'Marcar resolvido'}
        </button>
      </div>

      <p className="arena-prompt">{c.prompt}</p>

      <div className="arena-meta-grid">
        <div><b>Resultado esperado</b><p>{c.expected}</p></div>
        <div><b>Tabelas</b><p>{c.tables.map((t) => <code key={t}>{t}</code>)}</p></div>
      </div>

      {c.constraints.length > 0 && (
        <div className="arena-constraints">
          <b>Regras do desafio</b>
          <ul>{c.constraints.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      )}

      <div className="arena-concepts">
        {c.concepts.map((concept) => <span key={concept}>{concept}</span>)}
      </div>

      <div className="challenge-actions arena-actions">
        <button className="ghost" onClick={() => setShowHint((v) => !v)}>
          {showHint ? <EyeOff size={15} /> : <Eye size={15} />}
          {showHint ? 'Esconder dica' : 'Mostrar dica'}
        </button>
        <button className={cx('solution-toggle', showSolution && 'open')} onClick={() => setShowSolution((v) => !v)}>
          {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
          {showSolution ? 'Ocultar solução' : 'Revelar solução'}
          <ChevronDown size={16} />
        </button>
      </div>

      {showHint && <div className="hint-box"><b>Dica:</b> {c.hint}</div>}
      {showSolution && (
        <div className="solution-box">
          <div className="solution-label"><Check size={16} /> Solução de referência</div>
          <CodeBlock>{c.solution}</CodeBlock>
          <p><b>Por que funciona:</b> {c.explanation}</p>
          <small>Como no LeetCode, pode existir mais de uma solução correta. Compare resultado, legibilidade e custo da consulta.</small>
        </div>
      )}
    </article>
  );
}

function SqlArena({ search, solvedArena, toggleArenaSolved }) {
  const [difficulty, setDifficulty] = useState('Todas');
  const [category, setCategory] = useState('Todas');
  const [localSearch, setLocalSearch] = useState('');

  const q = (search || localSearch).trim().toLowerCase();
  const challenges = useMemo(() => sqlArenaChallenges.filter((c) => {
    const matchesDifficulty = difficulty === 'Todas' || c.difficulty === difficulty;
    const matchesCategory = category === 'Todas' || c.category === category;
    const haystack = [c.id, c.title, c.category, c.prompt, c.expected, ...c.concepts, ...c.tables].join(' ').toLowerCase();
    return matchesDifficulty && matchesCategory && (!q || haystack.includes(q));
  }), [difficulty, category, q]);

  const progress = Math.round((solvedArena.size / sqlArenaChallenges.length) * 100);

  return (
    <div className="content-page arena-page">
      <div className="page-heading arena-heading">
        <span className="eyebrow">Treino estilo coding challenge</span>
        <h1>SQL Arena</h1>
        <p>Problemas independentes para você resolver no DBeaver sem seguir a ordem das aulas. Tente chegar ao resultado primeiro; dica e solução ficam escondidas até você decidir abrir.</p>
      </div>

      <section className="arena-summary">
        <div><strong>{sqlArenaStats.total}</strong><span>problemas</span></div>
        <div><strong>{sqlArenaStats.easy}</strong><span>fáceis</span></div>
        <div><strong>{sqlArenaStats.medium}</strong><span>médios</span></div>
        <div><strong>{sqlArenaStats.hard}</strong><span>difíceis</span></div>
        <div className="arena-progress-card"><strong>{progress}%</strong><span>{solvedArena.size}/{sqlArenaChallenges.length} resolvidos</span><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
      </section>

      <section className="arena-toolbar panel">
        {!search && <div className="arena-search"><Search size={16} /><input value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} placeholder="Buscar problema, conceito ou tabela..." /></div>}
        <div className="arena-filters">
          <label>Dificuldade
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              {['Todas', 'Fácil', 'Médio', 'Difícil'].map((x) => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label>Categoria
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {['Todas', ...sqlArenaCategories].map((x) => <option key={x}>{x}</option>)}
            </select>
          </label>
        </div>
      </section>

      <div className="arena-list-head">
        <div><b>{challenges.length}</b> problemas encontrados</div>
        <span>Use <code>db/dbeaver/04_sql_arena_challenges.sql</code> para treinar sem respostas.</span>
      </div>

      <div className="arena-list">
        {challenges.map((c) => (
          <ArenaChallengeCard key={c.id} c={c} solved={solvedArena.has(c.id)} toggleSolved={toggleArenaSolved} />
        ))}
        {challenges.length === 0 && <div className="panel arena-empty"><Search /><h3>Nenhum desafio encontrado</h3><p>Altere os filtros ou a busca.</p></div>}
      </div>
    </div>
  );
}

function SchemaPage({ liveSchema }) {
  return (
    <div className="content-page">
      <div className="page-heading"><span className="eyebrow">Um único banco para todo o curso</span><h1>Banco <code>sql_mastery</code></h1><p>O domínio simula comércio, operação e atendimento para permitir exercícios realistas em diferentes níveis.</p></div>
      <div className="schema-note"><Database /><div><b>Como criar com DBeaver</b><p>Execute <code>db/dbeaver/00_create_database.sql</code> conectado ao banco padrão <code>postgres</code>. Depois conecte em <code>sql_mastery</code> e execute <code>db/init/01_lab.sql</code>. O script de carga é idempotente: ele recria os objetos de estudo.</p></div></div>
      <div className="schema-map">
        {schemaTables.map((t) => {
          const live = liveSchema?.tables?.find((x) => x.name === t.name);
          return (
            <div className="table-card" key={t.name}>
              <div className="table-card-head"><Table2 size={18} /><code>{t.name}</code>{live && <Badge tone="green">{live.count} linhas</Badge>}</div>
              <p>{t.purpose}</p><div className="pk">PK: <code>{t.key}</code></div>
              {t.relations.map((r) => <div className="relation" key={r}>↳ {r}</div>)}
              {live && <details><summary>Ver colunas ({live.columns.length})</summary><div className="column-list">{live.columns.map((c) => <div key={c.column_name}><code>{c.column_name}</code><span>{c.data_type}{c.is_nullable === 'NO' ? ' • not null' : ''}</span></div>)}</div></details>}
            </div>
          );
        })}
      </div>
      <div className="relationship-guide panel"><h2>Relações centrais</h2><CodeBlock>{`customers 1 ─── N orders 1 ─── N order_items N ─── 1 products\n                         │                         │\n                         1                         ├── N reviews\n                         │                         └── N inventory_movements\n                         1\n                      payments\n\nemployees 1 ─── N employees (manager_id)\nemployees 1 ─── N orders (salesperson_id)\nemployees 1 ─── N support_tickets (assigned_to)`}</CodeBlock></div>
    </div>
  );
}

function Playground({ apiStatus, refreshApi }) {
  const [sql, setSql] = useState(`SELECT\n  c.id,\n  c.name,\n  v.order_count,\n  v.lifetime_value\nFROM vw_customer_summary v\nJOIN customers c ON c.id = v.customer_id\nORDER BY v.lifetime_value DESC\nLIMIT 10;`);
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const run = async () => {
    setRunning(true); setResult(null);
    try {
      const r = await fetch(`${API_URL}/api/query`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sql }) });
      const data = await r.json(); setResult({ ok: r.ok, ...data });
    } catch (e) { setResult({ ok: false, error: 'API indisponível. Use o DBeaver ou inicie o servidor do projeto. ' + e.message }); }
    finally { setRunning(false); }
  };
  const reset = async () => {
    if (!confirm('Isso recriará todo o banco sql_mastery para o estado inicial. Continuar?')) return;
    setRunning(true);
    try { const r = await fetch(`${API_URL}/api/reset`, { method: 'POST' }); const data = await r.json(); setResult({ ok: r.ok, message: data.message, error: data.error }); refreshApi(); }
    catch (e) { setResult({ ok: false, error: e.message }); }
    finally { setRunning(false); }
  };
  const rows = result?.rows || [];
  const columns = rows.length ? Object.keys(rows[0]) : (result?.fields || []).map((f) => f.name);
  return (
    <div className="content-page playground-page">
      <div className="page-heading row-heading"><div><span className="eyebrow">Bônus opcional</span><h1>Playground SQL</h1><p>Você pode praticar no DBeaver como planejado. Este executor existe apenas como alternativa rápida dentro do curso.</p></div><div className={cx('status-pill', apiStatus.ok ? 'online' : 'offline')}><span /> {apiStatus.ok ? 'API + PostgreSQL online' : 'Executor offline'}</div></div>
      {!apiStatus.ok && <div className="warning"><Server /><div><b>O curso continua funcionando normalmente.</b><p>Para usar este executor, inicie PostgreSQL + API. Se preferir, ignore esta tela e execute todos os exercícios no DBeaver.</p></div></div>}
      <div className="editor-card">
        <div className="editor-top"><span><TerminalSquare size={16} /> SQL Editor</span><div><button className="ghost" onClick={() => navigator.clipboard.writeText(sql)}><Clipboard size={15} /> Copiar</button><button className="primary" onClick={run} disabled={running || !apiStatus.ok}><Play size={15} /> {running ? 'Executando...' : 'Executar'}</button></div></div>
        <textarea spellCheck="false" value={sql} onChange={(e) => setSql(e.target.value)} />
        <div className="editor-bottom"><span>Executa SQL diretamente no banco de laboratório.</span><button className="danger-link" onClick={reset} disabled={!apiStatus.ok || running}><RefreshCw size={14} /> Restaurar banco</button></div>
      </div>
      {result && <div className={cx('result-card', result.ok ? 'ok' : 'error')}>
        <div className="result-head"><b>{result.ok ? `${result.rowCount ?? rows.length} linha(s)` : 'Erro SQL'}</b>{result.executionTimeMs != null && <span>{result.executionTimeMs} ms</span>}</div>
        {result.message && <p>{result.message}</p>}
        {result.error && <div className="sql-error"><b>{result.code ? `[${result.code}] ` : ''}{result.error}</b>{result.detail && <p>{result.detail}</p>}{result.hint && <p>Dica do PostgreSQL: {result.hint}</p>}</div>}
        {result.ok && rows.length > 0 && <div className="result-table-wrap"><table><thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.slice(0, 200).map((row, i) => <tr key={i}>{columns.map((c) => <td key={c}>{row[c] == null ? <i>NULL</i> : typeof row[c] === 'object' ? JSON.stringify(row[c]) : String(row[c])}</td>)}</tr>)}</tbody></table>{rows.length > 200 && <small>Exibindo 200 de {rows.length} linhas.</small>}</div>}
      </div>}
      <div className="safety panel"><h3>Rotina segura para treinar DML</h3><CodeBlock>{`BEGIN;\n\n-- 1. Veja o alvo\nSELECT * FROM products WHERE id = 1;\n\n-- 2. Faça a alteração\nUPDATE products SET stock = stock - 1 WHERE id = 1;\n\n-- 3. Confira\nSELECT * FROM products WHERE id = 1;\n\n-- 4. Enquanto estiver estudando, desfaça\nROLLBACK;`}</CodeBlock></div>
    </div>
  );
}

function ReferencePage({ search }) {
  const [local, setLocal] = useState('');
  const q = (search || local).trim().toLowerCase();
  const list = sqlReference.filter((x) => x.join(' ').toLowerCase().includes(q));
  return (
    <div className="content-page reference-page">
      <div className="page-heading"><span className="eyebrow">Consulta rápida</span><h1>Referência de comandos SQL</h1><p>Uma cola explicativa para revisar o papel de cada comando, expressão, constraint e recurso usado no curso.</p></div>
      {!search && <div className="reference-search"><Search size={16} /><input value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Filtrar comando, categoria ou descrição..." /></div>}
      <div className="reference-list">
        {list.map(([command, category, description, example]) => <div className="reference-row" key={command}><div><code className="command-name">{command}</code><Badge>{category}</Badge></div><p>{description}</p><code className="inline-example">{example}</code></div>)}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState('dashboard');
  const [selectedModuleId, setSelectedModuleId] = useState('m00');
  const [search, setSearch] = useState('');
  const [completed, setCompleted] = useState(() => new Set(JSON.parse(localStorage.getItem('sql-mastery-completed') || '[]')));
  const [solvedArena, setSolvedArena] = useState(() => new Set(JSON.parse(localStorage.getItem('sql-mastery-arena-solved') || '[]')));
  const [apiStatus, setApiStatus] = useState({ ok: false });
  const [liveSchema, setLiveSchema] = useState(null);

  const refreshApi = async () => {
    try {
      const r = await fetch(`${API_URL}/api/health`); const data = await r.json();
      setApiStatus({ ok: r.ok && data.ok, ...data });
      if (r.ok) { const s = await fetch(`${API_URL}/api/schema`); if (s.ok) setLiveSchema(await s.json()); }
    } catch { setApiStatus({ ok: false }); }
  };
  useEffect(() => { refreshApi(); }, []);

  const toggleCompleted = (id) => {
    setCompleted((prev) => {
      const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem('sql-mastery-completed', JSON.stringify([...next]));
      return next;
    });
  };

  const toggleArenaSolved = (id) => {
    setSolvedArena((prev) => {
      const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem('sql-mastery-arena-solved', JSON.stringify([...next]));
      return next;
    });
  };

  let content;
  if (view === 'dashboard') content = <Dashboard setView={setView} setSelectedModuleId={setSelectedModuleId} completed={completed} apiStatus={apiStatus} />;
  if (view === 'course') content = <Course selectedModuleId={selectedModuleId} setSelectedModuleId={setSelectedModuleId} completed={completed} toggleCompleted={toggleCompleted} search={search} />;
  if (view === 'arena') content = <SqlArena search={search} solvedArena={solvedArena} toggleArenaSolved={toggleArenaSolved} />;
  if (view === 'schema') content = <SchemaPage liveSchema={liveSchema} />;
  if (view === 'playground') content = <Playground apiStatus={apiStatus} refreshApi={refreshApi} />;
  if (view === 'reference') content = <ReferencePage search={search} />;

  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} selectedModuleId={selectedModuleId} setSelectedModuleId={setSelectedModuleId} completed={completed} search={search} setSearch={setSearch} />
      <main className="main-area">
        <header className="topbar"><div><span className="topbar-kicker">SQL Mastery Lab</span><b>{view === 'dashboard' ? 'Visão geral' : view === 'course' ? 'Curso' : view === 'arena' ? 'SQL Arena' : view === 'schema' ? 'Banco de estudo' : view === 'playground' ? 'Playground' : 'Referência SQL'}</b></div><div className="top-actions"><span className={cx('mini-status', apiStatus.ok && 'online')}><span /> {apiStatus.ok ? 'PostgreSQL conectado' : 'Modo DBeaver'}</span></div></header>
        {content}
      </main>
    </div>
  );
}
