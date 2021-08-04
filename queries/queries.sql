-- Запрос всех категорий.
SELECT * FROM categories;
-- Запрос категорий для которых создано минимум одно объявление.
SELECT
categories.id,
categories.name
FROM categories
JOIN offer_categories
ON categories.id = offer_categories.category_id
GROUP BY id ORDER BY id;
-- Запрос категорий с количеством объявлений.
SELECT
categories.id,
categories.name,
count(offer_categories.offer_id) as offers_count
FROM categories LEFT JOIN offer_categories
ON categories.id = offer_categories.category_id
GROUP BY id ORDER BY id;
-- Запрос объявлений. Сначала свежие.
SELECT
offers.id,
offers.title,
offers.sum,
offers.type,
offers.description,
offers.created_at,
concat(users.first_name, ' ', users.last_name) as user,
users.email,
count(comments.id) AS comments_count,
string_agg(DISTINCT categories.name, ', ') AS categories
FROM offers
JOIN offer_categories ON offers.id = offer_categories.offer_id
JOIN categories ON offer_categories.category_id = categories.id
LEFT JOIN comments ON offers.id = comments.offer_id
JOIN users ON offers.user_id = users.id
GROUP BY offers.id, users.id
ORDER BY offers.created_at DESC;
-- Запрос полной информации определённого объявления.
SELECT
offers.*,
concat(users.first_name, ' ', users.last_name) as user,
users.email,
count(comments.id) as comments_count,
string_agg(categories.name, ', ') as categories
FROM offers
JOIN users ON offers.user_id = users.id
LEFT JOIN comments ON offers.id = comments.offer_id
JOIN offer_categories ON offers.id = offer_categories.offer_id
JOIN categories ON offer_categories.category_id = categories.id
WHERE offers.id = 1
GROUP BY offers.id, users.id;
-- Запрос 5 свежих комментариев.
SELECT
comments.id,
comments.offer_id,
concat(users.first_name, ' ', users.last_name) as user,
comments.text
FROM comments
JOIN users ON comments.user_id = users.id
ORDER BY comments.created_at DESC LIMIT 5;
-- Запрос списка комментариев для определённого объявления. Сначала новые.
SELECT
comments.id,
comments.offer_id,
concat(users.first_name, ' ', users.last_name) as user,
comments.text
FROM comments
JOIN users ON comments.user_id = users.id
WHERE comments.offer_id = 2
ORDER BY comments.created_at DESC;
-- Запрос 2 объявлений, соответствующих типу «куплю».
SELECT * FROM offers
WHERE offers.type = 'OFFER' LIMIT 2;
-- Изменение заголовка определённого объявления на «Уникальное предложение!».
UPDATE offers set title = 'Уникальное предложение!'
WHERE  offers.id = 1;
