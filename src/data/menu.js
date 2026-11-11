import alitas from "../assets/Alitas BBQ.png";
import bandeja from "../assets/Bandeja Paisa.png";
import cafe from "../assets/Cafe.png";
import cheesecake from "../assets/Cheescake.png";
import churrasco from "../assets/Churrascoalbondigas.png";
import deditos from "../assets/Deditos de queso.png";
import empanadas from "../assets/Empanadas criollas.png";
import ensalada from "../assets/Ensalada cesarBBQ.png";
import flan from "../assets/Flan de caramelo.png";
import cerveza from "../assets/Gaseosa.png";
import hamburguesa from "../assets/Hamburguesa.png";
import helado from "../assets/Helado.png";
import jugos from "../assets/Jugos.png";
import lasana from "../assets/Lasana.png";
import limonada from "../assets/Limonada de coco.png";
import pizza from "../assets/Pizza margarita.png";
import pollo from "../assets/Pollo a la plancha.png";
import salmon from "../assets/Salmon al horno.png";
import sopa from "../assets/Sopa del diacesarBBQ.png";
import agua from "../assets/agua con gasde coco.png";

export const categories = ["Entradas", "Platos fuertes", "Bebidas", "Postres"];

export const formatPrice = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);

// Foto según el nombre del producto (solo cuando la base de datos no trae imagen_url).
// Se usa la primera fila cuyo texto aparezca en el nombre.
const IMAGENES = [
  [["limonada"], limonada],
  [["jugo"], jugos],
  [["cerveza"], cerveza],
  [["agua"], agua],
  [["cafe"], cafe],
  [["cheesecake", "tiramisu"], cheesecake],
  [["flan"], flan],
  [["helado", "brownie"], helado],
  [["lasana"], lasana],
  [["pizza"], pizza],
  [["salmon"], salmon],
  [["ensalada"], ensalada],
  [["pechuga", "pollo"], pollo],
  [["bandeja"], bandeja],
  [["churrasco"], churrasco],
  [["alitas"], alitas],
  [["sopa"], sopa],
  [["empanada"], empanadas],
  [["deditos"], deditos],
  [["hamburguesa", "papas"], hamburguesa],
];

const sinTildes = (t) =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const imagenPara = (nombre) => {
  const n = sinTildes(nombre);
  return IMAGENES.find(([claves]) => claves.some((c) => n.includes(c)))?.[1] ?? hamburguesa;
};

export const fetchMenu = async () => {
  const controller = new AbortController();
  const temporizador = setTimeout(() => controller.abort(), 10000);

  try {
    const respuesta = await fetch("/api/restaurantes/1/menu", {
      signal: controller.signal,
    });

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
        image: producto.imagenUrl || imagenPara(producto.nombre),
      }))
    );
  } finally {
    clearTimeout(temporizador);
  }
};