import hamburguesa from "../assets/Hamburguesa.png";
import limonada from "../assets/Limonada de coco.png";

export const categories = [
  "Entradas",
  "Platos fuertes",
  "Bebidas",
  "Postres",
];

export const formatPrice = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);

export const fetchMenu = async () => {
  const respuesta = await fetch("/api/restaurantes/1/menu");

  if (!respuesta.ok) {
    throw new Error(`Error al cargar el menú: ${respuesta.status}`);
  }

  const datos = await respuesta.json();

  return datos.categorias.flatMap((categoria) =>
    categoria.productos.map((producto) => ({
      id: producto.idProducto,
      category: categoria.nombre,
      name: producto.nombre,
      description: producto.descripcion ?? "",
      price: producto.precio,
      image:
        producto.imagenUrl ||
        (producto.nombre.toLowerCase().includes("limonada")
          ? limonada
          : hamburguesa),
    }))
  );
};