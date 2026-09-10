# Início rápido — DBeaver

## 1) Conecte no PostgreSQL

No DBeaver, crie uma conexão PostgreSQL para o seu servidor local. Para criar o banco, a primeira conexão pode apontar para o banco padrão `postgres`.

## 2) Crie `sql_mastery`

Abra e execute:

```text
db/dbeaver/00_create_database.sql
```

`CREATE DATABASE` precisa ser executado fora de uma transação. Se o DBeaver estiver com auto-commit desativado, ative-o temporariamente para este passo.

## 3) Troque a conexão para `sql_mastery`

Edite a conexão ou crie uma nova usando exatamente:

```text
Database: sql_mastery
```

## 4) Carregue o laboratório

Execute o arquivo inteiro:

```text
db/init/01_lab.sql
```

Ao final, o script mostra contagens das tabelas principais.

## 5) Abra os materiais de prática

```text
db/dbeaver/02_dbeaver_practice.sql
```

Tem exemplos iniciais para explorar o banco.

```text
db/dbeaver/03_challenges_no_answers.sql
```

Tem todos os desafios do curso **sem as respostas** para você resolver diretamente no editor do DBeaver.

## 6) Suba o curso React

Na raiz do projeto:

```bash
npm install
npm run dev -w client
```

Abra:

```text
http://localhost:5173
```

Use o site para teoria, exemplos, progresso, dicas e respostas escondidas. Use o DBeaver para digitar e executar suas consultas.

## 7) Se bagunçar o banco

Execute novamente:

```text
db/init/01_lab.sql
```

Ele restaura todo o laboratório.

## Erros comuns

### `database "sql_mastery" does not exist`
Você ainda não executou `00_create_database.sql` ou sua conexão está apontando para outro servidor PostgreSQL.

### `CREATE DATABASE cannot run inside a transaction block`
Ative auto-commit temporariamente e execute apenas o comando `CREATE DATABASE`.

### `password authentication failed`
Revise usuário e senha da conexão no DBeaver. Se estiver usando a API opcional, atualize também `DATABASE_URL` no `.env`.

### A aplicação mostra `Modo DBeaver`
Isso é esperado quando a API opcional não está rodando. O curso continua completo e você pode praticar normalmente no DBeaver.
