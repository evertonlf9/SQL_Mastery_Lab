-- SQL MASTERY LAB - CADERNO DE PRÁTICA PARA DBEAVER
-- Selecione apenas a consulta que deseja executar e use Ctrl+Enter / Cmd+Enter.
-- As respostas completas dos desafios ficam escondidas na interface React.

-- 1) Primeiro SELECT
SELECT * FROM customers LIMIT 10;

-- 2) Colunas específicas + alias
SELECT id, name AS cliente, state AS uf, segment
FROM customers
ORDER BY id
LIMIT 15;

-- 3) Filtro
SELECT id, name, state, segment
FROM customers
WHERE state = 'SP' AND active = true;

-- 4) Agregação
SELECT state, COUNT(*) AS total_customers
FROM customers
GROUP BY state
ORDER BY total_customers DESC, state;

-- 5) JOIN
SELECT
    o.id AS order_id,
    c.name AS customer,
    o.order_date,
    o.status
FROM orders o
JOIN customers c ON c.id = o.customer_id
ORDER BY o.order_date DESC
LIMIT 20;

-- 6) JOIN + GROUP BY
SELECT
    c.id,
    c.name,
    COUNT(v.order_id) AS orders,
    COALESCE(SUM(v.total_amount), 0) AS revenue
FROM customers c
LEFT JOIN vw_order_totals v ON v.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY revenue DESC
LIMIT 20;

-- 7) CROSS JOIN: grade categoria x canal
SELECT
    c.name AS category,
    ch.channel
FROM categories c
CROSS JOIN (
    SELECT DISTINCT channel
    FROM orders
) AS ch
ORDER BY category, ch.channel;

-- 8) FULL JOIN: comparação entre dois conjuntos
WITH buyers AS (
    SELECT DISTINCT customer_id
    FROM orders
),
ticket_customers AS (
    SELECT DISTINCT customer_id
    FROM support_tickets
)
SELECT
    COALESCE(b.customer_id, t.customer_id) AS customer_id,
    b.customer_id IS NOT NULL AS has_order,
    t.customer_id IS NOT NULL AS has_ticket
FROM buyers b
FULL JOIN ticket_customers t ON t.customer_id = b.customer_id
ORDER BY customer_id;

-- 9) EPOCH: converter intervalo entre timestamps para segundos/horas
SELECT
    id,
    closed_at - opened_at AS duration,
    EXTRACT(EPOCH FROM (closed_at - opened_at)) AS seconds,
    ROUND((EXTRACT(EPOCH FROM (closed_at - opened_at)) / 3600.0)::numeric, 2) AS hours
FROM support_tickets
WHERE closed_at IS NOT NULL
ORDER BY id
LIMIT 10;

-- 10) Window function
SELECT
    customer_id,
    order_id,
    order_date,
    total_amount,
    SUM(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date, order_id
    ) AS running_total
FROM vw_order_totals
WHERE status <> 'cancelled'
ORDER BY customer_id, order_date, order_id;

-- 11) JSONB
SELECT id, name, attributes->>'color' AS color
FROM products
WHERE attributes @> '{"color":"preto"}'::jsonb;

-- 12) Array
SELECT id, name, tags
FROM products
WHERE tags @> ARRAY['premium'];

-- 13) EXPLAIN ANALYZE
EXPLAIN (ANALYZE, BUFFERS)
SELECT *
FROM orders
WHERE customer_id = 10
ORDER BY order_date DESC;

-- DICA: use db/init/01_lab.sql para restaurar o banco inteiro ao estado inicial.
