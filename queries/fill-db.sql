
INSERT INTO users(id, email, password_hash, first_name, last_name, avatar) VALUES
  ('1', 'ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg'),
	('2', 'petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar2.jpg');
INSERT INTO categories(id, name) VALUES
  ('1', 'Книги'),
	('2', 'Разное'),
	('3', 'Посуда'),
	('4', 'Игры'),
	('5', 'Животные'),
	('6', 'Журналы'),
	('7', 'Инструменты'),
	('8', 'Музыка'),
	('9', 'Фильмы');
ALTER TABLE offers DISABLE TRIGGER ALL;
INSERT INTO offers(id, title, description, type, sum, picture, user_id) VALUES
  ('1', 'Куплю детские санки', 'Такая только у меня и у Майкла Джексона. Если найдёте дешевле — сброшу цену. Две страницы заляпаны свежим кофе. Товар в отличном состоянии.', 'OFFER', 73543, 'item08.jpg', 2),
	('2', 'Продам круглошлифовальный станок', 'Даю недельную гарантию. Мой дед не мог её сломать. Если найдёте дешевле — сброшу цену. Такая только у меня и у Майкла Джексона.', 'SALE', 27884, 'item05.jpg', 2),
	('3', 'Куплю детские санки', 'Кому нужен этот новый телефон, если тут такое... Срочно!!! Это настоящая находка для коллекционера! Если найдёте дешевле — сброшу цену.', 'SALE', 5109, 'item08.jpg', 2),
	('4', 'Продам DVD трилогию "Властелин колец"', 'Бонусом отдам все аксессуары. Мой дед не мог её сломать. Не пытайтесь торговаться. Цену вещам я знаю. Продаю с болью в сердце...', 'OFFER', 98701, 'item05.jpg', 2),
	('5', 'Продам новую приставку Sony Playstation 5', 'Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Если товар не понравится — верну всё до последней копейки. Даю недельную гарантию.', 'SALE', 78066, 'item10.jpg', 1),
	('6', 'Отдам в хорошие руки подшивку «Мурзилка»', 'Бонусом отдам все аксессуары. Такая только у меня и у Майкла Джексона. Срочно!!! При покупке с меня бесплатная доставка в черте города.', 'SALE', 30954, 'item08.jpg', 1),
	('7', 'Продам круглошлифовальный станок', 'Мой дед не мог её сломать. Кажется, что это хрупкая вещь. Пользовались бережно и только по большим праздникам. Таких предложений больше нет!', 'SALE', 80210, 'item09.jpg', 1),
	('8', 'Продам новую приставку Sony Playstation 5', 'Это настоящая находка для коллекционера! Пользовались бережно и только по большим праздникам. Таких предложений больше нет! Если товар не понравится — верну всё до последней копейки.', 'SALE', 68449, 'item14.jpg', 1),
	('9', 'Продам DVD трилогию "Властелин колец"', 'Даю недельную гарантию. Кому нужен этот новый телефон, если тут такое... Пользовались бережно и только по большим праздникам. Две страницы заляпаны свежим кофе.', 'SALE', 20725, 'item01.jpg', 1),
	('10', 'Продам DVD трилогию "Властелин колец"', 'Пользовались бережно и только по большим праздникам. Срочно!!! Если найдёте дешевле — сброшу цену. При покупке с меня бесплатная доставка в черте города.', 'SALE', 48907, 'item09.jpg', 1);
ALTER TABLE offers ENABLE TRIGGER ALL;
ALTER TABLE offer_categories DISABLE TRIGGER ALL;
INSERT INTO offer_categories(offer_id, category_id) VALUES
  (1, 2),
	(2, 5),
	(3, 9),
	(4, 1),
	(5, 9),
	(6, 2),
	(7, 3),
	(8, 5),
	(9, 2),
	(10, 6);
ALTER TABLE offer_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO COMMENTS(id, text, user_id, offer_id) VALUES
  ('1', 'Неплохо, но дорого. А где блок питания? Вы что?! В магазине дешевле.', 2, 1),
	('2', 'Вы что?! В магазине дешевле. А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца.', 2, 2),
	('3', 'Совсем немного...', 2, 2),
	('4', 'А где блок питания?', 2, 3),
	('5', 'Оплата наличными или перевод на карту?', 2, 3),
	('6', 'Совсем немного... Оплата наличными или перевод на карту?', 2, 3),
	('7', 'Неплохо, но дорого.', 1, 4),
	('8', 'А где блок питания? А сколько игр в комплекте?', 1, 4),
	('9', 'Продаю в связи с переездом. Отрываю от сердца.', 1, 5),
	('10', 'Почему в таком ужасном состоянии? А где блок питания?', 2, 5),
	('11', 'Оплата наличными или перевод на карту?', 1, 5),
	('12', 'Неплохо, но дорого.', 1, 6),
	('13', 'Совсем немного... Неплохо, но дорого.', 1, 6),
	('14', 'Оплата наличными или перевод на карту?', 2, 7),
	('15', 'Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?', 1, 7),
	('16', 'Вы что?! В магазине дешевле.', 2, 7),
	('17', 'Оплата наличными или перевод на карту?', 2, 8),
	('18', 'Почему в таком ужасном состоянии? Неплохо, но дорого.', 2, 9),
	('19', 'С чем связана продажа? Почему так дешёво?', 1, 10),
	('20', 'Почему в таком ужасном состоянии? Неплохо, но дорого. Совсем немного...', 2, 10),
	('21', 'А где блок питания? Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво?', 1, 10),
	('22', 'А сколько игр в комплекте?', 2, 10);
ALTER TABLE comments ENABLE TRIGGER ALL;