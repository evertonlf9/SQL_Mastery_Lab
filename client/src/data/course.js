const lesson = (id, title, level, objective, theory, syntax, examples, challenges, dbeaverTip = '') => ({
  id, title, level, objective, theory, syntax, examples, challenges, dbeaverTip,
});

const knownQuerySources = [
  'departments',
  'employees',
  'customers',
  'categories',
  'suppliers',
  'products',
  'orders',
  'order_items',
  'payments',
  'reviews',
  'support_tickets',
  'inventory_movements',
  'vw_order_totals',
  'vw_customer_summary',
];

const detectTables = (sql = '') => knownQuerySources.filter((table) => (
  new RegExp(`\\b${table}\\b`, 'i').test(sql)
));

const challenge = (id, title, difficulty, prompt, hint, solution, explanation) => ({
  id, title, difficulty, prompt, hint, solution, explanation, tables: detectTables(solution),
});

export const courseModules = [
  {
    id: 'm00', number: '00', title: 'Fundamentos: banco de dados e SQL', level: 'Iniciante',
    description: 'Entenda o que é um banco relacional, tabela, linha, coluna, chave e como pensar antes de escrever SQL.',
    lessons: [
      lesson('m00l01', 'O que é SQL e como enxergar um banco relacional', 'Iniciante',
        'Construir o modelo mental necessário antes do primeiro comando.',
        [
          'SQL (Structured Query Language) é a linguagem usada para consultar e manipular bancos relacionais. No PostgreSQL, você usa SQL para ler dados, inserir registros, alterar estruturas, controlar transações e administrar objetos.',
          'Pense em uma tabela como um conjunto de registros do mesmo tipo. Cada linha representa uma ocorrência e cada coluna representa um atributo. A tabela customers, por exemplo, guarda um cliente por linha.',
          'Uma chave primária (PRIMARY KEY) identifica uma linha de forma única. Uma chave estrangeira (FOREIGN KEY) conecta uma tabela a outra. orders.customer_id aponta para customers.id e representa a relação “um cliente possui muitos pedidos”.',
          'Antes de escrever uma consulta, traduza a pergunta de negócio em quatro partes: de quais tabelas preciso, quais colunas quero, quais linhas devo filtrar e como o resultado deve ser organizado.'
        ],
        `-- Anatomia conceitual\nSELECT colunas\nFROM tabela\nWHERE condição\nORDER BY coluna;`,
        [
          { title: 'Inspecionando a primeira tabela', sql: `SELECT *\nFROM customers\nLIMIT 5;`, explanation: 'SELECT escolhe o que retornar, FROM indica a origem e LIMIT restringe a quantidade de linhas mostradas.' },
          { title: 'Relacionamento básico', sql: `SELECT o.id, o.customer_id, c.name\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nLIMIT 10;`, explanation: 'O JOIN usa a chave estrangeira para combinar cada pedido com o cliente correspondente.' }
        ],
        [
          challenge('c001', 'Reconheça a tabela', 'Muito fácil', 'Liste as 10 primeiras linhas de products com todas as colunas.', 'Use SELECT *, FROM products e LIMIT.', `SELECT *\nFROM products\nLIMIT 10;`, 'O asterisco retorna todas as colunas da origem. Em produção, normalmente é melhor selecionar apenas as colunas necessárias.'),
          challenge('c002', 'Leia o esquema', 'Muito fácil', 'No DBeaver, abra a tabela orders e identifique a chave primária e as duas chaves estrangeiras principais.', 'Veja a seção Constraints/Foreign Keys do DBeaver.', `-- Resposta conceitual:\n-- PK: orders.id\n-- FK: orders.customer_id -> customers.id\n-- FK: orders.salesperson_id -> employees.id`, 'A PK identifica o pedido. As FKs relacionam o pedido ao cliente e ao vendedor.')
        ],
        'Use o Database Navigator do DBeaver para abrir Schemas > public > Tables. A aba Properties ajuda a visualizar colunas, tipos e constraints.'),
      lesson('m00l02', 'Categorias de comandos: DQL, DML, DDL, DCL e TCL', 'Iniciante',
        'Saber que tipo de efeito cada comando SQL pode causar.',
        [
          'DQL é a parte de consulta, principalmente SELECT. DML manipula dados: INSERT, UPDATE e DELETE. DDL define estrutura: CREATE, ALTER, DROP e TRUNCATE.',
          'TCL controla transações: BEGIN, COMMIT, ROLLBACK e SAVEPOINT. DCL trata permissões: GRANT e REVOKE.',
          'Essa classificação é útil porque deixa claro o risco de cada instrução. SELECT normalmente apenas lê; UPDATE e DELETE podem modificar muitas linhas; DROP pode remover um objeto inteiro.',
          'Neste laboratório existe um script de reset. Mesmo assim, crie o hábito de testar o WHERE com SELECT antes de executar UPDATE ou DELETE.'
        ],
        `-- DQL\nSELECT ...;\n-- DML\nINSERT ...; UPDATE ...; DELETE ...;\n-- DDL\nCREATE ...; ALTER ...; DROP ...;\n-- TCL\nBEGIN; COMMIT; ROLLBACK;`,
        [{ title: 'Padrão seguro antes de UPDATE', sql: `SELECT id, name, active\nFROM customers\nWHERE id = 11;\n\n-- Só depois:\nUPDATE customers\nSET active = false\nWHERE id = 11;`, explanation: 'Primeiro confirme quais linhas serão afetadas. Depois reutilize exatamente o mesmo filtro.' }],
        [challenge('c003', 'Classifique os comandos', 'Fácil', 'Classifique SELECT, INSERT, CREATE TABLE, COMMIT e GRANT nas categorias estudadas.', 'DQL lê; DML muda linhas; DDL muda estrutura; TCL controla transações; DCL controla privilégios.', `SELECT -> DQL\nINSERT -> DML\nCREATE TABLE -> DDL\nCOMMIT -> TCL\nGRANT -> DCL`, 'A classificação ajuda a antecipar o impacto da operação.')]
      )
    ]
  },
  {
    id: 'm01', number: '01', title: 'SELECT: sua primeira consulta', level: 'Iniciante',
    description: 'Selecione colunas, crie aliases, remova duplicidades e limite resultados.',
    lessons: [
      lesson('m01l01', 'SELECT, FROM e aliases com AS', 'Iniciante', 'Consultar colunas específicas e melhorar os nomes exibidos.',
        [
          'SELECT define as expressões e colunas que aparecem no resultado. FROM define a fonte. Uma consulta pode retornar colunas físicas ou expressões calculadas.',
          'AS cria um alias, isto é, um nome temporário para uma coluna ou tabela no resultado. Aliases tornam consultas longas mais legíveis.',
          'Evite SELECT * quando você já sabe de quais dados precisa. Selecionar explicitamente as colunas documenta a intenção e evita transportar dados desnecessários.'
        ],
        `SELECT coluna1 AS apelido, coluna2\nFROM tabela AS t;`,
        [
          { title: 'Colunas específicas', sql: `SELECT id, name, email, state\nFROM customers;`, explanation: 'Retorna somente quatro colunas da tabela customers.' },
          { title: 'Expressão calculada', sql: `SELECT name, price, cost,\n       price - cost AS gross_margin\nFROM products;`, explanation: 'A expressão é calculada para cada linha e recebe o alias gross_margin.' }
        ],
        [
          challenge('c004', 'Catálogo simples', 'Fácil', 'Liste sku, nome e preço de todos os produtos. Renomeie name para product_name e price para unit_price.', 'Use AS depois das colunas.', `SELECT sku,\n       name AS product_name,\n       price AS unit_price\nFROM products;`, 'Aliases não alteram a tabela; apenas o nome exibido no resultado.'),
          challenge('c005', 'Margem bruta', 'Fácil', 'Mostre nome, preço, custo e margem bruta (preço - custo) dos produtos.', 'Crie uma expressão aritmética no SELECT.', `SELECT name, price, cost,\n       price - cost AS gross_margin\nFROM products;`, 'Operações aritméticas podem ser tratadas como qualquer outra expressão do SELECT.')
        ], 'No DBeaver, selecione apenas um trecho SQL e pressione Ctrl+Enter (Windows/Linux) ou Cmd+Enter (macOS) para executar somente aquele trecho.'),
      lesson('m01l02', 'DISTINCT e LIMIT', 'Iniciante', 'Eliminar duplicidades e controlar o tamanho do resultado.',
        [
          'DISTINCT remove linhas duplicadas considerando todas as expressões selecionadas. SELECT DISTINCT state retorna uma ocorrência de cada estado.',
          'LIMIT restringe o número máximo de linhas retornadas. É muito útil para explorar uma tabela grande sem carregar tudo.',
          'LIMIT sem ORDER BY não significa “os primeiros” em uma ordem garantida. Quando a ordem importa, use ORDER BY.'
        ],
        `SELECT DISTINCT coluna\nFROM tabela\nORDER BY coluna\nLIMIT 10;`,
        [{ title: 'Estados atendidos', sql: `SELECT DISTINCT state\nFROM customers\nORDER BY state;`, explanation: 'A combinação DISTINCT + ORDER BY cria uma lista única e ordenada.' }],
        [
          challenge('c006', 'Canais de venda', 'Fácil', 'Liste todos os canais de venda existentes em orders sem repetir valores.', 'DISTINCT channel.', `SELECT DISTINCT channel\nFROM orders\nORDER BY channel;`, 'DISTINCT remove repetições no conjunto selecionado.'),
          challenge('c007', 'Amostra de produtos', 'Fácil', 'Mostre apenas 8 produtos com id, sku e name.', 'Use LIMIT 8.', `SELECT id, sku, name\nFROM products\nORDER BY id\nLIMIT 8;`, 'ORDER BY torna a amostra determinística.')
        ]
      )
    ]
  },
  {
    id: 'm02', number: '02', title: 'WHERE: filtrando dados', level: 'Iniciante',
    description: 'Domine comparações, lógica booleana, NULL, IN, BETWEEN e LIKE.',
    lessons: [
      lesson('m02l01', 'WHERE, operadores e AND/OR/NOT', 'Iniciante', 'Filtrar exatamente as linhas que respondem à pergunta.',
        [
          'WHERE é avaliado linha a linha antes do resultado final. Operadores comuns: =, <>, !=, >, >=, < e <=.',
          'AND exige que todas as condições ligadas sejam verdadeiras. OR exige ao menos uma. NOT inverte uma condição.',
          'AND tem precedência sobre OR. Quando a regra de negócio mistura ambos, use parênteses para deixar a intenção explícita.'
        ],
        `SELECT ...\nFROM ...\nWHERE condição_a\n  AND (condição_b OR condição_c);`,
        [{ title: 'Filtro composto', sql: `SELECT id, name, state, segment\nFROM customers\nWHERE active = true\n  AND state = 'SP'\n  AND segment IN ('gold', 'platinum');`, explanation: 'Somente clientes ativos de SP e dos segmentos gold/platinum passam pelas três condições.' }],
        [
          challenge('c008', 'Produtos vendáveis', 'Fácil', 'Liste produtos ativos com estoque maior que 20 e preço menor que 300.', 'Três condições ligadas por AND.', `SELECT id, name, price, stock\nFROM products\nWHERE active = true\n  AND stock > 20\n  AND price < 300;`, 'AND restringe progressivamente o conjunto de linhas.'),
          challenge('c009', 'Prioridade comercial', 'Fácil', 'Liste clientes ativos que sejam gold OU platinum e estejam em SP ou RJ.', 'Agrupe os OR com parênteses.', `SELECT id, name, state, segment\nFROM customers\nWHERE active = true\n  AND segment IN ('gold','platinum')\n  AND state IN ('SP','RJ');`, 'IN é mais legível que vários OR para a mesma coluna.')
        ]
      ),
      lesson('m02l02', 'IN, BETWEEN, LIKE e ILIKE', 'Iniciante', 'Escrever filtros de listas, faixas e padrões de texto.',
        [
          'IN testa se um valor pertence a uma lista. BETWEEN inclui os limites inicial e final. Para datas e timestamps, muitas vezes uma faixa >= início e < próximo período é mais segura.',
          'LIKE compara padrões: % representa qualquer sequência e _ representa um único caractere. No PostgreSQL, ILIKE faz comparação sem diferenciar maiúsculas e minúsculas.',
          'Padrões iniciados com % podem ser caros em grandes volumes porque dificultam o uso de índices B-tree tradicionais.'
        ],
        `WHERE coluna IN (...)\nWHERE valor BETWEEN mínimo AND máximo\nWHERE texto ILIKE '%trecho%'`,
        [{ title: 'Faixa de preço', sql: `SELECT name, price\nFROM products\nWHERE price BETWEEN 100 AND 250\nORDER BY price;`, explanation: 'BETWEEN inclui 100 e 250.' }],
        [
          challenge('c010', 'Busca textual', 'Fácil', 'Encontre produtos cujo nome contenha a palavra “Livro”, ignorando maiúsculas/minúsculas.', 'Use ILIKE com %.', `SELECT id, name\nFROM products\nWHERE name ILIKE '%livro%';`, 'ILIKE é uma extensão conveniente do PostgreSQL para comparação case-insensitive.'),
          challenge('c011', 'Pedidos em período', 'Médio', 'Liste pedidos feitos durante abril de 2025.', 'Para timestamp, prefira >= 2025-04-01 e < 2025-05-01.', `SELECT id, customer_id, order_date, status\nFROM orders\nWHERE order_date >= TIMESTAMP '2025-04-01'\n  AND order_date <  TIMESTAMP '2025-05-01'\nORDER BY order_date;`, 'O intervalo semiaberto evita problemas com horas, minutos e frações de segundo no último dia.')
        ]
      ),
      lesson('m02l03', 'NULL, IS NULL e COALESCE', 'Iniciante', 'Entender ausência de valor e evitar comparações incorretas.',
        [
          'NULL significa valor desconhecido ou ausente; não é zero nem string vazia. Como NULL não é um valor comum, coluna = NULL não funciona como se espera.',
          'Use IS NULL ou IS NOT NULL. COALESCE retorna o primeiro argumento não nulo e é útil para apresentar um valor padrão.',
          'A lógica SQL possui três estados: TRUE, FALSE e UNKNOWN. Comparações envolvendo NULL geralmente resultam em UNKNOWN e não passam pelo WHERE.'
        ],
        `WHERE coluna IS NULL\nCOALESCE(coluna, valor_padrao)`,
        [{ title: 'Tickets ainda abertos', sql: `SELECT id, status, opened_at, closed_at\nFROM support_tickets\nWHERE closed_at IS NULL;`, explanation: 'closed_at nulo indica que o ticket ainda não recebeu data de encerramento.' }],
        [challenge('c012', 'Data de pagamento amigável', 'Médio', 'Mostre order_id, status e paid_at dos pagamentos, exibindo o texto “não pago” quando paid_at for nulo.', 'Converta paid_at para texto e use COALESCE.', `SELECT order_id, status,\n       COALESCE(paid_at::text, 'não pago') AS paid_at_display\nFROM payments;`, 'O cast ::text deixa ambos os argumentos do COALESCE compatíveis.')]
      )
    ]
  },
  {
    id: 'm03', number: '03', title: 'Ordenação, expressões e CASE', level: 'Iniciante',
    description: 'Organize resultados e transforme dados diretamente na consulta.',
    lessons: [
      lesson('m03l01', 'ORDER BY, ASC, DESC e NULLS', 'Iniciante', 'Controlar a ordem final do resultado.',
        [
          'ORDER BY é uma das últimas etapas lógicas da consulta. ASC é crescente e padrão; DESC é decrescente.',
          'Você pode ordenar por várias expressões. A segunda só desempata linhas iguais na primeira.',
          'PostgreSQL permite NULLS FIRST e NULLS LAST para controlar explicitamente onde valores nulos aparecem.'
        ],
        `ORDER BY coluna1 DESC, coluna2 ASC NULLS LAST`,
        [{ title: 'Produtos caros primeiro', sql: `SELECT name, price, stock\nFROM products\nORDER BY price DESC, name ASC\nLIMIT 10;`, explanation: 'Primeiro ordena por preço decrescente; nomes desempatarão preços iguais.' }],
        [challenge('c013', 'Últimos pedidos', 'Fácil', 'Mostre os 20 pedidos mais recentes.', 'ORDER BY order_date DESC + LIMIT.', `SELECT id, customer_id, order_date, status\nFROM orders\nORDER BY order_date DESC\nLIMIT 20;`, 'DESC coloca os timestamps maiores (mais recentes) primeiro.')]
      ),
      lesson('m03l02', 'CASE e colunas calculadas', 'Intermediário', 'Criar classificações condicionais sem alterar os dados armazenados.',
        [
          'CASE é a expressão condicional do SQL. Ela percorre WHENs e retorna o primeiro resultado cuja condição seja verdadeira.',
          'Você pode usar CASE em SELECT, ORDER BY, agregações e várias outras expressões.',
          'Quando nenhuma condição é atendida, ELSE define o valor de fallback. Se ELSE for omitido, o resultado é NULL.'
        ],
        `CASE\n  WHEN condição THEN resultado\n  WHEN outra_condição THEN outro_resultado\n  ELSE fallback\nEND`,
        [{ title: 'Faixa de preço', sql: `SELECT name, price,\n       CASE\n         WHEN price < 100 THEN 'baixo'\n         WHEN price < 400 THEN 'médio'\n         ELSE 'alto'\n       END AS price_band\nFROM products;`, explanation: 'As condições são avaliadas em ordem; price < 400 só é testado após falhar price < 100.' }],
        [
          challenge('c014', 'Classifique estoque', 'Médio', 'Classifique produtos em crítico (<15), atenção (<35) e saudável (demais).', 'CASE com dois WHEN e ELSE.', `SELECT id, name, stock,\n       CASE\n         WHEN stock < 15 THEN 'crítico'\n         WHEN stock < 35 THEN 'atenção'\n         ELSE 'saudável'\n       END AS stock_health\nFROM products\nORDER BY stock;`, 'A ordem dos WHENs é essencial para que a faixa menor seja avaliada primeiro.'),
          challenge('c015', 'Ordenação de prioridade', 'Médio', 'Liste tickets abertos/in_progress com urgent primeiro, depois high, medium e low.', 'Crie uma ordem numérica com CASE no ORDER BY.', `SELECT id, priority, status, opened_at\nFROM support_tickets\nWHERE status IN ('open','in_progress')\nORDER BY CASE priority\n           WHEN 'urgent' THEN 1\n           WHEN 'high' THEN 2\n           WHEN 'medium' THEN 3\n           ELSE 4\n         END, opened_at;`, 'CASE permite impor uma ordem de negócio que não coincide com a ordem alfabética.')
        ]
      )
    ]
  },
  {
    id: 'm04', number: '04', title: 'Funções de texto, número e data', level: 'Intermediário',
    description: 'Formate, normalize, calcule e extraia informações de valores.',
    lessons: [
      lesson('m04l01', 'Texto: LOWER, UPPER, LENGTH, CONCAT e SUBSTRING', 'Intermediário', 'Manipular strings sem sair do SQL.',
        [
          'LOWER e UPPER normalizam caixa; LENGTH mede caracteres; TRIM remove espaços das extremidades; CONCAT ou || concatenam valores.',
          'SUBSTRING extrai parte do texto. REPLACE substitui trechos. Essas funções são úteis para limpeza, relatórios e preparação de dados.',
          'Cuidado ao aplicar função sobre coluna filtrada em tabelas grandes: isso pode impedir o uso de um índice comum, a menos que exista um índice funcional.'
        ],
        `LOWER(texto)\nUPPER(texto)\nLENGTH(texto)\ntexto1 || texto2\nSUBSTRING(texto FROM início FOR tamanho)`,
        [{ title: 'Rótulo do cliente', sql: `SELECT id,\n       UPPER(name) || ' - ' || state AS label,\n       LENGTH(email) AS email_length\nFROM customers\nLIMIT 10;`, explanation: 'Duas funções e concatenação geram novas colunas calculadas.' }],
        [challenge('c016', 'Domínio de e-mail', 'Médio', 'Extraia o domínio do e-mail dos clientes usando split_part.', 'split_part(email, @, 2).', `SELECT id, email,\n       split_part(email, '@', 2) AS email_domain\nFROM customers;`, 'split_part divide o texto por um delimitador e retorna a parte indicada.')]
      ),
      lesson('m04l02', 'Datas: EXTRACT, DATE_TRUNC, AGE e intervalos', 'Intermediário', 'Agrupar e calcular tempo corretamente.',
        [
          'EXTRACT retira componentes como ano e mês. DATE_TRUNC reduz um timestamp a uma granularidade, por exemplo mês ou dia.',
          'AGE calcula um intervalo simbólico entre datas. Intervalos podem ser somados e subtraídos de timestamps.',
          'EPOCH é uma unidade especial do EXTRACT. Quando aplicado a um intervalo, retorna a duração total em segundos; por isso EXTRACT(EPOCH FROM (closed_at - opened_at)) / 3600 transforma a diferença entre duas datas em horas.',
          'Quando aplicado a um timestamp, EPOCH retorna a quantidade de segundos desde 1970-01-01 00:00:00 UTC. Para métricas de duração no curso, o uso mais importante é com intervalos.',
          'Em relatórios mensais, DATE_TRUNC é uma das funções mais importantes porque cria uma chave temporal consistente.'
        ],
        `DATE_TRUNC('month', timestamp)\nEXTRACT(YEAR FROM data)\nEXTRACT(EPOCH FROM intervalo) -- segundos totais\nAGE(data_final, data_inicial)`,
        [
          { title: 'Pedidos por mês - base', sql: `SELECT date_trunc('month', order_date) AS month, id\nFROM orders\nORDER BY month, id;`, explanation: 'Cada timestamp passa a representar o primeiro instante do respectivo mês.' },
          { title: 'EPOCH em segundos, horas e dias', sql: `SELECT id,\n       closed_at - opened_at AS duration,\n       EXTRACT(EPOCH FROM (closed_at - opened_at)) AS seconds,\n       ROUND((EXTRACT(EPOCH FROM (closed_at - opened_at)) / 3600.0)::numeric, 2) AS hours,\n       ROUND((EXTRACT(EPOCH FROM (closed_at - opened_at)) / 86400.0)::numeric, 2) AS days\nFROM support_tickets\nWHERE closed_at IS NOT NULL\nORDER BY id\nLIMIT 10;`, explanation: 'A subtração de timestamps gera um interval. EPOCH transforma esse interval em segundos totais; depois dividimos por 3600 para horas ou 86400 para dias.' }
        ],
        [
          challenge('c017', 'Ano de cadastro', 'Fácil', 'Mostre cliente, signup_date e ano de cadastro.', 'EXTRACT(YEAR FROM signup_date).', `SELECT name, signup_date,\n       EXTRACT(YEAR FROM signup_date)::int AS signup_year\nFROM customers;`, 'EXTRACT retorna um valor numérico que pode ser convertido para integer.'),
          challenge('c018', 'Tempo de resolução', 'Médio', 'Para tickets encerrados, mostre quantas horas se passaram entre opened_at e closed_at.', 'Subtraia os timestamps. O resultado é um interval; EXTRACT(EPOCH FROM interval) devolve segundos totais. Divida por 3600.0 para obter horas.', `SELECT id,\n       round((EXTRACT(EPOCH FROM (closed_at - opened_at)) / 3600.0)::numeric, 2) AS resolution_hours\nFROM support_tickets\nWHERE closed_at IS NOT NULL;`, 'closed_at - opened_at gera um interval. EXTRACT(EPOCH FROM interval) converte toda a duração para segundos; dividir por 3600.0 transforma segundos em horas com casas decimais.')
        ]
      )
    ]
  },
  {
    id: 'm05', number: '05', title: 'Agregações: COUNT, SUM, AVG, GROUP BY e HAVING', level: 'Intermediário',
    description: 'Resuma muitas linhas em métricas de negócio.',
    lessons: [
      lesson('m05l01', 'Funções agregadoras', 'Intermediário', 'Calcular contagens, totais, médias, mínimos e máximos.',
        [
          'COUNT(*) conta linhas. COUNT(coluna) ignora NULL. COUNT(DISTINCT coluna) conta valores distintos não nulos.',
          'SUM soma, AVG calcula média, MIN e MAX encontram extremos. Essas funções recebem várias linhas e produzem um único valor por grupo.',
          'COALESCE é útil quando uma agregação sobre nenhum registro pode retornar NULL, como SUM em um LEFT JOIN.'
        ],
        `SELECT COUNT(*), SUM(valor), AVG(valor), MIN(valor), MAX(valor)\nFROM tabela;`,
        [{ title: 'Resumo do catálogo', sql: `SELECT COUNT(*) AS products,\n       round(AVG(price), 2) AS avg_price,\n       MIN(price) AS min_price,\n       MAX(price) AS max_price\nFROM products;`, explanation: 'Sem GROUP BY, toda a tabela forma um único grupo.' }],
        [challenge('c019', 'Resumo de salários', 'Fácil', 'Calcule quantidade de funcionários ativos, salário médio, menor e maior salário.', 'Filtre active antes de agregar.', `SELECT COUNT(*) AS active_employees,\n       round(AVG(salary), 2) AS avg_salary,\n       MIN(salary) AS min_salary,\n       MAX(salary) AS max_salary\nFROM employees\nWHERE active = true;`, 'WHERE filtra linhas antes das agregações.')]
      ),
      lesson('m05l02', 'GROUP BY e HAVING', 'Intermediário', 'Criar métricas por categoria e filtrar grupos.',
        [
          'GROUP BY cria um grupo para cada combinação distinta das colunas agrupadas. Toda expressão do SELECT que não é agregada precisa pertencer ao agrupamento ou ser funcionalmente dependente dele.',
          'WHERE filtra linhas antes do agrupamento. HAVING filtra grupos depois de as agregações serem calculadas.',
          'A ordem mental é: FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT.'
        ],
        `SELECT grupo, COUNT(*)\nFROM tabela\nWHERE ...\nGROUP BY grupo\nHAVING COUNT(*) > ...\nORDER BY ...;`,
        [{ title: 'Clientes por estado', sql: `SELECT state, COUNT(*) AS customers\nFROM customers\nGROUP BY state\nORDER BY customers DESC, state;`, explanation: 'Cada estado vira um grupo independente.' }],
        [
          challenge('c020', 'Ticket por prioridade', 'Médio', 'Conte tickets por priority e status.', 'Agrupe por duas colunas.', `SELECT priority, status, COUNT(*) AS tickets\nFROM support_tickets\nGROUP BY priority, status\nORDER BY priority, status;`, 'Cada combinação priority/status forma um grupo.'),
          challenge('c021', 'Categorias relevantes', 'Médio', 'Mostre category_id e preço médio apenas das categorias cujo preço médio seja maior que 350.', 'AVG(price) no SELECT e HAVING.', `SELECT category_id,\n       round(AVG(price), 2) AS avg_price\nFROM products\nGROUP BY category_id\nHAVING AVG(price) > 350\nORDER BY avg_price DESC;`, 'HAVING pode usar a agregação diretamente para eliminar grupos.')
        ]
      ),
      lesson('m05l03', 'FILTER e agregação condicional', 'Avançado', 'Calcular várias métricas condicionais em uma única passagem.',
        [
          'PostgreSQL permite FILTER (WHERE ...) em agregações. Assim, você calcula contagens ou somas condicionais sem criar várias subconsultas.',
          'É especialmente útil em dashboards: total, concluídos, cancelados e pendentes podem sair da mesma consulta.',
          'A alternativa clássica é SUM(CASE WHEN ... THEN 1 ELSE 0 END). FILTER costuma ser mais legível.'
        ],
        `COUNT(*) FILTER (WHERE condição)`,
        [{ title: 'Status em colunas', sql: `SELECT\n  COUNT(*) AS total,\n  COUNT(*) FILTER (WHERE status = 'delivered') AS delivered,\n  COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled\nFROM orders;`, explanation: 'Cada agregação enxerga apenas as linhas que passam no seu FILTER.' }],
        [challenge('c022', 'Saúde dos pagamentos', 'Avançado', 'Em uma linha, conte todos os pagamentos, approved, pending, refunded e failed.', 'Use cinco COUNTs, quatro com FILTER.', `SELECT\n  COUNT(*) AS total,\n  COUNT(*) FILTER (WHERE status = 'approved') AS approved,\n  COUNT(*) FILTER (WHERE status = 'pending') AS pending,\n  COUNT(*) FILTER (WHERE status = 'refunded') AS refunded,\n  COUNT(*) FILTER (WHERE status = 'failed') AS failed\nFROM payments;`, 'FILTER transforma uma consulta de agregação em um pequeno painel de métricas.')]
      )
    ]
  },
  {
    id: 'm06', number: '06', title: 'JOINs: conectando tabelas', level: 'Intermediário',
    description: 'Domine INNER, LEFT, CROSS, FULL e auto-joins usando as relações do banco.',
    lessons: [
      lesson('m06l01', 'INNER JOIN e múltiplos JOINs', 'Intermediário', 'Combinar dados relacionados de várias tabelas.',
        [
          'INNER JOIN retorna apenas linhas que encontram correspondência dos dois lados. A condição ON normalmente compara PK com FK.',
          'Use aliases curtos e claros para evitar ambiguidades: orders o, customers c, order_items oi.',
          'Ao juntar relações 1:N, uma linha do lado 1 se repete para cada linha relacionada. Isso é correto, mas muda a granularidade do resultado.',
          'Antes de escrever a consulta, nomeie as tabelas: a tabela principal responde “uma linha de quê?”; as demais trazem atributos, métricas ou filtros relacionados.'
        ],
        `FROM tabela_a a\nJOIN tabela_b b ON b.id = a.b_id`,
        [{ title: 'Pedido + cliente', sql: `SELECT o.id, o.order_date, o.status, c.name AS customer\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nORDER BY o.id\nLIMIT 20;`, explanation: 'Cada pedido encontra exatamente um cliente.' }],
        [
          challenge('c023', 'Item completo', 'Médio', 'Liste order_id, produto, quantidade, unit_price e line_total dos 30 primeiros itens.', 'order_items JOIN products.', `SELECT oi.order_id, p.name AS product,\n       oi.quantity, oi.unit_price, oi.line_total\nFROM order_items oi\nJOIN products p ON p.id = oi.product_id\nORDER BY oi.id\nLIMIT 30;`, 'O item guarda product_id; o nome vem da tabela products.'),
          challenge('c024', 'Pedido detalhado', 'Médio', 'Mostre pedido, cliente, vendedor e total usando orders, customers, employees e vw_order_totals.', 'Três JOINs a partir de orders.', `SELECT o.id AS order_id,\n       c.name AS customer,\n       e.name AS salesperson,\n       v.total_amount\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nLEFT JOIN employees e ON e.id = o.salesperson_id\nJOIN vw_order_totals v ON v.order_id = o.id\nORDER BY o.id;`, 'LEFT JOIN no vendedor preserva o pedido mesmo se salesperson_id for nulo.')
        ]
      ),
      lesson('m06l02', 'LEFT JOIN e registros sem correspondência', 'Intermediário', 'Preservar a tabela principal e localizar ausências.',
        [
          'LEFT JOIN mantém todas as linhas da tabela da esquerda. Quando não há correspondência, as colunas da direita recebem NULL.',
          'Esse padrão permite descobrir “clientes sem pedidos”, “produtos sem avaliações” e outras lacunas.',
          'Cuidado ao filtrar a tabela direita no WHERE: isso pode transformar, na prática, um LEFT JOIN em INNER JOIN. Quando o filtro faz parte da correspondência, coloque-o no ON.',
          'Use LEFT JOIN quando a ausência também é uma resposta importante. Se você precisa listar todos os produtos, mesmo sem review, products deve ficar à esquerda.'
        ],
        `FROM esquerda e\nLEFT JOIN direita d ON ...\nWHERE d.id IS NULL`,
        [{ title: 'Produtos sem review', sql: `SELECT p.id, p.name\nFROM products p\nLEFT JOIN reviews r ON r.product_id = p.id\nWHERE r.id IS NULL;`, explanation: 'Se não houve correspondência, r.id é NULL.' }],
        [challenge('c025', 'Clientes sem pedidos', 'Médio', 'Encontre clientes que nunca fizeram pedido.', 'LEFT JOIN orders e filtre o.id IS NULL.', `SELECT c.id, c.name\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL;`, 'Esse é o padrão anti-join com LEFT JOIN.')]
      ),
      lesson('m06l03', 'SELF JOIN: hierarquia de funcionários', 'Intermediário', 'Relacionar uma tabela com ela mesma.',
        [
          'SELF JOIN não é uma palavra especial: é um JOIN em que a mesma tabela aparece duas vezes com aliases diferentes.',
          'employees.manager_id referencia employees.id. Um alias representa o funcionário e outro o gerente.',
          'Hierarquias simples de um nível funcionam bem com self join; árvores de profundidade variável pedem CTE recursiva.'
        ],
        `FROM employees e\nLEFT JOIN employees m ON m.id = e.manager_id`,
        [{ title: 'Funcionário e gerente', sql: `SELECT e.name AS employee,\n       e.role,\n       m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON m.id = e.manager_id\nORDER BY e.id;`, explanation: 'A CEO não possui manager_id, por isso LEFT JOIN mantém a linha com manager nulo.' }],
        [challenge('c026', 'Equipe de cada gerente', 'Médio', 'Liste gerente e quantidade de subordinados diretos, incluindo apenas quem possui ao menos um subordinado.', 'Self join + GROUP BY.', `SELECT m.id, m.name AS manager, COUNT(e.id) AS direct_reports\nFROM employees m\nJOIN employees e ON e.manager_id = m.id\nGROUP BY m.id, m.name\nORDER BY direct_reports DESC, manager;`, 'O JOIN elimina quem não possui subordinados e o GROUP BY consolida por gerente.')]
      ),
      lesson('m06l04', 'CROSS JOIN: combinações e grades de análise', 'Intermediário', 'Gerar todas as combinações entre duas fontes.',
        [
          'CROSS JOIN combina cada linha da primeira fonte com cada linha da segunda. Se uma fonte tem 8 linhas e a outra tem 4, o resultado terá 32 linhas.',
          'Ele é útil quando você quer montar uma grade completa: categorias por canais, meses por segmentos ou um threshold único aplicado a várias linhas.',
          'Use com intenção clara. Em tabelas grandes, o produto cartesiano cresce muito rápido; por isso filtre ou agregue antes de cruzar quando possível.',
          'Quando uma das fontes é uma CTE de uma linha, CROSS JOIN é uma forma limpa de disponibilizar esse valor calculado para todas as linhas da consulta.'
        ],
        `FROM fonte_a a\nCROSS JOIN fonte_b b`,
        [
          { title: 'Grade categoria x canal', sql: `SELECT c.name AS category, channels.channel\nFROM categories c\nCROSS JOIN (\n  SELECT DISTINCT channel\n  FROM orders\n) AS channels\nORDER BY category, channel;`, explanation: 'Cada categoria é combinada com cada canal existente em orders, formando uma grade que pode receber métricas depois.' },
          { title: 'Percentil aplicado a todos os clientes', sql: `WITH threshold AS (\n  SELECT percentile_cont(0.9) WITHIN GROUP (ORDER BY lifetime_value) AS p90\n  FROM vw_customer_summary\n)\nSELECT s.customer_id, s.name, s.lifetime_value, threshold.p90\nFROM vw_customer_summary s\nCROSS JOIN threshold;`, explanation: 'A CTE threshold tem uma linha; o CROSS JOIN repete esse valor para cada cliente sem precisar de condição ON.' }
        ],
        [
          challenge('c056', 'Mapa completo categoria por canal', 'Médio', 'Crie uma grade com todas as combinações entre categorias e canais de venda existentes. Retorne category e channel.', 'Use categories e uma subquery com SELECT DISTINCT channel FROM orders.', `SELECT c.name AS category, ch.channel\nFROM categories c\nCROSS JOIN (\n  SELECT DISTINCT channel\n  FROM orders\n) AS ch\nORDER BY category, ch.channel;`, 'CROSS JOIN não procura chave. Ele cria todas as combinações possíveis entre categorias e canais.'),
          challenge('c057', 'Receita por grade completa', 'Avançado', 'Mostre todas as combinações category/channel e a receita de pedidos não cancelados, exibindo zero quando não houver venda naquela combinação.', 'Monte a grade com CROSS JOIN e depois faça LEFT JOIN nas vendas agregadas.', `WITH grid AS (\n  SELECT c.id AS category_id, c.name AS category, ch.channel\n  FROM categories c\n  CROSS JOIN (SELECT DISTINCT channel FROM orders) AS ch\n), revenue AS (\n  SELECT p.category_id, o.channel, SUM(oi.line_total) AS total\n  FROM orders o\n  JOIN order_items oi ON oi.order_id = o.id\n  JOIN products p ON p.id = oi.product_id\n  WHERE o.status <> 'cancelled'\n  GROUP BY p.category_id, o.channel\n)\nSELECT g.category, g.channel,\n       COALESCE(ROUND(r.total, 2), 0) AS revenue\nFROM grid g\nLEFT JOIN revenue r\n  ON r.category_id = g.category_id\n AND r.channel = g.channel\nORDER BY g.category, g.channel;`, 'A grade garante que nenhuma combinação suma. O LEFT JOIN injeta a métrica quando ela existe e COALESCE transforma ausência em zero.')
        ],
        'Antes de executar CROSS JOIN em tabelas grandes, conte as linhas de cada lado. O tamanho máximo esperado é count(esquerda) multiplicado por count(direita).'),
      lesson('m06l05', 'FULL JOIN: reconciliação entre conjuntos', 'Intermediário', 'Comparar dois lados preservando correspondências e ausências.',
        [
          'FULL JOIN mantém tudo que casa pelo ON e também o que existe só na esquerda ou só na direita. Quando um lado não existe, suas colunas ficam NULL.',
          'É menos comum no dia a dia que INNER e LEFT, mas excelente para auditoria, reconciliação e comparação de conjuntos: esperado versus realizado, cadastro versus movimento, antes versus depois.',
          'COALESCE costuma acompanhar FULL JOIN para escolher a chave disponível dos dois lados, por exemplo COALESCE(a.id, b.id).',
          'Se você só precisa preservar um lado, use LEFT JOIN. Se precisa enxergar sobras dos dois lados na mesma consulta, FULL JOIN é o operador certo.'
        ],
        `FROM conjunto_a a\nFULL JOIN conjunto_b b ON b.chave = a.chave`,
        [
          { title: 'Categorias com produtos e com vendas', sql: `WITH product_categories AS (\n  SELECT DISTINCT category_id\n  FROM products\n), sold_categories AS (\n  SELECT DISTINCT p.category_id\n  FROM order_items oi\n  JOIN products p ON p.id = oi.product_id\n)\nSELECT COALESCE(pc.category_id, sc.category_id) AS category_id,\n       pc.category_id IS NOT NULL AS has_products,\n       sc.category_id IS NOT NULL AS has_sales\nFROM product_categories pc\nFULL JOIN sold_categories sc ON sc.category_id = pc.category_id\nORDER BY category_id;`, explanation: 'O resultado preserva categorias encontradas em qualquer lado da comparação.' }
        ],
        [
          challenge('c058', 'Categorias com produto versus categorias vendidas', 'Médio', 'Compare categorias que existem no catálogo de produtos com categorias que aparecem em itens de pedido. Retorne category_id, has_products e has_sales.', 'Crie duas CTEs com DISTINCT category_id e una com FULL JOIN.', `WITH product_categories AS (\n  SELECT DISTINCT category_id\n  FROM products\n), sold_categories AS (\n  SELECT DISTINCT p.category_id\n  FROM order_items oi\n  JOIN products p ON p.id = oi.product_id\n)\nSELECT COALESCE(pc.category_id, sc.category_id) AS category_id,\n       pc.category_id IS NOT NULL AS has_products,\n       sc.category_id IS NOT NULL AS has_sales\nFROM product_categories pc\nFULL JOIN sold_categories sc ON sc.category_id = pc.category_id\nORDER BY category_id;`, 'FULL JOIN mostra correspondências e também categorias que estariam presentes em apenas um dos lados. Neste banco, ele funciona como exercício de reconciliação.'),
          challenge('c059', 'Clientes compradores versus clientes com ticket', 'Médio', 'Compare clientes que possuem pedidos com clientes que possuem tickets de suporte. Retorne customer_id, has_order e has_ticket.', 'Use DISTINCT customer_id em orders e support_tickets, depois FULL JOIN.', `WITH buyers AS (\n  SELECT DISTINCT customer_id\n  FROM orders\n), ticket_customers AS (\n  SELECT DISTINCT customer_id\n  FROM support_tickets\n)\nSELECT COALESCE(b.customer_id, t.customer_id) AS customer_id,\n       b.customer_id IS NOT NULL AS has_order,\n       t.customer_id IS NOT NULL AS has_ticket\nFROM buyers b\nFULL JOIN ticket_customers t ON t.customer_id = b.customer_id\nORDER BY customer_id;`, 'COALESCE retorna o id presente em qualquer lado. Os booleanos deixam explícito se o cliente apareceu em pedidos, tickets ou ambos.')
        ]
      )
    ]
  },
  {
    id: 'm07', number: '07', title: 'Subqueries, IN e EXISTS', level: 'Intermediário',
    description: 'Use consultas dentro de consultas e escolha entre valor, conjunto e existência.',
    lessons: [
      lesson('m07l01', 'Subquery escalar e subquery de conjunto', 'Intermediário', 'Comparar valores com resultados calculados por outra consulta.',
        [
          'Uma subquery escalar deve retornar uma linha e uma coluna. Ela pode ser usada como um valor, por exemplo price > (SELECT AVG(price) ...).',
          'Uma subquery de conjunto pode retornar várias linhas e ser usada com IN. É adequada quando você realmente precisa de uma lista de valores.',
          'Subqueries podem aparecer em SELECT, FROM, WHERE e outras partes. Muitas vezes CTE ou JOIN deixam a intenção mais fácil de ler.'
        ],
        `WHERE valor > (SELECT AVG(...) FROM ...)\nWHERE id IN (SELECT ... FROM ...)`,
        [{ title: 'Acima da média', sql: `SELECT id, name, price\nFROM products\nWHERE price > (SELECT AVG(price) FROM products)\nORDER BY price DESC;`, explanation: 'A média é calculada uma vez como referência para o filtro externo.' }],
        [
          challenge('c027', 'Salários acima da média', 'Médio', 'Liste funcionários ativos com salário acima da média dos funcionários ativos.', 'A subquery usa o mesmo filtro active = true.', `SELECT id, name, role, salary\nFROM employees\nWHERE active = true\n  AND salary > (\n    SELECT AVG(salary)\n    FROM employees\n    WHERE active = true\n  )\nORDER BY salary DESC;`, 'A população comparada deve ser a mesma da média de referência.'),
          challenge('c028', 'Clientes com ticket urgente', 'Médio', 'Liste clientes cujo id aparece em tickets de prioridade urgent.', 'Use IN com uma subquery.', `SELECT id, name, email\nFROM customers\nWHERE id IN (\n  SELECT customer_id\n  FROM support_tickets\n  WHERE priority = 'urgent'\n)\nORDER BY id;`, 'IN testa participação no conjunto retornado pela subquery.')
        ]
      ),
      lesson('m07l02', 'EXISTS e NOT EXISTS', 'Intermediário', 'Testar se relações existem sem precisar retornar seus valores.',
        [
          'EXISTS retorna verdadeiro assim que encontra uma linha que satisfaz a subquery correlacionada. Ele expressa diretamente perguntas do tipo “existe pelo menos um?”.',
          'NOT EXISTS é uma forma robusta de anti-join e evita armadilhas de NULL que podem ocorrer com NOT IN.',
          'A subquery correlacionada referencia uma coluna da consulta externa; conceitualmente é avaliada para cada linha externa, embora o otimizador possa reescrever o plano.'
        ],
        `WHERE EXISTS (\n  SELECT 1 FROM outra x WHERE x.fk = t.id\n)`,
        [{ title: 'Clientes com pedido entregue', sql: `SELECT c.id, c.name\nFROM customers c\nWHERE EXISTS (\n  SELECT 1\n  FROM orders o\n  WHERE o.customer_id = c.id\n    AND o.status = 'delivered'\n);`, explanation: 'Não importa quais colunas o SELECT interno retorna; EXISTS só precisa saber se uma linha existe.' }],
        [challenge('c029', 'Produtos nunca avaliados', 'Médio', 'Liste produtos que não possuem nenhuma review.', 'NOT EXISTS correlacionando product_id.', `SELECT p.id, p.name\nFROM products p\nWHERE NOT EXISTS (\n  SELECT 1\n  FROM reviews r\n  WHERE r.product_id = p.id\n);`, 'NOT EXISTS é legível e seguro para expressar ausência de relacionamento.')]
      )
    ]
  },
  {
    id: 'm08', number: '08', title: 'CTEs e consultas recursivas', level: 'Avançado',
    description: 'Quebre problemas complexos em etapas nomeadas e percorra hierarquias.',
    lessons: [
      lesson('m08l01', 'WITH / CTE', 'Avançado', 'Organizar consultas complexas em blocos legíveis.',
        [
          'Uma Common Table Expression (CTE) é um resultado nomeado disponível durante uma instrução. Ela começa com WITH nome AS (...).',
          'CTEs ajudam a separar uma consulta em etapas: calcular venda por pedido, depois por cliente, depois ranquear.',
          'No PostgreSQL moderno, uma CTE SELECT simples pode ser integrada ao plano pelo otimizador quando apropriado. MATERIALIZED e NOT MATERIALIZED permitem influenciar esse comportamento em casos específicos.'
        ],
        `WITH etapa AS (\n  SELECT ...\n)\nSELECT ...\nFROM etapa;`,
        [{ title: 'Receita por estado em duas etapas', sql: `WITH customer_revenue AS (\n  SELECT c.id, c.state, COALESCE(SUM(v.total_amount), 0) AS revenue\n  FROM customers c\n  LEFT JOIN vw_order_totals v ON v.customer_id = c.id AND v.status <> 'cancelled'\n  GROUP BY c.id, c.state\n)\nSELECT state, round(SUM(revenue), 2) AS revenue\nFROM customer_revenue\nGROUP BY state\nORDER BY revenue DESC;`, explanation: 'A CTE dá nome à primeira transformação e simplifica o SELECT final.' }],
        [challenge('c030', 'Top clientes com CTE', 'Avançado', 'Crie uma CTE com receita por cliente e retorne os 10 maiores.', 'Some vw_order_totals por customer_id e junte customers.', `WITH revenue AS (\n  SELECT customer_id, SUM(total_amount) AS total\n  FROM vw_order_totals\n  WHERE status <> 'cancelled'\n  GROUP BY customer_id\n)\nSELECT c.id, c.name, round(r.total, 2) AS revenue\nFROM revenue r\nJOIN customers c ON c.id = r.customer_id\nORDER BY revenue DESC\nLIMIT 10;`, 'A etapa de agregação fica separada da etapa de enriquecimento com nome do cliente.')]
      ),
      lesson('m08l02', 'WITH RECURSIVE', 'Avançado', 'Percorrer uma hierarquia de profundidade variável.',
        [
          'CTE recursiva possui uma parte âncora e uma parte recursiva unidas normalmente por UNION ALL.',
          'A âncora inicia a árvore. A parte recursiva encontra os próximos nós usando o resultado já produzido.',
          'Sempre garanta que a recursão avança para uma condição de parada; ciclos em dados hierárquicos exigem proteção adicional.'
        ],
        `WITH RECURSIVE tree AS (\n  -- âncora\n  SELECT ...\n  UNION ALL\n  -- passo recursivo\n  SELECT ... FROM origem JOIN tree ...\n)\nSELECT * FROM tree;`,
        [{ title: 'Organograma', sql: `WITH RECURSIVE org AS (\n  SELECT id, manager_id, name, role, 0 AS depth, name::text AS path\n  FROM employees\n  WHERE manager_id IS NULL\n\n  UNION ALL\n\n  SELECT e.id, e.manager_id, e.name, e.role,\n         org.depth + 1,\n         org.path || ' > ' || e.name\n  FROM employees e\n  JOIN org ON e.manager_id = org.id\n)\nSELECT * FROM org\nORDER BY path;`, explanation: 'A CEO inicia a árvore; cada iteração encontra subordinados do nível anterior.' }],
        [challenge('c031', 'Profundidade da equipe', 'Avançado', 'Retorne id, nome e nível hierárquico de todos os funcionários a partir da raiz.', 'A raiz tem depth 0; filhos somam 1.', `WITH RECURSIVE org AS (\n  SELECT id, manager_id, name, 0 AS depth\n  FROM employees\n  WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.manager_id, e.name, o.depth + 1\n  FROM employees e\n  JOIN org o ON e.manager_id = o.id\n)\nSELECT id, name, depth\nFROM org\nORDER BY depth, id;`, 'O depth é acumulado a cada passo da recursão.')]
      )
    ]
  },
  {
    id: 'm09', number: '09', title: 'UNION, INTERSECT e EXCEPT', level: 'Intermediário',
    description: 'Combine conjuntos verticalmente e compare populações.',
    lessons: [
      lesson('m09l01', 'Operadores de conjunto', 'Intermediário', 'Entender união, interseção e diferença de resultados.',
        [
          'UNION combina resultados e remove duplicidades. UNION ALL mantém todas as linhas e costuma ser mais barato.',
          'INTERSECT retorna linhas presentes nos dois resultados. EXCEPT retorna linhas da primeira consulta ausentes na segunda.',
          'As consultas combinadas precisam ter a mesma quantidade de colunas e tipos compatíveis por posição.'
        ],
        `SELECT coluna FROM a\nUNION ALL\nSELECT coluna FROM b;`,
        [{ title: 'Clientes com pedido e ticket', sql: `SELECT customer_id FROM orders\nINTERSECT\nSELECT customer_id FROM support_tickets;`, explanation: 'Retorna ids presentes nos dois conjuntos.' }],
        [
          challenge('c032', 'Compradores sem ticket', 'Médio', 'Obtenha customer_id de quem aparece em orders mas nunca em support_tickets.', 'EXCEPT.', `SELECT customer_id FROM orders\nEXCEPT\nSELECT customer_id FROM support_tickets\nORDER BY customer_id;`, 'EXCEPT expressa diferença de conjuntos.'),
          challenge('c033', 'Todos os envolvidos', 'Médio', 'Produza uma lista única de customer_id que apareçam em orders ou support_tickets.', 'UNION remove duplicatas.', `SELECT customer_id FROM orders\nUNION\nSELECT customer_id FROM support_tickets\nORDER BY customer_id;`, 'UNION aplica distinct ao resultado combinado.')
        ]
      )
    ]
  },
  {
    id: 'm10', number: '10', title: 'INSERT, UPDATE, DELETE e RETURNING', level: 'Intermediário',
    description: 'Modifique dados com segurança e veja imediatamente o que mudou.',
    lessons: [
      lesson('m10l01', 'INSERT e RETURNING', 'Intermediário', 'Inserir registros e capturar valores gerados.',
        [
          'INSERT INTO define a tabela e as colunas que receberão valores. Omitir a lista de colunas torna o comando frágil; prefira sempre listá-las.',
          'RETURNING é muito útil no PostgreSQL: retorna as linhas inseridas sem uma consulta adicional.',
          'IDENTITY gera a chave automaticamente quando id é omitido.'
        ],
        `INSERT INTO tabela (coluna_a, coluna_b)\nVALUES (valor_a, valor_b)\nRETURNING *;`,
        [{ title: 'Novo departamento', sql: `INSERT INTO departments (name, cost_center, budget)\nVALUES ('Pesquisa', 'CC-500', 250000)\nRETURNING id, name, budget;`, explanation: 'RETURNING mostra o id gerado e os dados persistidos.' }],
        [challenge('c034', 'Novo cliente', 'Médio', 'Insira um cliente fictício com name, email, city, state, signup_date, segment e retorne id/name.', 'Use CURRENT_DATE no signup_date.', `INSERT INTO customers (name, email, city, state, signup_date, segment)\nVALUES ('Cliente Treino', 'treino@exemplo.com', 'São Paulo', 'SP', CURRENT_DATE, 'bronze')\nRETURNING id, name;`, 'Colunas com default, como active e metadata, podem ser omitidas.')]
      ),
      lesson('m10l02', 'UPDATE e DELETE seguros', 'Intermediário', 'Alterar ou remover somente as linhas pretendidas.',
        [
          'UPDATE modifica colunas das linhas que passam no WHERE. Sem WHERE, todas as linhas são atualizadas.',
          'DELETE remove linhas; também sem WHERE afeta toda a tabela. Sempre valide o filtro com SELECT e use transação enquanto aprende.',
          'RETURNING funciona também em UPDATE e DELETE, permitindo inspecionar as linhas afetadas.'
        ],
        `UPDATE tabela SET coluna = valor WHERE ... RETURNING ...;\nDELETE FROM tabela WHERE ... RETURNING ...;`,
        [{ title: 'Atualização controlada', sql: `UPDATE products\nSET price = round(price * 1.03, 2)\nWHERE category_id = 5\nRETURNING id, name, price;`, explanation: 'Somente produtos da categoria 5 recebem reajuste.' }],
        [
          challenge('c035', 'Desativação segura', 'Médio', 'Desative o cliente criado no desafio anterior pelo e-mail e retorne id, name e active.', 'UPDATE ... WHERE email = ...', `UPDATE customers\nSET active = false\nWHERE email = 'treino@exemplo.com'\nRETURNING id, name, active;`, 'Filtrar por um campo único torna o impacto previsível.'),
          challenge('c036', 'Remova o cliente de treino', 'Médio', 'Remova o cliente de treino pelo e-mail usando RETURNING.', 'Se criou relacionamentos para ele, remova-os antes.', `DELETE FROM customers\nWHERE email = 'treino@exemplo.com'\nRETURNING id, name;`, 'DELETE respeita constraints; uma FK pode impedir exclusões que deixariam registros órfãos.')
        ]
      )
    ]
  },
  {
    id: 'm11', number: '11', title: 'DDL, constraints e modelagem', level: 'Intermediário',
    description: 'Crie tabelas corretas usando tipos, chaves e regras de integridade.',
    lessons: [
      lesson('m11l01', 'CREATE TABLE e tipos', 'Intermediário', 'Definir uma estrutura relacional clara e tipada.',
        [
          'CREATE TABLE define nome, colunas, tipos, defaults e constraints. O tipo correto protege o dado e comunica a intenção.',
          'numeric(p,s) é apropriado para valores monetários exatos; timestamp guarda data e hora; boolean representa verdadeiro/falso; jsonb guarda documentos semiestruturados.',
          'GENERATED ... AS IDENTITY é a forma moderna de pedir ao PostgreSQL um identificador numérico automático.'
        ],
        `CREATE TABLE exemplo (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name text NOT NULL,\n  created_at timestamp NOT NULL DEFAULT now()\n);`,
        [{ title: 'Tabela de laboratório', sql: `CREATE TABLE IF NOT EXISTS study_notes (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  title varchar(120) NOT NULL,\n  body text,\n  created_at timestamp NOT NULL DEFAULT now()\n);`, explanation: 'IF NOT EXISTS evita erro se a tabela já existir, mas não valida se a estrutura existente é igual.' }],
        [challenge('c037', 'Crie uma wishlist', 'Médio', 'Crie tabela wishlists com id, customer_id FK, product_id FK, created_at default now() e unicidade customer/product.', 'Use UNIQUE(customer_id, product_id).', `CREATE TABLE wishlists (\n  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  customer_id integer NOT NULL REFERENCES customers(id),\n  product_id integer NOT NULL REFERENCES products(id),\n  created_at timestamp NOT NULL DEFAULT now(),\n  UNIQUE (customer_id, product_id)\n);`, 'A constraint composta impede adicionar o mesmo produto duas vezes à wishlist do mesmo cliente.')]
      ),
      lesson('m11l02', 'PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK e NOT NULL', 'Intermediário', 'Fazer o banco rejeitar estados inválidos.',
        [
          'PRIMARY KEY implica unicidade e não nulidade. FOREIGN KEY exige que o valor exista na tabela referenciada, preservando integridade referencial.',
          'UNIQUE impede duplicatas; CHECK valida uma expressão; NOT NULL exige presença do valor.',
          'Constraints são uma última linha de defesa. Mesmo que a aplicação valide dados, regras estruturais importantes devem existir no banco.'
        ],
        `CHECK (valor >= 0)\nUNIQUE (coluna)\nFOREIGN KEY (...) REFERENCES ...`,
        [{ title: 'Constraint real do laboratório', sql: `-- payments possui:\n-- installments integer NOT NULL\n--   CHECK (installments BETWEEN 1 AND 12)`, explanation: 'O próprio banco impede parcelas fora do domínio permitido.' }],
        [challenge('c038', 'Regra de nota', 'Médio', 'Explique por que reviews.rating nunca deve aceitar 0 nem 6 e escreva a constraint.', 'CHECK BETWEEN 1 AND 5.', `ALTER TABLE reviews\nADD CONSTRAINT reviews_rating_valid\nCHECK (rating BETWEEN 1 AND 5);`, 'Observação: o script inicial já possui uma CHECK equivalente. O comando é a forma de adicioná-la a uma tabela que ainda não tivesse a regra.')]
      )
    ]
  },
  {
    id: 'm12', number: '12', title: 'Transações e consistência', level: 'Avançado',
    description: 'Use BEGIN, COMMIT, ROLLBACK e SAVEPOINT para trabalhar com segurança.',
    lessons: [
      lesson('m12l01', 'BEGIN, COMMIT e ROLLBACK', 'Avançado', 'Agrupar operações em uma unidade atômica.',
        [
          'Uma transação garante que um conjunto de operações seja confirmado como unidade. BEGIN inicia, COMMIT confirma e ROLLBACK desfaz alterações ainda não confirmadas.',
          'Atomicidade evita estados parciais. Em uma transferência, por exemplo, não queremos debitar uma conta sem creditar a outra.',
          'No DBeaver, observe a configuração de auto-commit. Para aprender transações explicitamente, desabilite auto-commit na conexão de estudo ou execute BEGIN manualmente e confirme o estado do indicador de transação.'
        ],
        `BEGIN;\n-- alterações\nCOMMIT;\n-- ou ROLLBACK;`,
        [{ title: 'Experimento reversível', sql: `BEGIN;\n\nUPDATE products\nSET price = price * 2\nWHERE id = 1;\n\nSELECT id, name, price FROM products WHERE id = 1;\n\nROLLBACK;\n\nSELECT id, name, price FROM products WHERE id = 1;`, explanation: 'A primeira leitura mostra a alteração dentro da transação; após ROLLBACK o valor original volta.' }],
        [challenge('c039', 'Atualize sem medo', 'Avançado', 'Abra uma transação, aumente em 10% o preço dos produtos category_id=2, confira, e desfaça tudo.', 'BEGIN → UPDATE → SELECT → ROLLBACK.', `BEGIN;\n\nUPDATE products\nSET price = round(price * 1.10, 2)\nWHERE category_id = 2;\n\nSELECT id, name, price\nFROM products\nWHERE category_id = 2;\n\nROLLBACK;`, 'Nenhuma mudança persiste após o ROLLBACK.')]
      ),
      lesson('m12l02', 'SAVEPOINT e isolamento', 'Avançado', 'Desfazer parte de uma transação e compreender concorrência.',
        [
          'SAVEPOINT cria um ponto intermediário. ROLLBACK TO SAVEPOINT desfaz apenas o que ocorreu depois dele, mantendo a transação aberta.',
          'Isolamento define quais efeitos de transações concorrentes podem ser observados. PostgreSQL usa READ COMMITTED por padrão; também oferece REPEATABLE READ e SERIALIZABLE.',
          'Locks são naturais em bancos concorrentes. Mantenha transações curtas e previsíveis para reduzir bloqueios desnecessários.'
        ],
        `BEGIN;\nSAVEPOINT ponto1;\n...\nROLLBACK TO SAVEPOINT ponto1;\nCOMMIT;`,
        [{ title: 'Reversão parcial', sql: `BEGIN;\nUPDATE customers SET segment = 'gold' WHERE id = 1;\nSAVEPOINT after_customer;\nUPDATE products SET stock = 0 WHERE id = 1;\nROLLBACK TO SAVEPOINT after_customer;\nCOMMIT;`, explanation: 'A mudança do cliente é confirmada; a mudança de estoque é desfeita.' }],
        [challenge('c040', 'Savepoint de laboratório', 'Avançado', 'Crie uma transação que altere customer 2, crie um savepoint, altere product 2, desfaça só a segunda alteração e finalize com COMMIT.', 'Siga exatamente o padrão do exemplo.', `BEGIN;\nUPDATE customers SET segment = 'silver' WHERE id = 2;\nSAVEPOINT customer_done;\nUPDATE products SET stock = stock + 999 WHERE id = 2;\nROLLBACK TO SAVEPOINT customer_done;\nCOMMIT;`, 'O savepoint permite preservar operações anteriores sem confirmar a transação prematuramente.')]
      )
    ]
  },
  {
    id: 'm13', number: '13', title: 'Views, funções e reutilização', level: 'Avançado',
    description: 'Encapsule lógica SQL e crie interfaces reutilizáveis dentro do banco.',
    lessons: [
      lesson('m13l01', 'VIEW e MATERIALIZED VIEW', 'Avançado', 'Reutilizar consultas e entender o custo de materializar resultados.',
        [
          'Uma VIEW armazena a definição da consulta, não o resultado em si. Ao consultá-la, o PostgreSQL executa a lógica subjacente.',
          'Uma MATERIALIZED VIEW armazena o resultado fisicamente e precisa de REFRESH para refletir mudanças da origem. Ela troca atualização imediata por leitura potencialmente mais rápida.',
          'O laboratório já inclui vw_order_totals e vw_customer_summary para você inspecionar e usar em exercícios.'
        ],
        `CREATE VIEW nome AS SELECT ...;\nCREATE MATERIALIZED VIEW nome AS SELECT ...;\nREFRESH MATERIALIZED VIEW nome;`,
        [{ title: 'Inspecione uma view', sql: `SELECT *\nFROM vw_customer_summary\nORDER BY lifetime_value DESC\nLIMIT 10;`, explanation: 'A view expõe métricas prontas como uma tabela virtual.' }],
        [challenge('c041', 'View de produtos rentáveis', 'Avançado', 'Crie uma view vw_product_margin com id, name, price, cost, margin_value e margin_pct.', 'margin_pct = (price-cost)/price*100; proteja divisão por zero com NULLIF.', `CREATE OR REPLACE VIEW vw_product_margin AS\nSELECT id, name, price, cost,\n       price - cost AS margin_value,\n       round(((price - cost) / NULLIF(price, 0) * 100)::numeric, 2) AS margin_pct\nFROM products;`, 'NULLIF(price,0) transforma zero em NULL e evita divisão por zero.')]
      ),
      lesson('m13l02', 'Funções SQL no PostgreSQL', 'Avançado', 'Encapsular uma regra parametrizada no banco.',
        [
          'CREATE FUNCTION permite definir rotinas reutilizáveis. Funções SQL simples podem retornar um valor ou um conjunto de linhas.',
          'Parâmetros tornam a lógica reaproveitável. Tipos de retorno documentam o contrato.',
          'Use funções de banco para lógica realmente próxima dos dados; evite transformar todo comportamento da aplicação em funções sem necessidade.'
        ],
        `CREATE FUNCTION nome(param tipo)\nRETURNS tipo\nLANGUAGE sql\nAS $$ SELECT ... $$;`,
        [{ title: 'LTV de um cliente', sql: `CREATE OR REPLACE FUNCTION fn_customer_ltv(p_customer_id integer)\nRETURNS numeric\nLANGUAGE sql\nAS $$\n  SELECT COALESCE(SUM(total_amount), 0)::numeric\n  FROM vw_order_totals\n  WHERE customer_id = p_customer_id\n    AND status <> 'cancelled'\n$$;\n\nSELECT fn_customer_ltv(10);`, explanation: 'A função recebe um id e devolve uma métrica numérica.' }],
        [challenge('c042', 'Função de estoque', 'Avançado', 'Crie fn_stock_status(stock integer) que retorne crítico, atenção ou saudável usando os mesmos limites do módulo 3.', 'A função pode usar SELECT CASE.', `CREATE OR REPLACE FUNCTION fn_stock_status(p_stock integer)\nRETURNS text\nLANGUAGE sql\nIMMUTABLE\nAS $$\n  SELECT CASE\n    WHEN p_stock < 15 THEN 'crítico'\n    WHEN p_stock < 35 THEN 'atenção'\n    ELSE 'saudável'\n  END\n$$;`, 'IMMUTABLE é apropriado porque, para o mesmo parâmetro, a função sempre produz o mesmo resultado e não consulta tabelas.')]
      )
    ]
  },
  {
    id: 'm14', number: '14', title: 'Window Functions', level: 'Avançado',
    description: 'Calcule ranking, acumulados, comparação temporal e percentuais sem perder detalhe.',
    lessons: [
      lesson('m14l01', 'OVER, PARTITION BY e ORDER BY', 'Avançado', 'Entender por que window functions preservam as linhas.',
        [
          'Uma agregação com GROUP BY reduz várias linhas a uma por grupo. Uma window function calcula sobre um conjunto relacionado sem eliminar a linha atual.',
          'OVER define a janela. PARTITION BY reinicia o cálculo por grupo. ORDER BY dentro da janela define sequência para rankings e acumulados.',
          'ROWS BETWEEN define quais linhas entram no cálculo da janela. UNBOUNDED PRECEDING significa “desde a primeira linha da janela”; CURRENT ROW significa “até a linha atual”.',
          'SUM(...) OVER(...) cria total acumulado; AVG(...) OVER(PARTITION BY ...) cria média do grupo ao lado de cada linha. Para média móvel, use um frame como ROWS BETWEEN 6 PRECEDING AND CURRENT ROW.'
        ],
        `função(...) OVER (\n  PARTITION BY grupo\n  ORDER BY ordem\n  ROWS BETWEEN início AND fim\n)`,
        [
          { title: 'Acumulado por cliente', sql: `SELECT customer_id, order_id, order_date, total_amount,\n       SUM(total_amount) OVER (\n         PARTITION BY customer_id\n         ORDER BY order_date, order_id\n         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n       ) AS running_total\nFROM vw_order_totals\nWHERE status <> 'cancelled'\nORDER BY customer_id, order_date, order_id;`, explanation: 'Cada cliente possui seu próprio acumulado cronológico. O frame começa no primeiro pedido do cliente e termina na linha atual.' },
          { title: 'Média móvel de 3 pedidos', sql: `SELECT customer_id, order_id, order_date, total_amount,\n       ROUND(AVG(total_amount) OVER (\n         PARTITION BY customer_id\n         ORDER BY order_date, order_id\n         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n       ), 2) AS moving_avg_3_orders\nFROM vw_order_totals\nWHERE status <> 'cancelled'\nORDER BY customer_id, order_date, order_id;`, explanation: 'Para cada pedido, o frame considera a linha atual e até duas linhas anteriores do mesmo cliente.' }
        ],
        [challenge('c043', 'Preço versus média da categoria', 'Avançado', 'Para cada produto, mostre preço, preço médio da categoria e diferença para a média.', 'AVG(price) OVER(PARTITION BY category_id).', `SELECT id, category_id, name, price,\n       round(AVG(price) OVER (PARTITION BY category_id), 2) AS category_avg,\n       round((price - AVG(price) OVER (PARTITION BY category_id))::numeric, 2) AS diff_from_avg\nFROM products\nORDER BY category_id, price DESC;`, 'A média se repete em cada produto da categoria, permitindo comparação sem GROUP BY.')]
      ),
      lesson('m14l02', 'ROW_NUMBER, RANK, DENSE_RANK, NTILE, LAG e LEAD', 'Avançado', 'Ranquear, segmentar e comparar linhas vizinhas.',
        [
          'ROW_NUMBER gera sequência sem empates. RANK dá a mesma posição a empates e pula números; DENSE_RANK não deixa buracos.',
          'NTILE divide linhas ordenadas em grupos numerados. NTILE(4), por exemplo, cria quartis; a ordenação define se os melhores ficam no grupo 1 ou no grupo 4.',
          'LAG acessa uma linha anterior da janela; LEAD acessa uma posterior. São essenciais para evolução temporal.',
          'Uma técnica comum de top-N por grupo é calcular ROW_NUMBER em uma CTE e filtrar rn <= N na consulta externa.'
        ],
        `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)\nNTILE(4) OVER (ORDER BY métrica)\nLAG(valor) OVER (PARTITION BY ... ORDER BY ...)`,
        [
          { title: 'Últimos pedidos de cada cliente', sql: `WITH ranked AS (\n  SELECT v.*,\n         ROW_NUMBER() OVER (\n           PARTITION BY customer_id\n           ORDER BY order_date DESC, order_id DESC\n         ) AS rn\n  FROM vw_order_totals v\n)\nSELECT * FROM ranked\nWHERE rn <= 3\nORDER BY customer_id, rn;`, explanation: 'A numeração é feita por cliente e depois filtrada externamente.' },
          { title: 'Quartis de clientes por LTV', sql: `SELECT customer_id, name, lifetime_value,\n       NTILE(4) OVER (ORDER BY lifetime_value) AS ltv_quartile\nFROM vw_customer_summary\nORDER BY ltv_quartile, lifetime_value;`, explanation: 'NTILE(4) distribui os clientes em quatro grupos ordenados por lifetime_value. Como a ordem é crescente, os maiores LTVs aparecem no quartil 4.' }
        ],
        [
          challenge('c044', 'Ranking de faturamento', 'Avançado', 'Some receita por cliente e gere DENSE_RANK do maior para o menor.', 'Agregue em CTE e ranqueie o total.', `WITH revenue AS (\n  SELECT customer_id, SUM(total_amount) AS total\n  FROM vw_order_totals\n  WHERE status <> 'cancelled'\n  GROUP BY customer_id\n)\nSELECT customer_id, round(total, 2) AS total,\n       DENSE_RANK() OVER (ORDER BY total DESC) AS revenue_rank\nFROM revenue\nORDER BY revenue_rank, customer_id;`, 'DENSE_RANK preserva a mesma posição para empates sem criar lacunas.'),
          challenge('c045', 'Pedido anterior', 'Avançado', 'Para cada pedido do cliente 10, mostre total e total do pedido anterior.', 'LAG(total_amount).', `SELECT order_id, order_date, total_amount,\n       LAG(total_amount) OVER (ORDER BY order_date, order_id) AS previous_total\nFROM vw_order_totals\nWHERE customer_id = 10\nORDER BY order_date, order_id;`, 'Como já filtramos um cliente, PARTITION BY é opcional aqui.')
        ]
      )
    ]
  },
  {
    id: 'm15', number: '15', title: 'PostgreSQL avançado: JSONB, arrays e LATERAL', level: 'Avançado',
    description: 'Explore recursos próprios do PostgreSQL para dados semiestruturados e consultas poderosas.',
    lessons: [
      lesson('m15l01', 'JSONB e operadores ->, ->>, @>', 'Avançado', 'Consultar propriedades semiestruturadas com segurança.',
        [
          'JSONB armazena JSON em representação binária otimizada para consulta. -> retorna JSON; ->> retorna texto.',
          'O operador @> testa contenção: attributes @> {"color":"preto"} verifica se o documento contém esse par.',
          'GIN é uma família de índices útil para operadores de contenção em JSONB. O laboratório possui idx_products_attributes_gin.'
        ],
        `json_col->'chave'\njson_col->>'chave'\njson_col @> '{"chave":"valor"}'::jsonb`,
        [{ title: 'Cor e garantia', sql: `SELECT id, name,\n       attributes->>'color' AS color,\n       (attributes->>'warranty_months')::int AS warranty_months\nFROM products\nWHERE attributes @> '{"color":"preto"}'::jsonb;`, explanation: '->> produz texto; fazemos cast da garantia para integer.' }],
        [challenge('c046', 'Produtos com garantia longa', 'Avançado', 'Liste produtos cujo warranty_months no JSONB seja pelo menos 18.', 'Extraia com ->> e converta para int.', `SELECT id, name, attributes->>'warranty_months' AS warranty\nFROM products\nWHERE (attributes->>'warranty_months')::int >= 18\nORDER BY id;`, 'Como o filtro aplica cast após ->>, o índice de contenção não necessariamente atende diretamente essa expressão; um índice de expressão poderia ser criado em escala maior.')]
      ),
      lesson('m15l02', 'Arrays e ANY / @>', 'Avançado', 'Consultar listas armazenadas em uma coluna.',
        [
          'PostgreSQL possui arrays nativos. products.tags é text[]. O operador @> verifica se o array contém outro array.',
          'ANY permite testar um valor contra os elementos: valor = ANY(tags). unnest expande elementos em linhas.',
          'Arrays são úteis quando o conjunto pertence naturalmente à linha, mas não substituem modelagem relacional quando os elementos precisam de atributos próprios ou relacionamentos complexos.'
        ],
        `tags @> ARRAY['premium']\n'premium' = ANY(tags)\nunnest(tags)`,
        [{ title: 'Tag premium', sql: `SELECT id, name, tags\nFROM products\nWHERE tags @> ARRAY['premium'];`, explanation: 'O GIN de tags pode ajudar operadores de contenção em conjuntos maiores.' }],
        [challenge('c047', 'Contagem por tag', 'Avançado', 'Expanda tags e conte quantos produtos existem por tag.', 'CROSS JOIN LATERAL unnest(p.tags).', `SELECT tag, COUNT(*) AS products\nFROM products p\nCROSS JOIN LATERAL unnest(p.tags) AS t(tag)\nGROUP BY tag\nORDER BY products DESC, tag;`, 'unnest transforma cada elemento do array em uma linha; depois agregamos normalmente.')]
      ),
      lesson('m15l03', 'LATERAL', 'Avançado', 'Executar uma subconsulta dependente de cada linha da esquerda.',
        [
          'LATERAL permite que uma subconsulta em FROM referencie colunas de itens anteriores do próprio FROM.',
          'É excelente para “top N por pai”: para cada cliente, buscar seus dois pedidos mais recentes sem numerar a tabela inteira.',
          'LEFT JOIN LATERAL ... ON true preserva a linha externa mesmo quando a subquery não encontra nada.'
        ],
        `FROM pai p\nLEFT JOIN LATERAL (\n  SELECT ... WHERE fk = p.id ORDER BY ... LIMIT N\n) x ON true`,
        [{ title: 'Último pedido por cliente', sql: `SELECT c.id, c.name, last_order.order_id, last_order.order_date, last_order.total_amount\nFROM customers c\nLEFT JOIN LATERAL (\n  SELECT v.order_id, v.order_date, v.total_amount\n  FROM vw_order_totals v\n  WHERE v.customer_id = c.id\n  ORDER BY v.order_date DESC, v.order_id DESC\n  LIMIT 1\n) AS last_order ON true\nORDER BY c.id;`, explanation: 'A subquery usa c.id da linha corrente e retorna no máximo um pedido.' }],
        [challenge('c048', 'Top 2 pedidos por cliente', 'Avançado', 'Use LATERAL para retornar até os dois maiores pedidos de cada cliente por total_amount.', 'Subquery ordenada por total DESC LIMIT 2.', `SELECT c.id, c.name, top_order.order_id, top_order.total_amount\nFROM customers c\nLEFT JOIN LATERAL (\n  SELECT order_id, total_amount\n  FROM vw_order_totals v\n  WHERE v.customer_id = c.id\n    AND v.status <> 'cancelled'\n  ORDER BY total_amount DESC, order_id\n  LIMIT 2\n) AS top_order ON true\nORDER BY c.id, top_order.total_amount DESC NULLS LAST;`, 'LATERAL executa a busca top-N no contexto de cada cliente.')]
      )
    ]
  },
  {
    id: 'm16', number: '16', title: 'Índices, EXPLAIN e performance', level: 'Avançado',
    description: 'Aprenda a medir antes de otimizar e entenda como índices mudam planos de execução.',
    lessons: [
      lesson('m16l01', 'B-tree, GIN e índices compostos', 'Avançado', 'Escolher índices a partir de padrões reais de acesso.',
        [
          'Índices B-tree são a escolha padrão para igualdade, intervalos e ordenação em muitos tipos. Índices compostos organizam múltiplas colunas e a ordem delas importa.',
          'GIN é apropriado para estruturas com múltiplos componentes, como arrays e JSONB, usando operadores suportados pela classe do índice.',
          'Índice acelera algumas leituras, mas tem custo de armazenamento e manutenção em INSERT/UPDATE/DELETE. Crie índices para consultas reais, não “um em cada coluna”.'
        ],
        `CREATE INDEX nome ON tabela (coluna1, coluna2);\nCREATE INDEX nome ON tabela USING gin(jsonb_coluna);`,
        [{ title: 'Índice composto existente', sql: `-- Já criado pelo laboratório:\nCREATE INDEX idx_orders_customer_date\nON orders(customer_id, order_date DESC);`, explanation: 'Ele combina filtro por cliente com ordenação/data, um padrão comum para histórico de pedidos.' }],
        [challenge('c049', 'Desenhe o índice', 'Avançado', 'Para consultas frequentes WHERE status=? AND order_date BETWEEN ... qual índice do laboratório já ajuda?', 'Inspecione idx_orders_status_date.', `CREATE INDEX idx_orders_status_date\nON orders(status, order_date);`, 'A primeira coluna atende igualdade por status e a segunda permite percorrer a faixa de datas dentro desse status.')]
      ),
      lesson('m16l02', 'EXPLAIN e EXPLAIN ANALYZE', 'Avançado', 'Ler o plano real em vez de adivinhar gargalos.',
        [
          'EXPLAIN mostra o plano estimado. EXPLAIN ANALYZE executa a consulta e acrescenta tempos e linhas reais; portanto, use com cuidado em comandos que modificam dados.',
          'Seq Scan não é automaticamente ruim: em tabelas pequenas ou quando grande parte das linhas será lida, ele pode ser a melhor estratégia.',
          'Compare rows estimadas com actual rows, observe loops e os nós mais caros. BUFFERS ajuda a enxergar páginas acessadas quando a opção é habilitada.'
        ],
        `EXPLAIN (ANALYZE, BUFFERS)\nSELECT ...;`,
        [{ title: 'Plano de histórico', sql: `EXPLAIN (ANALYZE, BUFFERS)\nSELECT *\nFROM orders\nWHERE customer_id = 10\nORDER BY order_date DESC;`, explanation: 'Use o plano para observar se e como o índice composto é considerado.' }],
        [challenge('c050', 'Compare dois filtros', 'Avançado', 'Rode EXPLAIN ANALYZE para customer_id=10 e depois para uma consulta sem filtro. Compare Index Scan/Bitmap/Seq Scan e explique por que o plano pode mudar.', 'O otimizador estima custo com base na seletividade.', `EXPLAIN (ANALYZE, BUFFERS)\nSELECT * FROM orders\nWHERE customer_id = 10\nORDER BY order_date DESC;\n\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT * FROM orders;`, 'Uma consulta seletiva pode se beneficiar do índice; ler a tabela inteira frequentemente favorece uma varredura sequencial. Neste conjunto pequeno, o plano exato pode variar.')]
      )
    ]
  },
  {
    id: 'm17', number: '17', title: 'SQL analítico avançado', level: 'Especialista',
    description: 'Resolva relatórios complexos com DISTINCT ON, GROUPING SETS e percentuais.',
    lessons: [
      lesson('m17l01', 'DISTINCT ON e “primeiro por grupo”', 'Especialista', 'Usar uma extensão útil do PostgreSQL para selecionar uma linha por grupo.',
        [
          'DISTINCT ON (expressão) mantém a primeira linha de cada grupo segundo ORDER BY. É uma extensão do PostgreSQL e pode produzir soluções muito compactas.',
          'A expressão do DISTINCT ON deve corresponder ao início do ORDER BY para que “primeira” tenha sentido previsível.',
          'Window functions são mais portáveis e flexíveis; DISTINCT ON é ótimo quando você conhece PostgreSQL e quer a linha mais recente/maior de cada grupo.'
        ],
        `SELECT DISTINCT ON (grupo) ...\nFROM ...\nORDER BY grupo, criterio DESC;`,
        [{ title: 'Pedido mais recente por cliente', sql: `SELECT DISTINCT ON (customer_id)\n       customer_id, order_id, order_date, total_amount\nFROM vw_order_totals\nORDER BY customer_id, order_date DESC, order_id DESC;`, explanation: 'Depois de ordenar cada cliente do mais recente para o mais antigo, DISTINCT ON conserva a primeira linha.' }],
        [challenge('c051', 'Melhor review por produto', 'Especialista', 'Retorne uma review por produto: a de maior rating; em empate, a mais recente.', 'DISTINCT ON(product_id), ORDER BY product_id, rating DESC, created_at DESC.', `SELECT DISTINCT ON (product_id)\n       product_id, id AS review_id, rating, created_at, comment\nFROM reviews\nORDER BY product_id, rating DESC, created_at DESC, id DESC;`, 'A ordenação define exatamente qual linha será preservada por produto.')]
      ),
      lesson('m17l02', 'GROUPING SETS e múltiplas granularidades', 'Especialista', 'Gerar detalhes e totais na mesma consulta.',
        [
          'GROUPING SETS permite definir vários agrupamentos em uma só operação. É uma generalização de ROLLUP e CUBE.',
          'Você pode retornar métricas por estado/segmento, só por estado e um total geral sem fazer três queries com UNION ALL.',
          'GROUPING(coluna) ajuda a distinguir um NULL real de um NULL produzido por uma linha de totalização.'
        ],
        `GROUP BY GROUPING SETS ((a,b), (a), ())`,
        [{ title: 'Clientes em múltiplos níveis', sql: `SELECT state, segment, COUNT(*) AS customers\nFROM customers\nGROUP BY GROUPING SETS ((state, segment), (state), ())\nORDER BY state NULLS LAST, segment NULLS LAST;`, explanation: 'O resultado contém detalhe estado+segmento, subtotal por estado e total geral.' }],
        [challenge('c052', 'Receita por canal e total', 'Especialista', 'Calcule receita por channel e também uma linha de total geral usando GROUPING SETS.', 'vw_order_totals possui channel e total_amount.', `SELECT channel, round(SUM(total_amount), 2) AS revenue\nFROM vw_order_totals\nWHERE status <> 'cancelled'\nGROUP BY GROUPING SETS ((channel), ())\nORDER BY channel NULLS LAST;`, 'O agrupamento vazio () representa o total geral.')]
      )
    ]
  },
  {
    id: 'm18', number: '18', title: 'Projeto final: análise completa do negócio', level: 'Especialista',
    description: 'Combine o que aprendeu em desafios de portfólio, sem uma única técnica obrigatória.',
    lessons: [
      lesson('m18l01', 'Capstone 1 — clientes e receita', 'Especialista', 'Construir uma visão executiva de clientes.',
        [
          'Agora o objetivo muda: você recebe uma pergunta de negócio, decide a granularidade, as tabelas, os filtros e a técnica SQL.',
          'Antes de codificar, escreva a granularidade em português: “uma linha por cliente”. Isso evita duplicação acidental em joins 1:N.',
          'Valide resultados em etapas. Compare COUNTs antes/depois de joins e use CTEs para tornar a lógica auditável.'
        ],
        `-- Granularidade alvo: 1 linha por cliente\n-- Depois escolha JOINs/agregações/janelas conforme a necessidade.`,
        [],
        [challenge('c053', 'Segmentação RFM simplificada', 'Especialista', 'Para cada cliente com pedidos não cancelados, calcule: recency_date (último pedido), frequency (pedidos) e monetary (receita). Depois ordene por monetary desc.', 'Use vw_order_totals e GROUP BY customer.', `SELECT c.id, c.name,\n       MAX(v.order_date) AS recency_date,\n       COUNT(*) AS frequency,\n       round(SUM(v.total_amount), 2) AS monetary\nFROM customers c\nJOIN vw_order_totals v ON v.customer_id = c.id\nWHERE v.status <> 'cancelled'\nGROUP BY c.id, c.name\nORDER BY monetary DESC;`, 'A view já define uma linha por pedido, então COUNT(*) representa frequência de pedidos sem duplicar itens.')]
      ),
      lesson('m18l02', 'Capstone 2 — produtos e performance comercial', 'Especialista', 'Produzir uma análise de produto que combine receita, unidades, margem e ranking.',
        [
          'Este desafio mistura múltiplos JOINs, agregação e window function. A prática importante é manter clara a granularidade de cada etapa.',
          'Como order_items está na granularidade de item do pedido, ela é adequada para unidades e receita por produto.',
          'Quando usar custo e preço, deixe explícito se a margem é calculada no preço atual do catálogo ou no unit_price histórico do pedido.'
        ],
        '', [],
        [challenge('c054', 'Ranking de produtos', 'Especialista', 'Calcule por produto: units_sold, item_revenue, estimated_margin = sum((unit_price-cost)*quantity*(1-discount)); depois rankeie por receita dentro de cada categoria.', 'Agregue primeiro em CTE; depois DENSE_RANK por category_id.', `WITH product_sales AS (\n  SELECT p.id, p.category_id, p.name,\n         SUM(oi.quantity) AS units_sold,\n         SUM(oi.line_total) AS item_revenue,\n         SUM((oi.unit_price - p.cost) * oi.quantity * (1 - oi.discount)) AS estimated_margin\n  FROM products p\n  JOIN order_items oi ON oi.product_id = p.id\n  JOIN orders o ON o.id = oi.order_id\n  WHERE o.status <> 'cancelled'\n  GROUP BY p.id, p.category_id, p.name\n)\nSELECT *,\n       DENSE_RANK() OVER (\n         PARTITION BY category_id\n         ORDER BY item_revenue DESC\n       ) AS category_revenue_rank\nFROM product_sales\nORDER BY category_id, category_revenue_rank, id;`, 'A CTE reduz primeiro para uma linha por produto. Só então a janela ranqueia dentro da categoria.')]
      ),
      lesson('m18l03', 'Capstone 3 — SLA de atendimento', 'Especialista', 'Construir indicadores de suporte a partir de timestamps e prioridades.',
        [
          'Pense em métricas que uma operação realmente acompanharia: volume, backlog, tempo médio/mediano de resolução e taxa de urgência.',
          'Nem todo ticket possui closed_at; defina claramente se métricas de resolução consideram apenas encerrados.',
          'percentile_cont permite calcular percentis contínuos, como mediana (0.5) e P90 (0.9), dentro de grupos.'
        ],
        `percentile_cont(0.5) WITHIN GROUP (ORDER BY valor)`,
        [],
        [challenge('c055', 'SLA por prioridade', 'Especialista', 'Para tickets encerrados, calcule por priority: quantidade, média de horas e mediana de horas de resolução.', 'Crie horas com EXTRACT(EPOCH...) e use percentile_cont.', `WITH resolved AS (\n  SELECT priority,\n         EXTRACT(EPOCH FROM (closed_at - opened_at)) / 3600.0 AS hours\n  FROM support_tickets\n  WHERE closed_at IS NOT NULL\n)\nSELECT priority,\n       COUNT(*) AS tickets,\n       round(AVG(hours)::numeric, 2) AS avg_hours,\n       round(percentile_cont(0.5) WITHIN GROUP (ORDER BY hours)::numeric, 2) AS median_hours\nFROM resolved\nGROUP BY priority\nORDER BY CASE priority\n  WHEN 'urgent' THEN 1\n  WHEN 'high' THEN 2\n  WHEN 'medium' THEN 3\n  ELSE 4\nEND;`, 'A CTE normaliza a duração em horas e as duas métricas são calculadas sobre a mesma população.')]
      )
    ]
  }
];

export const sqlReference = [
  ['SELECT', 'DQL', 'Define quais colunas, expressões ou cálculos aparecem no resultado. É a parte que molda a saída da consulta, não a origem dos dados.', 'SELECT id, name FROM customers;'],
  ['FROM', 'DQL', 'Indica a tabela, view, CTE ou subquery de onde as linhas serão lidas. É onde a consulta começa a formar o conjunto de dados.', 'SELECT * FROM products;'],
  ['WHERE', 'DQL/DML', 'Filtra linhas antes de agrupamentos, ordenação ou alterações. Em UPDATE e DELETE, é a proteção contra modificar mais linhas do que o desejado.', "WHERE state = 'SP'"],
  ['AS', 'DQL', 'Cria um nome temporário para coluna, expressão ou tabela. Ajuda a deixar o resultado e os JOINs mais legíveis.', 'price AS unit_price'],
  ['DISTINCT', 'DQL', 'Remove duplicidades considerando todas as colunas selecionadas. Use quando a pergunta pede valores únicos.', 'SELECT DISTINCT state FROM customers;'],
  ['ORDER BY', 'DQL', 'Define a ordem final das linhas retornadas. Sem ORDER BY, o banco não garante uma ordem estável.', 'ORDER BY order_date DESC'],
  ['ASC / DESC', 'DQL', 'Escolhe ordenação crescente ou decrescente. ASC é o padrão; DESC coloca maiores valores ou datas mais recentes primeiro.', 'ORDER BY price DESC'],
  ['NULLS FIRST/LAST', 'DQL', 'Controla onde os valores NULL aparecem na ordenação, evitando surpresas quando há dados ausentes.', 'ORDER BY closed_at NULLS LAST'],
  ['LIMIT', 'DQL', 'Restringe a quantidade de linhas retornadas. É ótimo para explorar dados, especialmente junto com ORDER BY.', 'LIMIT 20'],
  ['OFFSET', 'DQL', 'Pula uma quantidade de linhas antes de retornar o resultado. Serve para paginação simples, mas pode ficar caro em páginas muito profundas.', 'LIMIT 20 OFFSET 40'],
  ['AND', 'Expressão', 'Combina condições exigindo que todas sejam verdadeiras. Cada AND reduz o conjunto de linhas.', 'active = true AND stock > 0'],
  ['OR', 'Expressão', 'Combina condições permitindo que qualquer uma delas seja verdadeira. Use parênteses quando misturar OR com AND.', "state = 'SP' OR state = 'RJ'"],
  ['NOT', 'Expressão', 'Inverte uma condição booleana. É útil para negar EXISTS, IN, LIKE ou comparações simples.', 'NOT active'],
  ['IN', 'Expressão', 'Compara um valor com uma lista ou com o resultado de uma subquery. É mais claro que muitos OR para a mesma coluna.', "state IN ('SP','RJ')"],
  ['BETWEEN', 'Expressão', 'Testa uma faixa incluindo os dois limites. Para timestamp, muitas vezes prefira >= início e < próximo período.', 'price BETWEEN 100 AND 200'],
  ['LIKE / ILIKE', 'Expressão', 'Busca texto por padrão. LIKE diferencia maiúsculas/minúsculas; ILIKE ignora essa diferença no PostgreSQL.', "name ILIKE '%livro%'"],
  ['IS NULL', 'Expressão', 'Testa ausência de valor do jeito correto. NULL não é igual a nada, então coluna = NULL não funciona como filtro.', 'closed_at IS NULL'],
  ['COALESCE', 'Função', 'Retorna o primeiro valor não nulo da lista. É comum para trocar NULL por zero, texto padrão ou data alternativa.', 'COALESCE(closed_at::text, \'aberto\')'],
  ['NULLIF', 'Função', 'Retorna NULL quando dois valores são iguais. É muito usado para evitar divisão por zero.', 'value / NULLIF(total, 0)'],
  ['CASE', 'Expressão', 'Cria regras condicionais dentro do SQL. Retorna o primeiro THEN cuja condição WHEN for verdadeira.', "CASE WHEN stock < 15 THEN 'crítico' ELSE 'ok' END"],
  ['CAST / ::', 'Expressão', 'Converte um valor para outro tipo. No PostgreSQL, :: é uma forma curta de escrever CAST.', "'10'::integer"],
  ['COUNT', 'Agregação', 'Conta linhas ou valores. COUNT(*) conta linhas; COUNT(coluna) ignora NULL; COUNT(DISTINCT coluna) conta valores únicos.', 'COUNT(*)'],
  ['SUM', 'Agregação', 'Soma valores numéricos dentro de um grupo ou da consulta inteira. SUM sem linhas pode retornar NULL.', 'SUM(total_amount)'],
  ['AVG', 'Agregação', 'Calcula média dos valores não nulos. Em dinheiro, geralmente combine com ROUND para apresentação.', 'AVG(price)'],
  ['MIN / MAX', 'Agregação', 'Retorna o menor ou maior valor de um conjunto. Funciona com números, datas, textos e outros tipos ordenáveis.', 'MAX(order_date)'],
  ['GROUP BY', 'DQL', 'Agrupa linhas que compartilham a mesma chave para calcular métricas por grupo, como receita por estado ou pedidos por canal.', 'GROUP BY state'],
  ['HAVING', 'DQL', 'Filtra grupos depois do GROUP BY. Use HAVING para condições sobre COUNT, SUM, AVG e outras agregações.', 'HAVING COUNT(*) > 5'],
  ['FILTER', 'Agregação', 'Aplica uma condição a uma agregação específica sem filtrar a consulta inteira. Ajuda a criar várias métricas em uma linha.', "COUNT(*) FILTER (WHERE status='paid')"],
  ['ON', 'DQL', 'Define a regra de correspondência de um JOIN. Normalmente compara uma FK com a PK da tabela relacionada.', 'ON c.id = o.customer_id'],
  ['USING', 'DQL', 'Forma curta de JOIN quando as duas tabelas têm coluna com o mesmo nome. Evita repetir a igualdade no ON.', 'JOIN x USING (customer_id)'],
  ['INNER JOIN / JOIN', 'DQL', 'Combina tabelas mantendo apenas linhas que encontram par pelo ON. É o JOIN padrão para relações obrigatórias.', 'JOIN customers c ON c.id = o.customer_id'],
  ['LEFT JOIN', 'DQL', 'Mantém todas as linhas da esquerda e preenche a direita com NULL quando não há correspondência. Use para preservar a base principal.', 'LEFT JOIN reviews r ON r.product_id = p.id'],
  ['RIGHT JOIN', 'DQL', 'Mantém todas as linhas da direita. Costuma ser reescrito como LEFT JOIN invertendo a ordem das tabelas para facilitar a leitura.', 'RIGHT JOIN ...'],
  ['FULL JOIN', 'DQL', 'Preserva linhas dos dois lados, com ou sem correspondência. É útil para reconciliação entre dois conjuntos.', 'FULL JOIN ... ON ...'],
  ['CROSS JOIN', 'DQL', 'Gera todas as combinações entre duas fontes. Use para grades de análise ou para aplicar uma CTE de uma linha a várias linhas.', 'CROSS JOIN generate_series(1,3)'],
  ['LATERAL', 'DQL', 'Permite que uma subquery no FROM use colunas das tabelas anteriores. É poderoso para top N por grupo e expansão de arrays.', 'LEFT JOIN LATERAL (...) x ON true'],
  ['EXISTS', 'Expressão', 'Verifica se uma subquery encontra pelo menos uma linha. Expressa perguntas como “existe pedido para este cliente?”.', 'WHERE EXISTS (SELECT 1 ...)'],
  ['WITH', 'DQL/DML', 'Cria CTEs nomeadas para dividir a consulta em etapas legíveis. Ajuda a explicar e testar transformações intermediárias.', 'WITH x AS (...) SELECT * FROM x;'],
  ['WITH RECURSIVE', 'DQL', 'Cria CTEs que alimentam a si mesmas, úteis para hierarquias e caminhos. Precisa de uma âncora e um passo recursivo.', 'WITH RECURSIVE org AS (...)'],
  ['UNION', 'Conjunto', 'Empilha resultados compatíveis e remove duplicatas. Use quando a lista final deve ter valores únicos.', 'SELECT ... UNION SELECT ...'],
  ['UNION ALL', 'Conjunto', 'Empilha resultados compatíveis preservando duplicatas. É mais direto e geralmente mais barato que UNION.', 'SELECT ... UNION ALL SELECT ...'],
  ['INTERSECT', 'Conjunto', 'Retorna apenas linhas que aparecem nos dois resultados. Serve para encontrar a interseção entre populações.', 'SELECT ... INTERSECT SELECT ...'],
  ['EXCEPT', 'Conjunto', 'Retorna linhas do primeiro resultado que não aparecem no segundo. É uma forma clara de diferença de conjuntos.', 'SELECT ... EXCEPT SELECT ...'],
  ['INSERT', 'DML', 'Cria novas linhas em uma tabela. Prefira informar a lista de colunas para o comando continuar claro se a tabela mudar.', 'INSERT INTO ... VALUES ...'],
  ['UPDATE', 'DML', 'Altera valores em linhas existentes. Valide o WHERE com SELECT antes de executar em dados importantes.', 'UPDATE ... SET ... WHERE ...'],
  ['DELETE', 'DML', 'Remove linhas existentes. Sem WHERE remove tudo que a tabela permitir, então pratique dentro de transação.', 'DELETE FROM ... WHERE ...'],
  ['RETURNING', 'DML', 'Mostra as linhas afetadas por INSERT, UPDATE ou DELETE no PostgreSQL. Economiza uma consulta de conferência.', 'UPDATE ... RETURNING id;'],
  ['CREATE TABLE', 'DDL', 'Cria uma tabela definindo colunas, tipos, defaults e constraints. É a base da modelagem física.', 'CREATE TABLE x (...);'],
  ['ALTER TABLE', 'DDL', 'Altera uma tabela existente, como adicionar coluna, constraint ou modificar defaults. Pode bloquear objetos em uso.', 'ALTER TABLE x ADD COLUMN ...;'],
  ['DROP', 'DDL', 'Remove um objeto do banco, como tabela, view ou índice. É destrutivo e deve ser usado com plena certeza.', 'DROP TABLE x;'],
  ['TRUNCATE', 'DDL', 'Remove rapidamente todas as linhas de uma tabela. Não executa linha a linha como DELETE e pode reiniciar identities.', 'TRUNCATE TABLE x;'],
  ['PRIMARY KEY', 'Constraint', 'Identifica cada linha de forma única e não nula. Normalmente é o alvo de chaves estrangeiras.', 'id bigint PRIMARY KEY'],
  ['FOREIGN KEY', 'Constraint', 'Garante que um valor exista em outra tabela. Protege relações como orders.customer_id apontando para customers.id.', 'customer_id REFERENCES customers(id)'],
  ['UNIQUE', 'Constraint', 'Impede duplicidade de uma coluna ou combinação de colunas. Útil para e-mail, SKU e chaves naturais.', 'UNIQUE(email)'],
  ['CHECK', 'Constraint', 'Valida uma regra por linha, como faixa de rating ou estoque não negativo. Ajuda o banco a rejeitar dados inválidos.', 'CHECK (rating BETWEEN 1 AND 5)'],
  ['NOT NULL', 'Constraint', 'Impede que uma coluna fique sem valor. Use quando o dado é obrigatório para o sentido da linha.', 'name text NOT NULL'],
  ['DEFAULT', 'DDL', 'Define o valor usado quando o INSERT omite a coluna. Bom para datas de criação, flags e objetos vazios.', 'created_at timestamp DEFAULT now()'],
  ['GENERATED AS IDENTITY', 'DDL', 'Define uma coluna numérica cujo valor é gerado automaticamente pelo PostgreSQL, normalmente usada como chave primária.', 'id bigint GENERATED ALWAYS AS IDENTITY'],
  ['GENERATED ALWAYS AS (...) STORED', 'DDL', 'Cria uma coluna calculada e armazenada. O PostgreSQL recalcula o valor quando as colunas usadas na expressão mudam.', 'line_total numeric GENERATED ALWAYS AS (...) STORED'],
  ['GRANT', 'DCL', 'Concede permissões a usuários ou papéis, como ler uma tabela ou executar uma função.', 'GRANT SELECT ON customers TO analyst;'],
  ['REVOKE', 'DCL', 'Remove permissões concedidas anteriormente. É o par de segurança do GRANT.', 'REVOKE SELECT ON customers FROM analyst;'],
  ['BEGIN', 'TCL', 'Inicia uma transação explícita. Depois dele, as mudanças ficam pendentes até COMMIT ou ROLLBACK.', 'BEGIN;'],
  ['COMMIT', 'TCL', 'Confirma definitivamente as alterações feitas na transação atual.', 'COMMIT;'],
  ['ROLLBACK', 'TCL', 'Desfaz alterações ainda não confirmadas. É o botão de segurança durante exercícios de DML.', 'ROLLBACK;'],
  ['SAVEPOINT', 'TCL', 'Marca um ponto interno da transação para desfazer apenas parte do trabalho com ROLLBACK TO SAVEPOINT.', 'SAVEPOINT before_step;'],
  ['CREATE VIEW', 'DDL', 'Cria uma consulta salva que pode ser lida como tabela virtual. Centraliza lógica repetida sem duplicar dados.', 'CREATE VIEW v AS SELECT ...;'],
  ['CREATE MATERIALIZED VIEW', 'DDL', 'Cria uma consulta salva com resultado materializado. Armazena dados calculados e precisa de refresh para atualizar.', 'CREATE MATERIALIZED VIEW mv AS SELECT ...;'],
  ['REFRESH MATERIALIZED VIEW', 'DDL', 'Recalcula os dados de uma materialized view. Use quando a origem mudou e o resumo precisa refletir o estado novo.', 'REFRESH MATERIALIZED VIEW mv;'],
  ['CREATE INDEX', 'DDL', 'Cria uma estrutura auxiliar para acelerar certos filtros, joins e ordenações. Índices ajudam leituras, mas custam escrita e espaço.', 'CREATE INDEX idx ON orders(customer_id);'],
  ['B-tree', 'Performance', 'Tipo padrão de índice, indicado para igualdade, intervalos e ordenação em colunas comuns como datas, ids e status.', 'CREATE INDEX idx ON orders(status, order_date);'],
  ['GIN', 'Performance', 'Tipo de índice voltado para valores com múltiplos elementos internos, como JSONB e arrays. Ajuda operadores de contenção como @>.', 'CREATE INDEX idx ON products USING gin(tags);'],
  ['EXPLAIN', 'Performance', 'Mostra o plano estimado que o PostgreSQL pretende usar. Ajuda a entender scans, joins, custos e estimativas.', 'EXPLAIN SELECT ...;'],
  ['EXPLAIN ANALYZE', 'Performance', 'Executa a consulta e mostra o plano real com tempos. Use em SELECTs seguros ou dentro de transação quando houver escrita.', 'EXPLAIN (ANALYZE, BUFFERS) SELECT ...;'],
  ['OVER', 'Janela', 'Transforma uma função em cálculo de janela, permitindo calcular totais, médias e rankings sem reduzir as linhas.', 'SUM(total) OVER (...)'],
  ['PARTITION BY', 'Janela', 'Divide a janela em grupos independentes. O cálculo reinicia a cada cliente, categoria ou outra chave escolhida.', 'OVER (PARTITION BY customer_id)'],
  ['ROWS BETWEEN', 'Janela', 'Define o intervalo de linhas usado por uma window function, essencial para acumulados e médias móveis.', 'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW'],
  ['ROW_NUMBER', 'Janela', 'Numera linhas sequencialmente dentro da janela. Empates ainda recebem números diferentes.', 'ROW_NUMBER() OVER (...)'],
  ['RANK / DENSE_RANK', 'Janela', 'Cria ranking considerando empates. RANK deixa lacunas após empate; DENSE_RANK não deixa lacunas.', 'DENSE_RANK() OVER (ORDER BY revenue DESC)'],
  ['LAG / LEAD', 'Janela', 'Acessa valores de linhas anteriores ou posteriores na mesma sequência. Ideal para comparar eventos no tempo.', 'LAG(total) OVER (ORDER BY date)'],
  ['NTILE', 'Janela', 'Divide linhas ordenadas em grupos numerados, como quartis ou decis. Útil para segmentação e scores analíticos.', 'NTILE(4) OVER (ORDER BY revenue)'],
  ['DISTINCT ON', 'PostgreSQL', 'Mantém a primeira linha de cada grupo conforme o ORDER BY. É específico do PostgreSQL e ótimo para “mais recente por cliente”.', 'SELECT DISTINCT ON (customer_id) ...'],
  ['DATE_TRUNC', 'Função', 'Arredonda uma data/timestamp para uma granularidade, como dia, mês ou ano. Muito usado em relatórios temporais.', "DATE_TRUNC('month', order_date)"],
  ['EXTRACT', 'Função', 'Extrai partes de datas ou intervalos, como ano, mês ou segundos. Com EPOCH, converte intervalos em segundos.', 'EXTRACT(YEAR FROM signup_date)'],
  ['EPOCH', 'Data/tempo', 'Campo especial usado com EXTRACT. Em intervalos, retorna a duração total em segundos; em timestamps, retorna segundos desde 1970-01-01 00:00:00 UTC.', 'EXTRACT(EPOCH FROM (closed_at - opened_at)) / 3600.0'],
  ['ROUND', 'Função', 'Arredonda números para apresentação ou cálculo com casas decimais controladas.', 'ROUND(SUM(total_amount), 2)'],
  ['JSONB -> / ->>', 'PostgreSQL', 'Extrai dados de JSONB. -> mantém JSON; ->> devolve texto, que pode ser convertido para outro tipo.', "attributes->>'color'"],
  ['JSONB @>', 'PostgreSQL', 'Testa se um documento JSONB contém outro. Pode aproveitar índice GIN em colunas JSONB.', `attributes @> '{"color":"preto"}'::jsonb`],
  ['ARRAY / ANY', 'PostgreSQL', 'Cria e consulta arrays nativos. ANY testa se um valor aparece em algum item do array.', "'premium' = ANY(tags)"],
  ['UNNEST', 'PostgreSQL', 'Expande um array em várias linhas. Costuma aparecer com CROSS JOIN LATERAL para analisar tags e listas.', 'CROSS JOIN LATERAL unnest(tags)'],
  ['WITHIN GROUP', 'Analítico', 'Define a ordenação interna de agregações ordenadas, como percentis. A função usa essa ordem para calcular mediana, P90 e métricas parecidas.', 'percentile_cont(0.5) WITHIN GROUP (ORDER BY total_amount)'],
  ['PERCENTILE_CONT', 'Analítico', 'Calcula percentis contínuos, como mediana ou P90. É útil para métricas menos sensíveis a extremos que a média.', 'percentile_cont(0.5) WITHIN GROUP (ORDER BY total_amount)'],
  ['RFM', 'Conceito analítico', 'Segmentação de clientes por Recency, Frequency e Monetary: quão recente foi a compra, quantas vezes comprou e quanto gastou.', 'recency_days, frequency, monetary'],
  ['Coorte', 'Conceito analítico', 'Grupo de clientes que compartilha um evento inicial no mesmo período, como mês da primeira compra. Serve para análise de retenção.', 'cohort_month = MIN(order_month)'],
  ['Pareto', 'Conceito analítico', 'Análise do acumulado ordenado para identificar quais itens concentram a maior parte do resultado, como os produtos responsáveis por 80% da receita.', 'SUM(revenue) OVER (ORDER BY revenue DESC)'],
  ['Market basket', 'Conceito analítico', 'Análise de produtos comprados juntos. Normalmente usa self join nos itens do pedido para formar pares dentro do mesmo carrinho.', 'oi1.order_id = oi2.order_id'],
  ['GROUPING SETS', 'Analítico', 'Calcula várias granularidades de GROUP BY na mesma consulta, como detalhe, subtotal e total geral.', 'GROUP BY GROUPING SETS ((state), ())']
];

export const schemaTables = [
  { name: 'departments', purpose: 'Departamentos da empresa', key: 'id', relations: [] },
  { name: 'employees', purpose: 'Funcionários e hierarquia', key: 'id', relations: ['department_id → departments.id', 'manager_id → employees.id'] },
  { name: 'customers', purpose: 'Clientes e perfil', key: 'id', relations: [] },
  { name: 'categories', purpose: 'Categorias de produto', key: 'id', relations: [] },
  { name: 'suppliers', purpose: 'Fornecedores', key: 'id', relations: [] },
  { name: 'products', purpose: 'Catálogo, estoque, JSONB e tags', key: 'id', relations: ['category_id → categories.id', 'supplier_id → suppliers.id'] },
  { name: 'orders', purpose: 'Cabeçalho do pedido', key: 'id', relations: ['customer_id → customers.id', 'salesperson_id → employees.id'] },
  { name: 'order_items', purpose: 'Itens dos pedidos', key: 'id', relations: ['order_id → orders.id', 'product_id → products.id'] },
  { name: 'payments', purpose: 'Pagamento de cada pedido', key: 'id', relations: ['order_id → orders.id'] },
  { name: 'reviews', purpose: 'Avaliações de produtos', key: 'id', relations: ['customer_id → customers.id', 'product_id → products.id'] },
  { name: 'support_tickets', purpose: 'Chamados de suporte', key: 'id', relations: ['customer_id → customers.id', 'assigned_to → employees.id'] },
  { name: 'inventory_movements', purpose: 'Entradas, saídas e ajustes de estoque', key: 'id', relations: ['product_id → products.id'] },
];

export const studyPath = [
  'Faça os módulos 00–05 em ordem e execute todos os exemplos no DBeaver.',
  'Nos módulos 06–10, tente cada desafio por pelo menos 10 minutos antes de abrir a solução.',
  'A partir do módulo 11, use transações para qualquer experimento que altere dados.',
  'Nos módulos avançados, rode EXPLAIN e tente explicar a granularidade do resultado antes de executar.',
  'Finalize os três capstones sem consultar as respostas; depois compare abordagem, não apenas texto idêntico.'
];
