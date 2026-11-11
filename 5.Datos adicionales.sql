-- ============================================================
-- ServiTable - Mas productos para el menu (version SQL Server)
-- Ejecutar DESPUES de 01_crear_base_y_tablas.sql y 02_datos_prueba.sql.
-- Se puede ejecutar varias veces: no duplica categorias ni productos.
-- Agrega 20 productos y las categorias que faltan.
-- Resultado esperado con los datos de prueba originales: 23 productos y 1 no disponible.
-- ============================================================

USE ServiTable;

DECLARE @r INT = (SELECT TOP 1 id_restaurante FROM dbo.restaurante ORDER BY id_restaurante);

-- 1. Categorias que faltan
INSERT INTO dbo.categoria (id_restaurante, nombre, orden)
SELECT @r, v.nombre, v.orden
FROM (VALUES ('Entradas', 1), ('Platos fuertes', 2), ('Postres', 4)) AS v(nombre, orden)
WHERE NOT EXISTS (SELECT 1 FROM dbo.categoria c WHERE c.id_restaurante = @r AND c.nombre = v.nombre);

-- 2. Orden en que se muestran: Entradas, Platos fuertes, Bebidas, Postres, Comidas
UPDATE dbo.categoria SET orden = 3 WHERE id_restaurante = @r AND nombre = 'Bebidas';
UPDATE dbo.categoria SET orden = 5 WHERE id_restaurante = @r AND nombre = 'Comidas';

-- 3. Productos nuevos (se busca la categoria por nombre, asi no depende de los ids)
INSERT INTO dbo.producto (id_restaurante, id_categoria, nombre, descripcion, precio, disponible)
SELECT @r, c.id_categoria, v.nombre, v.descripcion, v.precio, v.disponible
FROM (VALUES
  -- Entradas
  ('Entradas', 'Empanadas de carne', 'Cuatro empanadas crocantes con aji', 12000, 1),
  ('Entradas', 'Alitas BBQ', 'Seis alitas en salsa BBQ con papas', 24000, 1),
  ('Entradas', 'Ensalada cesar', 'Lechuga, pollo, crutones y parmesano', 19000, 1),
  ('Entradas', 'Sopa del dia', 'Porcion individual con pan', 13000, 1),
  ('Entradas', 'Deditos de queso', 'Ocho deditos fritos con salsa de guayaba', 15000, 1),
  -- Platos fuertes
  ('Platos fuertes', 'Bandeja paisa', 'Frijoles, arroz, carne, chicharron, huevo y arepa', 38000, 1),
  ('Platos fuertes', 'Pechuga a la plancha', 'Pechuga con arroz, ensalada y papas', 30000, 1),
  ('Platos fuertes', 'Salmon al horno', 'Salmon con vegetales salteados y pure', 45000, 1),
  ('Platos fuertes', 'Pizza margarita', 'Pizza personal con tomate, queso y albahaca', 27000, 1),
  ('Platos fuertes', 'Lasana de carne', 'Lasana gratinada con salsa bolonesa', 33000, 1),
  ('Platos fuertes', 'Churrasco', 'Corte de res de 250 g con papas y ensalada', 42000, 1),
  -- Bebidas
  ('Bebidas', 'Jugo de mora', 'Vaso grande en agua o leche', 9000, 1),
  ('Bebidas', 'Limonada de coco', 'Limonada cremosa con coco', 11000, 1),
  ('Bebidas', 'Cerveza nacional', 'Botella 330 ml', 8000, 1),
  ('Bebidas', 'Agua con gas', 'Botella 300 ml', 5000, 1),
  ('Bebidas', 'Cafe americano', 'Taza de cafe recien hecho', 5500, 1),
  -- Postres
  ('Postres', 'Cheesecake de fresa', 'Porcion con salsa de fresa', 15000, 1),
  ('Postres', 'Flan de caramelo', 'Flan casero con caramelo', 10000, 1),
  ('Postres', 'Helado de tres sabores', 'Tres bolas a elegir', 12000, 1),
  ('Postres', 'Tiramisu', 'Producto de ejemplo marcado como no disponible', 16000, 0)
) AS v(categoria, nombre, descripcion, precio, disponible)
JOIN dbo.categoria c ON c.id_restaurante = @r AND c.nombre = v.categoria
WHERE NOT EXISTS (SELECT 1 FROM dbo.producto p WHERE p.id_restaurante = @r AND p.nombre = v.nombre);

-- 4. Verificacion. Con los datos de prueba originales debe salir:
--    Entradas 5, Platos fuertes 6, Bebidas 6, Postres 4, Comidas 2 -> 23 productos, 1 no disponible (Tiramisu)
SELECT c.nombre AS categoria,
       COUNT(p.id_producto) AS productos,
       COUNT(CASE WHEN p.disponible = 0 THEN 1 END) AS no_disponibles
FROM dbo.categoria c
LEFT JOIN dbo.producto p ON p.id_categoria = c.id_categoria
WHERE c.id_restaurante = @r
GROUP BY c.nombre, c.orden
ORDER BY c.orden;