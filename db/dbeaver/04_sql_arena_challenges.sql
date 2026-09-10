-- SQL MASTERY LAB - SQL ARENA
-- Desafios estilo LeetCode para resolver no DBeaver
-- Este arquivo NAO CONTEM RESPOSTAS. As solucoes ficam escondidas na interface React.
-- Total: 60 | Facil: 20 | Medio: 25 | Dificil: 15
-- Banco: sql_mastery
--
-- COMO USAR
-- 1) Conecte o DBeaver ao banco sql_mastery.
-- 2) Resolva um problema por vez abaixo da linha SUA SOLUCAO.
-- 3) Execute apenas o seu SELECT/CTE com Ctrl+Enter ou Cmd+Enter.
-- 4) Quando terminar, abra SQL Arena no site e compare com a solucao de referencia.
-- 5) Solucoes diferentes podem ser corretas se entregarem o mesmo resultado.


-- ============================================================================
-- FÁCIL
-- ============================================================================

-- ----------------------------------------------------------------------------
-- A001 | Clientes ativos de São Paulo
-- Dificuldade: Fácil | Categoria: Filtros e ordenação
-- Tabelas: customers
--
-- Retorne id, name e email dos clientes ativos do estado de SP. Ordene pelo nome em ordem
-- alfabética.
--
-- Resultado esperado:
-- Colunas: id, name, email. Apenas clientes active = true e state = SP.
--
-- Regras:
-- - Use WHERE.
-- - Ordene por name crescente.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A002 | Produtos na faixa de preço
-- Dificuldade: Fácil | Categoria: Filtros e ordenação
-- Tabelas: products
--
-- Liste id, name e price dos produtos ativos cujo preço esteja entre 100 e 300, inclusive.
-- Mostre os mais caros primeiro.
--
-- Resultado esperado:
-- Produtos ativos entre 100 e 300, ordenados por price DESC.
--
-- Regras:
-- - Use BETWEEN.
-- - Inclua os limites 100 e 300.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A003 | Estados que receberam pedidos
-- Dificuldade: Fácil | Categoria: Filtros e ordenação
-- Tabelas: orders
--
-- Retorne uma lista sem duplicidades dos estados para os quais já houve envio de pedidos.
--
-- Resultado esperado:
-- Uma coluna shipping_state sem valores repetidos.
--
-- Regras:
-- - Não use GROUP BY.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A004 | Clientes por segmento
-- Dificuldade: Fácil | Categoria: Agregações
-- Tabelas: customers
--
-- Conte quantos clientes existem em cada segmento e ordene do segmento com mais clientes para
-- o com menos.
--
-- Resultado esperado:
-- Colunas: segment, customer_count.
--
-- Regras:
-- - Use COUNT(*) e GROUP BY.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A005 | Preço médio por categoria
-- Dificuldade: Fácil | Categoria: JOINs
-- Tabelas: categories, products
--
-- Mostre o nome da categoria e o preço médio dos produtos pertencentes a ela, arredondado para
-- 2 casas decimais.
--
-- Resultado esperado:
-- Colunas: category, avg_price.
--
-- Regras:
-- - Use JOIN.
-- - Ordene pelo maior preço médio.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A006 | Pedidos de 2025
-- Dificuldade: Fácil | Categoria: Datas e texto
-- Tabelas: orders
--
-- Liste id, customer_id e order_date dos pedidos realizados durante o ano de 2025.
--
-- Resultado esperado:
-- Somente pedidos entre 2025-01-01 e antes de 2026-01-01.
--
-- Regras:
-- - Prefira um intervalo de datas em vez de EXTRACT no WHERE.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A007 | Pedidos ainda em andamento
-- Dificuldade: Fácil | Categoria: Filtros e ordenação
-- Tabelas: orders
--
-- Retorne os pedidos cujo status seja pending ou paid.
--
-- Resultado esperado:
-- Pedidos com status em {pending, paid}.
--
-- Regras:
-- - Use IN.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A008 | Estoque baixo
-- Dificuldade: Fácil | Categoria: Filtros e ordenação
-- Tabelas: products
--
-- Liste os produtos ativos com menos de 25 unidades em estoque. Mostre primeiro os menores
-- estoques.
--
-- Resultado esperado:
-- Colunas: id, name, stock.
--
-- Regras:
-- - Desempate por name.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A009 | Assinantes da newsletter
-- Dificuldade: Fácil | Categoria: JSONB e arrays
-- Tabelas: customers
--
-- Liste id, name e metadata dos clientes cujo campo newsletter dentro de metadata esteja
-- habilitado.
--
-- Resultado esperado:
-- Apenas clientes com metadata.newsletter = true.
--
-- Regras:
-- - Leia o valor dentro do JSONB.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A010 | Produtos populares
-- Dificuldade: Fácil | Categoria: JSONB e arrays
-- Tabelas: products
--
-- Encontre os produtos cujo array tags contenha o valor popular.
--
-- Resultado esperado:
-- Colunas: id, name, tags.
--
-- Regras:
-- - Use um operador ou função própria de arrays do PostgreSQL.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A011 | Top 5 salários
-- Dificuldade: Fácil | Categoria: Filtros e ordenação
-- Tabelas: employees
--
-- Retorne os 5 funcionários ativos com maiores salários.
--
-- Resultado esperado:
-- Colunas: id, name, role, salary. No máximo 5 linhas.
--
-- Regras:
-- - Use ORDER BY e LIMIT.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A012 | Pedidos por canal
-- Dificuldade: Fácil | Categoria: Agregações
-- Tabelas: orders
--
-- Conte o número de pedidos realizados em cada canal de venda.
--
-- Resultado esperado:
-- Colunas: channel, order_count.
--
-- Regras:
-- - Inclua todos os status.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A013 | Tickets não finalizados
-- Dificuldade: Fácil | Categoria: Filtros e ordenação
-- Tabelas: support_tickets
--
-- Liste os tickets que ainda estejam open ou in_progress, priorizando urgent, depois high,
-- medium e low.
--
-- Resultado esperado:
-- Tickets abertos/em andamento com ordenação de prioridade customizada.
--
-- Regras:
-- - Use CASE no ORDER BY.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A014 | Avaliações nota máxima
-- Dificuldade: Fácil | Categoria: Filtros e ordenação
-- Tabelas: reviews
--
-- Retorne as avaliações com nota 5, da mais recente para a mais antiga.
--
-- Resultado esperado:
-- Apenas rating = 5.
--
-- Regras:
-- - Mostre id, product_id, customer_id, comment e created_at.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A015 | Fornecedores excelentes
-- Dificuldade: Fácil | Categoria: Filtros e ordenação
-- Tabelas: suppliers
--
-- Liste fornecedores com rating maior ou igual a 4.5, do melhor avaliado para o pior.
--
-- Resultado esperado:
-- Colunas: id, name, country, rating.
--
-- Regras:
-- - Desempate pelo nome.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A016 | Margem por produto
-- Dificuldade: Fácil | Categoria: Filtros e ordenação
-- Tabelas: products
--
-- Mostre nome, price, cost e a margem bruta unitária de cada produto (price - cost).
--
-- Resultado esperado:
-- Coluna calculada gross_margin.
--
-- Regras:
-- - Ordene da maior margem para a menor.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A017 | Linhas de pedido acima de mil
-- Dificuldade: Fácil | Categoria: Filtros e ordenação
-- Tabelas: order_items
--
-- Retorne as linhas de pedido cujo line_total seja maior que 1000.
--
-- Resultado esperado:
-- Colunas: order_id, product_id, quantity, line_total.
--
-- Regras:
-- - Use a coluna gerada line_total.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A018 | PIX aprovado
-- Dificuldade: Fácil | Categoria: Filtros e ordenação
-- Tabelas: payments
--
-- Liste os pagamentos aprovados feitos via PIX.
--
-- Resultado esperado:
-- Colunas: id, order_id, amount, paid_at.
--
-- Regras:
-- - Use duas condições no WHERE.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A019 | Busca de clientes por nome
-- Dificuldade: Fácil | Categoria: Datas e texto
-- Tabelas: customers
--
-- Encontre clientes cujo nome contenha a sequência 01, sem depender de maiúsculas/minúsculas.
--
-- Resultado esperado:
-- Clientes cujo name contenha 01.
--
-- Regras:
-- - Use ILIKE.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A020 | Produtos inativos por categoria
-- Dificuldade: Fácil | Categoria: JOINs
-- Tabelas: categories, products
--
-- Conte quantos produtos inativos existem por categoria. Exiba apenas categorias com pelo
-- menos um produto inativo.
--
-- Resultado esperado:
-- Colunas: category, inactive_products.
--
-- Regras:
-- - Use JOIN, WHERE, GROUP BY.
--
-- SUA SOLUCAO:




-- ============================================================================
-- MÉDIO
-- ============================================================================

-- ----------------------------------------------------------------------------
-- A021 | Receita por canal
-- Dificuldade: Médio | Categoria: Agregações
-- Tabelas: vw_order_totals
--
-- Calcule a receita total por canal, desconsiderando pedidos cancelados.
--
-- Resultado esperado:
-- Colunas: channel, revenue. Receita com 2 casas decimais.
--
-- Regras:
-- - Use vw_order_totals.
-- - Ordene da maior receita para a menor.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A022 | Valor de compra por cliente
-- Dificuldade: Médio | Categoria: JOINs
-- Tabelas: customers, vw_order_totals
--
-- Retorne todos os clientes e quanto cada um já comprou em pedidos não cancelados. Clientes
-- sem compras devem aparecer com zero.
--
-- Resultado esperado:
-- Colunas: customer_id, name, total_spent. Todos os clientes.
--
-- Regras:
-- - Use LEFT JOIN.
-- - Preserve clientes sem pedidos.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A023 | Produtos sem avaliação de 1 estrela
-- Dificuldade: Médio | Categoria: Subqueries e CTEs
-- Tabelas: products, reviews
--
-- Liste os produtos que nunca receberam uma avaliação com rating = 1.
--
-- Resultado esperado:
-- Colunas: id, name. Nenhuma review nota 1 pode existir para o produto.
--
-- Regras:
-- - Resolva com NOT EXISTS.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A024 | Clientes sem pedido cancelado
-- Dificuldade: Médio | Categoria: Subqueries e CTEs
-- Tabelas: customers, orders
--
-- Encontre clientes que nunca tiveram um pedido com status cancelled.
--
-- Resultado esperado:
-- Colunas: id, name, email. Nenhum pedido cancelled pode existir para o cliente.
--
-- Regras:
-- - Use NOT EXISTS.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A025 | Top 10 produtos por receita
-- Dificuldade: Médio | Categoria: JOINs
-- Tabelas: products, order_items, orders
--
-- Calcule a receita gerada por produto em pedidos não cancelados e retorne os 10 maiores.
--
-- Resultado esperado:
-- Colunas: product_id, product_name, revenue.
--
-- Regras:
-- - Use line_total.
-- - Ignore status cancelled.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A026 | Tempo médio de resolução por prioridade
-- Dificuldade: Médio | Categoria: Datas e texto
-- Tabelas: support_tickets
--
-- Calcule quantas horas, em média, os tickets finalizados levam entre opened_at e closed_at,
-- agrupando por prioridade.
--
-- Resultado esperado:
-- Colunas: priority, avg_resolution_hours.
--
-- Regras:
-- - Ignore tickets com closed_at nulo.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A027 | Receita mensal
-- Dificuldade: Médio | Categoria: Datas e texto
-- Tabelas: vw_order_totals
--
-- Agrupe os pedidos não cancelados por mês e calcule a receita de cada mês.
--
-- Resultado esperado:
-- Colunas: month, revenue.
--
-- Regras:
-- - Use date_trunc.
-- - Ordene cronologicamente.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A028 | Ranking de vendedores
-- Dificuldade: Médio | Categoria: Window functions
-- Tabelas: employees, vw_order_totals
--
-- Calcule a receita por vendedor em pedidos não cancelados e atribua um ranking do maior para
-- o menor faturamento.
--
-- Resultado esperado:
-- Colunas: salesperson_id, name, revenue, revenue_rank.
--
-- Regras:
-- - Use RANK ou DENSE_RANK.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A029 | Clientes acima da média de LTV
-- Dificuldade: Médio | Categoria: Subqueries e CTEs
-- Tabelas: vw_customer_summary
--
-- Usando vw_customer_summary, retorne os clientes cujo lifetime_value seja maior que a média
-- de lifetime_value de todos os clientes.
--
-- Resultado esperado:
-- Colunas: customer_id, name, lifetime_value.
--
-- Regras:
-- - Use uma subquery escalar ou CTE.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A030 | Campeão de unidades por categoria
-- Dificuldade: Médio | Categoria: Window functions
-- Tabelas: categories, products, order_items, orders
--
-- Para cada categoria, encontre o produto com maior quantidade total vendida em pedidos não
-- cancelados. Empates podem retornar mais de um produto.
--
-- Resultado esperado:
-- Categoria, produto e units_sold do primeiro colocado.
--
-- Regras:
-- - Use DENSE_RANK ou RANK particionado por categoria.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A031 | Clientes recorrentes
-- Dificuldade: Médio | Categoria: Agregações
-- Tabelas: customers, orders
--
-- Liste clientes com pelo menos 5 pedidos não cancelados.
--
-- Resultado esperado:
-- Colunas: customer_id, name, order_count.
--
-- Regras:
-- - Use HAVING.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A032 | Pedido acima da média do próprio cliente
-- Dificuldade: Médio | Categoria: Window functions
-- Tabelas: vw_order_totals
--
-- Retorne os pedidos cujo total_amount seja maior que a média de pedidos não cancelados do
-- mesmo cliente.
--
-- Resultado esperado:
-- order_id, customer_id, total_amount, customer_avg.
--
-- Regras:
-- - Use AVG como window function.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A033 | Segundo maior salário por departamento
-- Dificuldade: Médio | Categoria: Window functions
-- Tabelas: departments, employees
--
-- Encontre o(s) funcionário(s) com o segundo maior salário de cada departamento. Considere
-- empates.
--
-- Resultado esperado:
-- department, employee_id, employee_name, salary.
--
-- Regras:
-- - Use DENSE_RANK.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A034 | Média móvel de 7 dias
-- Dificuldade: Médio | Categoria: Window functions
-- Tabelas: vw_order_totals
--
-- Calcule a receita diária de pedidos não cancelados e uma média móvel de 7 linhas/dias de
-- receita.
--
-- Resultado esperado:
-- day, daily_revenue, moving_avg_7.
--
-- Regras:
-- - Agregue por dia antes da janela.
-- - Use ROWS BETWEEN 6 PRECEDING AND CURRENT ROW.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A035 | Produtos bem avaliados
-- Dificuldade: Médio | Categoria: Agregações
-- Tabelas: products, reviews
--
-- Liste produtos com pelo menos 3 avaliações e média de rating maior ou igual a 4.
--
-- Resultado esperado:
-- product_id, product_name, review_count, avg_rating.
--
-- Regras:
-- - Use HAVING para as duas regras agregadas.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A036 | Taxa de aprovação por método
-- Dificuldade: Médio | Categoria: Agregações
-- Tabelas: payments
--
-- Calcule, por método de pagamento, o percentual de pagamentos com status approved.
--
-- Resultado esperado:
-- method, total_payments, approved_payments, approval_rate_pct.
--
-- Regras:
-- - Evite divisão inteira.
-- - Arredonde a taxa para 2 casas.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A037 | Primeira compra por cliente
-- Dificuldade: Médio | Categoria: Window functions
-- Tabelas: vw_order_totals
--
-- Retorne, para cada cliente que já comprou, somente o seu primeiro pedido não cancelado.
--
-- Resultado esperado:
-- customer_id, order_id, order_date, total_amount.
--
-- Regras:
-- - Use ROW_NUMBER.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A038 | Subordinados em todos os níveis
-- Dificuldade: Médio | Categoria: Subqueries e CTEs
-- Tabelas: employees
--
-- Partindo do funcionário id = 1, liste todos os subordinados diretos e indiretos, informando
-- o nível hierárquico.
--
-- Resultado esperado:
-- employee_id, name, manager_id, level.
--
-- Regras:
-- - Use WITH RECURSIVE.
-- - O CEO não precisa aparecer no resultado.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A039 | Garantia de pelo menos 12 meses
-- Dificuldade: Médio | Categoria: JSONB e arrays
-- Tabelas: products
--
-- Liste produtos cujo warranty_months armazenado em attributes seja maior ou igual a 12.
--
-- Resultado esperado:
-- id, name, warranty_months.
--
-- Regras:
-- - Converta o valor extraído do JSONB para inteiro.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A040 | Produtos premium no array
-- Dificuldade: Médio | Categoria: JSONB e arrays
-- Tabelas: products
--
-- Retorne os produtos cujo array tags contenha premium usando o operador de contenção de
-- arrays.
--
-- Resultado esperado:
-- id, name, tags.
--
-- Regras:
-- - Use @>.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A041 | Ranking de produtos dentro da categoria
-- Dificuldade: Médio | Categoria: Window functions
-- Tabelas: categories, products, order_items, orders
--
-- Calcule a receita de cada produto e seu ranking de receita dentro da própria categoria.
--
-- Resultado esperado:
-- category, product_id, product_name, revenue, category_rank.
--
-- Regras:
-- - Ignore pedidos cancelados.
-- - Use DENSE_RANK.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A042 | Clientes inativos há 180 dias
-- Dificuldade: Médio | Categoria: Datas e texto
-- Tabelas: vw_customer_summary, orders
--
-- Considere como data de referência a maior order_date existente. Liste clientes cuja última
-- compra não cancelada ocorreu há mais de 180 dias dessa data. Ignore clientes que nunca
-- compraram.
--
-- Resultado esperado:
-- customer_id, name, last_order_at, days_without_order.
--
-- Regras:
-- - Não use CURRENT_DATE; o dataset é histórico.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A043 | Participação dos canais em pedidos
-- Dificuldade: Médio | Categoria: Window functions
-- Tabelas: orders
--
-- Conte os pedidos por canal e calcule qual percentual cada canal representa do total de
-- pedidos.
--
-- Resultado esperado:
-- channel, order_count, pct_of_orders.
--
-- Regras:
-- - Use uma window function sobre o resultado agregado.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A044 | Clientes ativos em pelo menos 3 meses
-- Dificuldade: Médio | Categoria: Agregações
-- Tabelas: customers, orders
--
-- Liste clientes que tiveram pedidos não cancelados em pelo menos 3 meses distintos.
--
-- Resultado esperado:
-- customer_id, name, active_months.
--
-- Regras:
-- - Conte meses distintos.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A045 | Mediana do valor dos pedidos
-- Dificuldade: Médio | Categoria: Analytics avançado
-- Tabelas: vw_order_totals
--
-- Calcule a mediana de total_amount dos pedidos não cancelados.
--
-- Resultado esperado:
-- Uma coluna median_order_value.
--
-- Regras:
-- - Use percentile_cont.
--
-- SUA SOLUCAO:




-- ============================================================================
-- DIFÍCIL
-- ============================================================================

-- ----------------------------------------------------------------------------
-- A046 | Segmentação RFM em quartis
-- Dificuldade: Difícil | Categoria: Analytics avançado
-- Tabelas: customers, vw_order_totals
--
-- Calcule Recency, Frequency e Monetary por cliente usando apenas pedidos não cancelados. Use
-- como referência a maior data de pedido + 1 dia e crie quartis com NTILE(4) para cada
-- métrica. Em Recency, menos dias é melhor; em Frequency e Monetary, maiores valores são
-- melhores.
--
-- Resultado esperado:
-- customer_id, recency_days, frequency, monetary, r_score, f_score, m_score.
--
-- Regras:
-- - Clientes sem pedidos podem ser excluídos.
-- - Pontuação 4 deve representar melhor desempenho.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A047 | Top 3 produtos por categoria
-- Dificuldade: Difícil | Categoria: Window functions
-- Tabelas: categories, products, order_items, orders
--
-- Retorne os 3 produtos de maior receita dentro de cada categoria, ignorando pedidos
-- cancelados. Empates na mesma receita devem compartilhar a posição.
--
-- Resultado esperado:
-- category, product_id, product_name, revenue, rank.
--
-- Regras:
-- - Use DENSE_RANK.
-- - Não use LIMIT global.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A048 | Receita acumulada mês a mês
-- Dificuldade: Difícil | Categoria: Window functions
-- Tabelas: vw_order_totals
--
-- Calcule a receita mensal e a receita acumulada desde o primeiro mês até cada mês.
--
-- Resultado esperado:
-- month, monthly_revenue, cumulative_revenue.
--
-- Regras:
-- - Ignore cancelados.
-- - Use SUM como window function.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A049 | Receita móvel de 3 meses
-- Dificuldade: Difícil | Categoria: Window functions
-- Tabelas: vw_order_totals
--
-- Calcule a receita de cada mês e a soma móvel dos últimos 3 meses disponíveis, incluindo o
-- mês atual.
--
-- Resultado esperado:
-- month, monthly_revenue, rolling_3_month_revenue.
--
-- Regras:
-- - Use ROWS BETWEEN 2 PRECEDING AND CURRENT ROW.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A050 | Intervalo entre compras
-- Dificuldade: Difícil | Categoria: Window functions
-- Tabelas: vw_order_totals
--
-- Para cada pedido não cancelado de um cliente, mostre a data da compra anterior e quantos
-- dias se passaram desde ela.
--
-- Resultado esperado:
-- customer_id, order_id, order_date, previous_order_date, days_since_previous.
--
-- Regras:
-- - Use LAG.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A051 | Maior intervalo sem comprar
-- Dificuldade: Difícil | Categoria: Window functions
-- Tabelas: vw_order_totals
--
-- Encontre, para cada cliente com pelo menos duas compras não canceladas, o maior intervalo em
-- dias entre compras consecutivas.
--
-- Resultado esperado:
-- customer_id, max_gap_days.
--
-- Regras:
-- - Use LAG e agregação em etapas.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A052 | Do primeiro ao segundo pedido
-- Dificuldade: Difícil | Categoria: Window functions
-- Tabelas: vw_order_totals
--
-- Para cada cliente com pelo menos duas compras, calcule quantos dias se passaram entre a
-- primeira e a segunda compra não cancelada.
--
-- Resultado esperado:
-- customer_id, first_order_date, second_order_date, days_to_second_order.
--
-- Regras:
-- - Use ROW_NUMBER e agregação condicional ou LEAD.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A053 | Share de receita por categoria e mês
-- Dificuldade: Difícil | Categoria: Analytics avançado
-- Tabelas: orders, order_items, products, categories
--
-- Para cada mês e categoria, calcule a receita e o percentual que a categoria representa da
-- receita daquele mês.
--
-- Resultado esperado:
-- month, category, category_revenue, month_share_pct.
--
-- Regras:
-- - Ignore cancelados.
-- - Use uma window function particionada por mês.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A054 | Quebras de SLA por prioridade
-- Dificuldade: Difícil | Categoria: Datas e texto
-- Tabelas: support_tickets
--
-- Considere SLA de 72h para low, 48h para medium, 24h para high e 8h para urgent. Para tickets
-- fechados, conte quantos violaram o SLA em cada prioridade e calcule a taxa percentual de
-- violação.
--
-- Resultado esperado:
-- priority, closed_tickets, breached_tickets, breach_rate_pct.
--
-- Regras:
-- - Use CASE para definir o SLA.
-- - Somente closed_at não nulo.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A055 | Saldo teórico de movimentações
-- Dificuldade: Difícil | Categoria: Analytics avançado
-- Tabelas: products, inventory_movements
--
-- Some todas as quantity de inventory_movements por produto e compare com products.stock.
-- Retorne stock, movement_balance e a diferença stock - movement_balance.
--
-- Resultado esperado:
-- product_id, product_name, stock, movement_balance, difference.
--
-- Regras:
-- - Inclua produtos sem movimentações.
-- - Use COALESCE.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A056 | Caminho completo da hierarquia
-- Dificuldade: Difícil | Categoria: Subqueries e CTEs
-- Tabelas: employees
--
-- Construa a hierarquia completa de funcionários começando em quem não possui manager_id.
-- Retorne id, name, level e um caminho textual no formato CEO > Gerente > Funcionário.
--
-- Resultado esperado:
-- id, name, level, path.
--
-- Regras:
-- - Use WITH RECURSIVE.
-- - Ordene pelo path.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A057 | Clientes no percentil 90 de LTV
-- Dificuldade: Difícil | Categoria: Analytics avançado
-- Tabelas: vw_customer_summary
--
-- Calcule o percentil 90 de lifetime_value e retorne todos os clientes com LTV maior ou igual
-- a esse limite.
--
-- Resultado esperado:
-- customer_id, name, lifetime_value, p90_threshold.
--
-- Regras:
-- - Use percentile_cont(0.9).
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A058 | Produtos comprados juntos
-- Dificuldade: Difícil | Categoria: Analytics avançado
-- Tabelas: order_items, orders, products
--
-- Descubra os pares de produtos que aparecem juntos no mesmo pedido com maior frequência.
-- Conte cada par apenas uma vez por pedido e retorne os 15 pares mais frequentes.
--
-- Resultado esperado:
-- product_1_id, product_1_name, product_2_id, product_2_name, orders_together.
--
-- Regras:
-- - Ignore pedidos cancelados.
-- - Garanta product_1_id < product_2_id.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A059 | Retenção mensal por coorte
-- Dificuldade: Difícil | Categoria: Analytics avançado
-- Tabelas: vw_order_totals
--
-- Defina a coorte de cada cliente como o mês da primeira compra não cancelada. Para cada
-- coorte e mês de atividade, conte clientes ativos e calcule month_number como a diferença
-- aproximada em meses desde a coorte.
--
-- Resultado esperado:
-- cohort_month, activity_month, month_number, active_customers.
--
-- Regras:
-- - Use pelo menos duas CTEs.
-- - Conte clientes distintos por mês.
--
-- SUA SOLUCAO:



-- ----------------------------------------------------------------------------
-- A060 | Curva de Pareto da receita por produto
-- Dificuldade: Difícil | Categoria: Analytics avançado
-- Tabelas: products, order_items, orders
--
-- Calcule a receita de cada produto, sua participação percentual e o percentual acumulado da
-- receita total, ordenando do produto de maior receita para o menor. Identifique quais
-- produtos ficam dentro dos primeiros 80% acumulados.
--
-- Resultado esperado:
-- product_id, product_name, revenue, revenue_pct, cumulative_pct, in_first_80_pct.
--
-- Regras:
-- - Ignore cancelados.
-- - Use window functions para total e acumulado.
--
-- SUA SOLUCAO:



