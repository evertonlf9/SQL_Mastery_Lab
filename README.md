# SQL Mastery Lab — PostgreSQL + React + DBeaver

Curso local de SQL do **zero ao avançado**, baseado em um único banco PostgreSQL fictício. O projeto foi pensado para quem nunca usou SQL e quer praticar principalmente no **DBeaver**, com uma interface React que funciona como material didático interativo.

## O que você recebe

- Curso progressivo do fundamento ao nível especialista.
- 19 módulos, aulas com teoria, sintaxe e exemplos comentados.
- 59 desafios nas aulas com **tabelas indicadas**, **dica opcional** e **resposta escondida por padrão**.
- Banco PostgreSQL único (`sql_mastery`) com dados fictícios e relações realistas.
- Clientes, produtos, categorias, fornecedores, pedidos, itens, pagamentos, funcionários, reviews, tickets e estoque.
- Recursos para praticar INNER/LEFT/CROSS/FULL/SELF JOIN, subqueries, CTEs, recursão, window functions, JSONB, arrays, LATERAL, views, funções, transações, índices e EXPLAIN.
- Progresso das aulas salvo no `localStorage` do navegador.
- Playground SQL no próprio site (opcional). Se você preferir DBeaver, pode ignorá-lo completamente.
- Script de reset do banco para voltar ao estado original a qualquer momento.

---

## Estrutura do projeto

```text
sql-mastery-lab/
├── client/                         # React + Vite (curso interativo)
│   └── src/
│       ├── App.jsx
│       ├── styles.css
│       └── data/course.js          # conteúdo das aulas e desafios
├── server/                         # API Node/Express (playground opcional)
│   └── src/index.js
├── db/
│   ├── init/
│   │   └── 01_lab.sql              # schema + dados fake + índices + views
│   └── dbeaver/
│       ├── 00_create_database.sql  # cria sql_mastery
│       ├── 02_dbeaver_practice.sql # caderno inicial para DBeaver
│       └── 03_challenges_no_answers.sql # 59 desafios sem respostas
├── INICIO_RAPIDO_DBEAVER.md
├── .env.example
├── docker-compose.yml
└── package.json
```

---

# Caminho recomendado: PostgreSQL + DBeaver + React

Essa é a opção recomendada para o seu objetivo, porque você escreverá os comandos SQL no DBeaver enquanto consulta o curso no navegador.

## 1. Pré-requisitos

Você precisa ter:

- PostgreSQL instalado e rodando localmente **ou** PostgreSQL rodando via Docker.
- DBeaver instalado.
- Node.js compatível com o Vite do projeto (recomendado Node 22).
- npm.

> O DBeaver é o cliente/editor. O servidor PostgreSQL precisa estar rodando em algum lugar para ele se conectar.

## 2. Criar o banco pelo DBeaver

Abra o DBeaver e crie uma conexão PostgreSQL apontando inicialmente para o banco padrão `postgres`.

Abra um SQL Editor nessa conexão e execute:

```text
db/dbeaver/00_create_database.sql
```

Ele cria:

```text
sql_mastery
```

Se o banco já existir, não execute esse arquivo novamente.

## 3. Conectar no banco de estudo

No DBeaver, abra/crie uma conexão cujo campo **Database** seja:

```text
sql_mastery
```

Em seguida abra um SQL Editor nessa nova conexão.

## 4. Criar todas as tabelas e dados

Execute o arquivo:

```text
db/init/01_lab.sql
```

Esse script:

1. remove os objetos anteriores do laboratório;
2. cria todas as tabelas e constraints;
3. insere dados fictícios;
4. cria índices;
5. cria as views `vw_order_totals` e `vw_customer_summary`;
6. exibe uma contagem das principais tabelas ao final.

**Atenção:** rodar `01_lab.sql` novamente é o reset completo do laboratório. Alterações que você fez durante os exercícios serão apagadas.

## 5. Conferir se funcionou

No DBeaver, execute:

```sql
SELECT current_database();

SELECT COUNT(*) FROM customers;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM orders;

SELECT * FROM vw_customer_summary
ORDER BY lifetime_value DESC
LIMIT 10;
```

Você também pode abrir:

```text
db/dbeaver/02_dbeaver_practice.sql
```

Ele já contém uma pequena sequência de consultas para começar a explorar a base.

---

# Executar somente o curso React

O curso **não depende da API para abrir**. Portanto, se você fará todos os exercícios no DBeaver, basta subir o front-end.

Na raiz do projeto:

```bash
npm install
npm run dev -w client
```

Abra no navegador:

```text
http://localhost:5173
```

Se o PostgreSQL/API não estiverem conectados, a interface exibirá **Modo DBeaver**. Isso é normal: aulas, desafios, respostas escondidas, referência e progresso continuam funcionando.

---

# Executar React + API opcional

Use esta opção se quiser executar SQL também dentro da interface web.

## 1. Configure a conexão

Copie:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Edite `DATABASE_URL` com o mesmo usuário/senha que você usa para entrar no PostgreSQL pelo DBeaver:

```env
DATABASE_URL=postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/sql_mastery
```

## 2. Instale e inicie

```bash
npm install
npm run dev
```

Endereços padrão:

```text
Curso: http://localhost:5173
API:   http://localhost:3001
```

Quando a API consegue acessar o banco, a interface mostra **PostgreSQL conectado** e a página Playground passa a executar SQL de verdade.

### Importante sobre o playground

Ele foi criado para ambiente **local de estudo** e aceita SQL arbitrário porque o objetivo é justamente permitir praticar DDL e DML. Não publique essa API na internet sem adicionar autenticação, isolamento e políticas de segurança.

---

# Opção Docker Compose

Se você não quiser instalar o servidor PostgreSQL diretamente, o Docker Compose pode subir:

- PostgreSQL;
- API;
- React/Vite.

Na raiz:

```bash
cp .env.example .env

docker compose up
```

O banco é criado como `sql_mastery` e `db/init/01_lab.sql` é executado automaticamente na primeira inicialização do volume.

Depois você pode conectar o DBeaver usando:

```text
Host:     localhost
Port:     5432
Database: sql_mastery
User:     sql_student
Password: sql_student_password
```

Se você modificar essas variáveis no `.env`, use os novos valores no DBeaver.

Para destruir também o volume e recriar o banco do zero:

```bash
docker compose down -v
docker compose up
```

---

# Como usar o curso

## Modo recomendado

1. Leia a teoria de uma aula no site.
2. Copie/examine os exemplos.
3. Digite os exemplos você mesmo no DBeaver sempre que possível.
4. Abra o desafio.
5. Tente resolver sem dica.
6. Se travar, abra apenas a dica.
7. Execute sua solução e valide o resultado.
8. Só então clique em **Revelar resposta**.
9. Compare a lógica da sua consulta com a solução de referência.
10. Marque a aula como concluída.

A solução oficial não precisa ser idêntica à sua. Em SQL, diferentes consultas podem produzir corretamente o mesmo resultado.

---

# Currículo

O curso cobre, de forma progressiva:

1. Conceitos de banco relacional, PK, FK e categorias de SQL.
2. `SELECT`, `FROM`, aliases, `DISTINCT`, `LIMIT`.
3. `WHERE`, comparações, `AND`, `OR`, `NOT`, `IN`, `BETWEEN`, `LIKE`, `ILIKE`, `NULL`.
4. `ORDER BY`, expressões e `CASE`.
5. Funções de texto, números, datas e intervalos.
6. `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`, `GROUP BY`, `HAVING`, `FILTER`.
7. `INNER JOIN`, `LEFT JOIN`, `CROSS JOIN`, `FULL JOIN`, múltiplos JOINs e SELF JOIN.
8. Subqueries, `IN`, `EXISTS`, `NOT EXISTS`.
9. CTE (`WITH`) e CTE recursiva.
10. `UNION`, `UNION ALL`, `INTERSECT`, `EXCEPT`.
11. `INSERT`, `UPDATE`, `DELETE`, `RETURNING`.
12. `CREATE TABLE`, tipos e constraints.
13. Transações: `BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT`.
14. Views, materialized views e funções SQL.
15. Window functions: `OVER`, `PARTITION BY`, `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`, `LEAD`.
16. PostgreSQL: JSONB, arrays e `LATERAL`.
17. Índices B-tree/GIN e `EXPLAIN (ANALYZE, BUFFERS)`.
18. SQL analítico com `DISTINCT ON` e `GROUPING SETS`.
19. Projeto final com análises de cliente, produto e SLA.

---

# Banco de estudo

## Relações principais

```text
customers 1 ─── N orders 1 ─── N order_items N ─── 1 products
                         │                         │
                         1                         ├── N reviews
                         │                         └── N inventory_movements
                         1
                      payments

employees 1 ─── N employees     (hierarquia manager_id)
employees 1 ─── N orders        (salesperson_id)
employees 1 ─── N support_tickets
```

As tabelas foram escolhidas para permitir perguntas de negócio variadas, e não apenas exemplos artificiais de duas colunas.

---

# Rotina segura no DBeaver para UPDATE/DELETE

Quando estiver aprendendo DML, use este padrão:

```sql
BEGIN;

-- Confira exatamente o alvo.
SELECT *
FROM products
WHERE id = 1;

-- Faça a alteração.
UPDATE products
SET stock = stock - 1
WHERE id = 1
RETURNING *;

-- Ainda não confirme. Confira novamente.
SELECT *
FROM products
WHERE id = 1;

-- Durante o treino, desfaça.
ROLLBACK;
```

Quando tiver certeza de que deseja persistir, use `COMMIT` no lugar de `ROLLBACK`.

---

# Reset do laboratório

Você tem duas opções.

### Pelo DBeaver

Execute novamente:

```text
db/init/01_lab.sql
```

### Pela interface

Se a API estiver online, use **Playground SQL → Restaurar banco**.

---

# Scripts úteis

```bash
# instalar dependências
npm install

# React + API
npm run dev

# somente React
npm run dev -w client

# somente API
npm run dev -w server

# build do React
npm run build

# regerar caderno de desafios do DBeaver a partir do curso
npm run generate:dbeaver
```

---

## Observação sobre dados

Todos os nomes, e-mails e demais registros do laboratório são fictícios e foram criados exclusivamente para estudo.
