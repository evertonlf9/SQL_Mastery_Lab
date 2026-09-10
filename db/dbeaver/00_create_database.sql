-- Execute este arquivo no DBeaver conectado ao banco padrão "postgres".
-- Se o banco já existir, pule este passo.
-- CREATE DATABASE não pode ser executado dentro de um bloco de transação.

CREATE DATABASE sql_mastery
    WITH
    ENCODING = 'UTF8'
    TEMPLATE = template0;

-- Depois: no DBeaver, crie/abra uma conexão apontando para o banco sql_mastery
-- e execute db/init/01_lab.sql.
