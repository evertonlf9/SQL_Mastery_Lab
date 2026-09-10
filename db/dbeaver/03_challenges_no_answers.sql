-- SQL MASTERY LAB - 59 DESAFIOS PARA RESOLVER NO DBEAVER
-- Este arquivo NÃO contém respostas. As soluções ficam escondidas na interface React.
-- Cada desafio informa as tabelas/fontes que devem orientar a consulta.
-- Recomendação: escreva sua solução abaixo de cada enunciado.
-- Para desfazer experimentos, execute db/init/01_lab.sql novamente.

==============================================================================
-- MÓDULO 00 - FUNDAMENTOS: BANCO DE DADOS E SQL
==============================================================================

-- C001 | Muito fácil | Reconheça a tabela
-- Aula: O que é SQL e como enxergar um banco relacional
-- Tabelas: products
-- Liste as 10 primeiras linhas de products com todas as colunas.

-- SUA SOLUÇÃO:


-- C002 | Muito fácil | Leia o esquema
-- Aula: O que é SQL e como enxergar um banco relacional
-- Tabelas: employees, customers, orders
-- No DBeaver, abra a tabela orders e identifique a chave primária e as duas chaves
-- estrangeiras principais.

-- SUA SOLUÇÃO:


-- C003 | Fácil | Classifique os comandos
-- Aula: Categorias de comandos: DQL, DML, DDL, DCL e TCL
-- Tabelas: nenhuma tabela; exercício conceitual
-- Classifique SELECT, INSERT, CREATE TABLE, COMMIT e GRANT nas categorias estudadas.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 01 - SELECT: SUA PRIMEIRA CONSULTA
==============================================================================

-- C004 | Fácil | Catálogo simples
-- Aula: SELECT, FROM e aliases com AS
-- Tabelas: products
-- Liste sku, nome e preço de todos os produtos. Renomeie name para product_name e price para
-- unit_price.

-- SUA SOLUÇÃO:


-- C005 | Fácil | Margem bruta
-- Aula: SELECT, FROM e aliases com AS
-- Tabelas: products
-- Mostre nome, preço, custo e margem bruta (preço - custo) dos produtos.

-- SUA SOLUÇÃO:


-- C006 | Fácil | Canais de venda
-- Aula: DISTINCT e LIMIT
-- Tabelas: orders
-- Liste todos os canais de venda existentes em orders sem repetir valores.

-- SUA SOLUÇÃO:


-- C007 | Fácil | Amostra de produtos
-- Aula: DISTINCT e LIMIT
-- Tabelas: products
-- Mostre apenas 8 produtos com id, sku e name.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 02 - WHERE: FILTRANDO DADOS
==============================================================================

-- C008 | Fácil | Produtos vendáveis
-- Aula: WHERE, operadores e AND/OR/NOT
-- Tabelas: products
-- Liste produtos ativos com estoque maior que 20 e preço menor que 300.

-- SUA SOLUÇÃO:


-- C009 | Fácil | Prioridade comercial
-- Aula: WHERE, operadores e AND/OR/NOT
-- Tabelas: customers
-- Liste clientes ativos que sejam gold OU platinum e estejam em SP ou RJ.

-- SUA SOLUÇÃO:


-- C010 | Fácil | Busca textual
-- Aula: IN, BETWEEN, LIKE e ILIKE
-- Tabelas: products
-- Encontre produtos cujo nome contenha a palavra “Livro”, ignorando maiúsculas/minúsculas.

-- SUA SOLUÇÃO:


-- C011 | Médio | Pedidos em período
-- Aula: IN, BETWEEN, LIKE e ILIKE
-- Tabelas: orders
-- Liste pedidos feitos durante abril de 2025.

-- SUA SOLUÇÃO:


-- C012 | Médio | Data de pagamento amigável
-- Aula: NULL, IS NULL e COALESCE
-- Tabelas: payments
-- Mostre order_id, status e paid_at dos pagamentos, exibindo o texto “não pago” quando paid_at
-- for nulo.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 03 - ORDENAÇÃO, EXPRESSÕES E CASE
==============================================================================

-- C013 | Fácil | Últimos pedidos
-- Aula: ORDER BY, ASC, DESC e NULLS
-- Tabelas: orders
-- Mostre os 20 pedidos mais recentes.

-- SUA SOLUÇÃO:


-- C014 | Médio | Classifique estoque
-- Aula: CASE e colunas calculadas
-- Tabelas: products
-- Classifique produtos em crítico (<15), atenção (<35) e saudável (demais).

-- SUA SOLUÇÃO:


-- C015 | Médio | Ordenação de prioridade
-- Aula: CASE e colunas calculadas
-- Tabelas: support_tickets
-- Liste tickets abertos/in_progress com urgent primeiro, depois high, medium e low.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 04 - FUNÇÕES DE TEXTO, NÚMERO E DATA
==============================================================================

-- C016 | Médio | Domínio de e-mail
-- Aula: Texto: LOWER, UPPER, LENGTH, CONCAT e SUBSTRING
-- Tabelas: customers
-- Extraia o domínio do e-mail dos clientes usando split_part.

-- SUA SOLUÇÃO:


-- C017 | Fácil | Ano de cadastro
-- Aula: Datas: EXTRACT, DATE_TRUNC, AGE e intervalos
-- Tabelas: customers
-- Mostre cliente, signup_date e ano de cadastro.

-- SUA SOLUÇÃO:


-- C018 | Médio | Tempo de resolução
-- Aula: Datas: EXTRACT, DATE_TRUNC, AGE e intervalos
-- Tabelas: support_tickets
-- Para tickets encerrados, mostre quantas horas se passaram entre opened_at e closed_at.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 05 - AGREGAÇÕES: COUNT, SUM, AVG, GROUP BY E HAVING
==============================================================================

-- C019 | Fácil | Resumo de salários
-- Aula: Funções agregadoras
-- Tabelas: employees
-- Calcule quantidade de funcionários ativos, salário médio, menor e maior salário.

-- SUA SOLUÇÃO:


-- C020 | Médio | Ticket por prioridade
-- Aula: GROUP BY e HAVING
-- Tabelas: support_tickets
-- Conte tickets por priority e status.

-- SUA SOLUÇÃO:


-- C021 | Médio | Categorias relevantes
-- Aula: GROUP BY e HAVING
-- Tabelas: products
-- Mostre category_id e preço médio apenas das categorias cujo preço médio seja maior que 350.

-- SUA SOLUÇÃO:


-- C022 | Avançado | Saúde dos pagamentos
-- Aula: FILTER e agregação condicional
-- Tabelas: payments
-- Em uma linha, conte todos os pagamentos, approved, pending, refunded e failed.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 06 - JOINS: CONECTANDO TABELAS
==============================================================================

-- C023 | Médio | Item completo
-- Aula: INNER JOIN e múltiplos JOINs
-- Tabelas: products, order_items
-- Liste order_id, produto, quantidade, unit_price e line_total dos 30 primeiros itens.

-- SUA SOLUÇÃO:


-- C024 | Médio | Pedido detalhado
-- Aula: INNER JOIN e múltiplos JOINs
-- Tabelas: employees, customers, orders, vw_order_totals
-- Mostre pedido, cliente, vendedor e total usando orders, customers, employees e
-- vw_order_totals.

-- SUA SOLUÇÃO:


-- C025 | Médio | Clientes sem pedidos
-- Aula: LEFT JOIN e registros sem correspondência
-- Tabelas: customers, orders
-- Encontre clientes que nunca fizeram pedido.

-- SUA SOLUÇÃO:


-- C026 | Médio | Equipe de cada gerente
-- Aula: SELF JOIN: hierarquia de funcionários
-- Tabelas: employees
-- Liste gerente e quantidade de subordinados diretos, incluindo apenas quem possui ao menos um
-- subordinado.

-- SUA SOLUÇÃO:


-- C056 | Médio | Mapa completo categoria por canal
-- Aula: CROSS JOIN: combinações e grades de análise
-- Tabelas: categories, orders
-- Crie uma grade com todas as combinações entre categorias e canais de venda existentes.
-- Retorne category e channel.

-- SUA SOLUÇÃO:


-- C057 | Avançado | Receita por grade completa
-- Aula: CROSS JOIN: combinações e grades de análise
-- Tabelas: categories, products, orders, order_items
-- Mostre todas as combinações category/channel e a receita de pedidos não cancelados, exibindo
-- zero quando não houver venda naquela combinação.

-- SUA SOLUÇÃO:


-- C058 | Médio | Categorias com produto versus categorias vendidas
-- Aula: FULL JOIN: reconciliação entre conjuntos
-- Tabelas: products, order_items
-- Compare categorias que existem no catálogo de produtos com categorias que aparecem em itens
-- de pedido. Retorne category_id, has_products e has_sales.

-- SUA SOLUÇÃO:


-- C059 | Médio | Clientes compradores versus clientes com ticket
-- Aula: FULL JOIN: reconciliação entre conjuntos
-- Tabelas: orders, support_tickets
-- Compare clientes que possuem pedidos com clientes que possuem tickets de suporte. Retorne
-- customer_id, has_order e has_ticket.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 07 - SUBQUERIES, IN E EXISTS
==============================================================================

-- C027 | Médio | Salários acima da média
-- Aula: Subquery escalar e subquery de conjunto
-- Tabelas: employees
-- Liste funcionários ativos com salário acima da média dos funcionários ativos.

-- SUA SOLUÇÃO:


-- C028 | Médio | Clientes com ticket urgente
-- Aula: Subquery escalar e subquery de conjunto
-- Tabelas: customers, support_tickets
-- Liste clientes cujo id aparece em tickets de prioridade urgent.

-- SUA SOLUÇÃO:


-- C029 | Médio | Produtos nunca avaliados
-- Aula: EXISTS e NOT EXISTS
-- Tabelas: products, reviews
-- Liste produtos que não possuem nenhuma review.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 08 - CTES E CONSULTAS RECURSIVAS
==============================================================================

-- C030 | Avançado | Top clientes com CTE
-- Aula: WITH / CTE
-- Tabelas: customers, vw_order_totals
-- Crie uma CTE com receita por cliente e retorne os 10 maiores.

-- SUA SOLUÇÃO:


-- C031 | Avançado | Profundidade da equipe
-- Aula: WITH RECURSIVE
-- Tabelas: employees
-- Retorne id, nome e nível hierárquico de todos os funcionários a partir da raiz.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 09 - UNION, INTERSECT E EXCEPT
==============================================================================

-- C032 | Médio | Compradores sem ticket
-- Aula: Operadores de conjunto
-- Tabelas: orders, support_tickets
-- Obtenha customer_id de quem aparece em orders mas nunca em support_tickets.

-- SUA SOLUÇÃO:


-- C033 | Médio | Todos os envolvidos
-- Aula: Operadores de conjunto
-- Tabelas: orders, support_tickets
-- Produza uma lista única de customer_id que apareçam em orders ou support_tickets.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 10 - INSERT, UPDATE, DELETE E RETURNING
==============================================================================

-- C034 | Médio | Novo cliente
-- Aula: INSERT e RETURNING
-- Tabelas: customers
-- Insira um cliente fictício com name, email, city, state, signup_date, segment e retorne
-- id/name.

-- SUA SOLUÇÃO:


-- C035 | Médio | Desativação segura
-- Aula: UPDATE e DELETE seguros
-- Tabelas: customers
-- Desative o cliente criado no desafio anterior pelo e-mail e retorne id, name e active.

-- SUA SOLUÇÃO:


-- C036 | Médio | Remova o cliente de treino
-- Aula: UPDATE e DELETE seguros
-- Tabelas: customers
-- Remova o cliente de treino pelo e-mail usando RETURNING.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 11 - DDL, CONSTRAINTS E MODELAGEM
==============================================================================

-- C037 | Médio | Crie uma wishlist
-- Aula: CREATE TABLE e tipos
-- Tabelas: customers, products
-- Crie tabela wishlists com id, customer_id FK, product_id FK, created_at default now() e
-- unicidade customer/product.

-- SUA SOLUÇÃO:


-- C038 | Médio | Regra de nota
-- Aula: PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK e NOT NULL
-- Tabelas: reviews
-- Explique por que reviews.rating nunca deve aceitar 0 nem 6 e escreva a constraint.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 12 - TRANSAÇÕES E CONSISTÊNCIA
==============================================================================

-- C039 | Avançado | Atualize sem medo
-- Aula: BEGIN, COMMIT e ROLLBACK
-- Tabelas: products
-- Abra uma transação, aumente em 10% o preço dos produtos category_id=2, confira, e desfaça
-- tudo.

-- SUA SOLUÇÃO:


-- C040 | Avançado | Savepoint de laboratório
-- Aula: SAVEPOINT e isolamento
-- Tabelas: customers, products
-- Crie uma transação que altere customer 2, crie um savepoint, altere product 2, desfaça só a
-- segunda alteração e finalize com COMMIT.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 13 - VIEWS, FUNÇÕES E REUTILIZAÇÃO
==============================================================================

-- C041 | Avançado | View de produtos rentáveis
-- Aula: VIEW e MATERIALIZED VIEW
-- Tabelas: products
-- Crie uma view vw_product_margin com id, name, price, cost, margin_value e margin_pct.

-- SUA SOLUÇÃO:


-- C042 | Avançado | Função de estoque
-- Aula: Funções SQL no PostgreSQL
-- Tabelas: nenhuma tabela; exercício conceitual
-- Crie fn_stock_status(stock integer) que retorne crítico, atenção ou saudável usando os
-- mesmos limites do módulo 3.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 14 - WINDOW FUNCTIONS
==============================================================================

-- C043 | Avançado | Preço versus média da categoria
-- Aula: OVER, PARTITION BY e ORDER BY
-- Tabelas: products
-- Para cada produto, mostre preço, preço médio da categoria e diferença para a média.

-- SUA SOLUÇÃO:


-- C044 | Avançado | Ranking de faturamento
-- Aula: ROW_NUMBER, RANK, DENSE_RANK, LAG e LEAD
-- Tabelas: vw_order_totals
-- Some receita por cliente e gere DENSE_RANK do maior para o menor.

-- SUA SOLUÇÃO:


-- C045 | Avançado | Pedido anterior
-- Aula: ROW_NUMBER, RANK, DENSE_RANK, LAG e LEAD
-- Tabelas: vw_order_totals
-- Para cada pedido do cliente 10, mostre total e total do pedido anterior.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 15 - POSTGRESQL AVANÇADO: JSONB, ARRAYS E LATERAL
==============================================================================

-- C046 | Avançado | Produtos com garantia longa
-- Aula: JSONB e operadores ->, ->>, @>
-- Tabelas: products
-- Liste produtos cujo warranty_months no JSONB seja pelo menos 18.

-- SUA SOLUÇÃO:


-- C047 | Avançado | Contagem por tag
-- Aula: Arrays e ANY / @>
-- Tabelas: products
-- Expanda tags e conte quantos produtos existem por tag.

-- SUA SOLUÇÃO:


-- C048 | Avançado | Top 2 pedidos por cliente
-- Aula: LATERAL
-- Tabelas: customers, vw_order_totals
-- Use LATERAL para retornar até os dois maiores pedidos de cada cliente por total_amount.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 16 - ÍNDICES, EXPLAIN E PERFORMANCE
==============================================================================

-- C049 | Avançado | Desenhe o índice
-- Aula: B-tree, GIN e índices compostos
-- Tabelas: orders
-- Para consultas frequentes WHERE status=? AND order_date BETWEEN ... qual índice do
-- laboratório já ajuda?

-- SUA SOLUÇÃO:


-- C050 | Avançado | Compare dois filtros
-- Aula: EXPLAIN e EXPLAIN ANALYZE
-- Tabelas: orders
-- Rode EXPLAIN ANALYZE para customer_id=10 e depois para uma consulta sem filtro. Compare
-- Index Scan/Bitmap/Seq Scan e explique por que o plano pode mudar.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 17 - SQL ANALÍTICO AVANÇADO
==============================================================================

-- C051 | Especialista | Melhor review por produto
-- Aula: DISTINCT ON e “primeiro por grupo”
-- Tabelas: reviews
-- Retorne uma review por produto: a de maior rating; em empate, a mais recente.

-- SUA SOLUÇÃO:


-- C052 | Especialista | Receita por canal e total
-- Aula: GROUPING SETS e múltiplas granularidades
-- Tabelas: vw_order_totals
-- Calcule receita por channel e também uma linha de total geral usando GROUPING SETS.

-- SUA SOLUÇÃO:



==============================================================================
-- MÓDULO 18 - PROJETO FINAL: ANÁLISE COMPLETA DO NEGÓCIO
==============================================================================

-- C053 | Especialista | Segmentação RFM simplificada
-- Aula: Capstone 1 — clientes e receita
-- Tabelas: customers, vw_order_totals
-- Para cada cliente com pedidos não cancelados, calcule: recency_date (último pedido),
-- frequency (pedidos) e monetary (receita). Depois ordene por monetary desc.

-- SUA SOLUÇÃO:


-- C054 | Especialista | Ranking de produtos
-- Aula: Capstone 2 — produtos e performance comercial
-- Tabelas: products, orders, order_items
-- Calcule por produto: units_sold, item_revenue, estimated_margin =
-- sum((unit_price-cost)*quantity*(1-discount)); depois rankeie por receita dentro de cada
-- categoria.

-- SUA SOLUÇÃO:


-- C055 | Especialista | SLA por prioridade
-- Aula: Capstone 3 — SLA de atendimento
-- Tabelas: support_tickets
-- Para tickets encerrados, calcule por priority: quantidade, média de horas e mediana de horas
-- de resolução.

-- SUA SOLUÇÃO:
