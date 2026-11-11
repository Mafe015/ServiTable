/* Consultas para verificar en la base de datos lo que registra la API (evidencia para Jira). */
USE ServiTable;
GO
-- Últimos pedidos con su mesa y estado
SELECT TOP 10 p.id_pedido, m.numero AS mesa, p.estado, p.total, p.creado_en
FROM dbo.pedido p JOIN dbo.mesa m ON m.id_mesa = p.id_mesa
ORDER BY p.id_pedido DESC;

-- Detalle del último pedido
SELECT d.id_detalle, d.id_pedido, pr.nombre, d.cantidad, d.precio_unitario, d.subtotal
FROM dbo.detalle_pedido d JOIN dbo.producto pr ON pr.id_producto = d.id_producto
WHERE d.id_pedido = (SELECT MAX(id_pedido) FROM dbo.pedido);

-- Coherencia: el total del pedido debe ser igual a la suma de sus subtotales (debe devolver 0 filas)
SELECT p.id_pedido, p.total, SUM(d.subtotal) AS suma_detalle
FROM dbo.pedido p JOIN dbo.detalle_pedido d ON d.id_pedido = p.id_pedido
GROUP BY p.id_pedido, p.total
HAVING p.total <> SUM(d.subtotal);

-- Estados permitidos (debe fallar por la restricción ck_pedido_estado)
-- UPDATE dbo.pedido SET estado = 'inventado' WHERE id_pedido = 1;
GO
