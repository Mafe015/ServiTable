-- ============================================================
-- ServiTable - Mas productos para el menu
-- Ejecutar DESPUES de servitable_schema.sql. Ejecutar UNA sola vez.
-- Agrega 20 productos a los 6 que ya existen (total 26).
-- Usa el nombre de la categoria, asi no depende de los ids.
-- ============================================================

USE servitable;

-- Entradas
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Empanadas de carne', 'Cuatro empanadas crocantes con aji', 12000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Entradas';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Alitas BBQ', 'Seis alitas en salsa BBQ con papas', 24000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Entradas';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Ensalada cesar', 'Lechuga, pollo, crutones y parmesano', 19000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Entradas';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Sopa del dia', 'Porcion individual con pan', 13000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Entradas';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Deditos de queso', 'Ocho deditos fritos con salsa de guayaba', 15000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Entradas';

-- Platos fuertes
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Bandeja paisa', 'Frijoles, arroz, carne, chicharron, huevo y arepa', 38000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Platos fuertes';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Pechuga a la plancha', 'Pechuga con arroz, ensalada y papas', 30000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Platos fuertes';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Salmon al horno', 'Salmon con vegetales salteados y pure', 45000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Platos fuertes';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Pizza margarita', 'Pizza personal con tomate, queso y albahaca', 27000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Platos fuertes';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Lasana de carne', 'Lasana gratinada con salsa bolonesa', 33000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Platos fuertes';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Churrasco', 'Corte de res de 250 g con papas y ensalada', 42000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Platos fuertes';

-- Bebidas
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Jugo de mora', 'Vaso grande en agua o leche', 9000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Bebidas';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Limonada de coco', 'Limonada cremosa con coco', 11000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Bebidas';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Cerveza nacional', 'Botella 330 ml', 8000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Bebidas';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Agua con gas', 'Botella 300 ml', 5000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Bebidas';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Cafe americano', 'Taza de cafe recien hecho', 5500 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Bebidas';

-- Postres
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Cheesecake de fresa', 'Porcion con salsa de fresa', 15000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Postres';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Flan de caramelo', 'Flan casero con caramelo', 10000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Postres';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio)
SELECT 1, id_categoria, 'Helado de tres sabores', 'Tres bolas a elegir', 12000 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Postres';
INSERT INTO producto (id_restaurante, id_categoria, nombre, descripcion, precio, disponible)
SELECT 1, id_categoria, 'Tiramisu', 'Producto de ejemplo marcado como agotado', 16000, 0 FROM categoria WHERE id_restaurante = 1 AND nombre = 'Postres';

-- Verificacion: deben salir 26 productos y 1 agotado (Tiramisu)
SELECT c.nombre AS categoria, COUNT(*) AS productos, SUM(p.disponible = 0) AS agotados
FROM producto p JOIN categoria c ON c.id_categoria = p.id_categoria
GROUP BY c.nombre ORDER BY c.orden;
