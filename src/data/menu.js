import img1 from "../assets/Flan de caramelo.png";
import img2 from "../assets/Gaseosa.png";
import img3 from "../assets/Hamburguesa.png";
import img4 from "../assets/Jugos.png";
import img5 from "../assets/Limonada de coco.png";
import img6 from "../assets/Mini albondigas.png";
import img7 from "../assets/Nachos con guacamoles.png";
import img8 from "../assets/Pasta al pesto.png";
import img9 from "../assets/Tres leches.png";
import img10 from "../assets/Brownie con helado.png";
import img11 from "../assets/Bandeja Paisa.png";
import img12 from "../assets/Empanadas criollas.png";

// Cuando el backend esté listo, reemplaza `products` por un fetch a la API.
export const categories = ["Entradas", "Platos fuertes", "Bebidas", "Postres"];

const imgs = [img7, img6, img12, img3, img11, img8, img5, img4, img2, img10, img9, img1];

const raw = [
  ["Entradas", "Nachos con guacamole", "Totopos crujientes con guacamole fresco, pico de gallo y queso gratinado.", 18000],
  ["Entradas", "Mini albondigas", "Ocho albondigas de carne acompañadas con una deliciosa salsa artesanal.", 24000],
  ["Entradas", "Empanadas criollas", "Tres empanadas de carne con ají de la casa.", 14000],
  ["Platos fuertes", "Hamburguesa de la casa", "Carne de res 180 g, queso cheddar, tocineta y papas a la francesa.", 32000],
  ["Platos fuertes", "Bandeja paisa", "Frijoles, arroz, chicharrón, carne molida, huevo, plátano y aguacate.", 38000],
  ["Platos fuertes", "Pasta al pesto", "Fettuccine con pesto de albahaca, parmesano y pollo grillado.", 29000],
  ["Bebidas", "Limonada de coco", "Limón natural con crema de coco, bien fría.", 12000],
  ["Bebidas", "Jugo natural", "Mora, maracuyá, lulo o mango, en agua o en leche.", 9000],
  ["Bebidas", "Gaseosas", "Botella personal de 400 ml.","Cervezas Artesanales", 6000],
  ["Postres", "Brownie con helado", "Brownie tibio de chocolate con helado de vainilla.", 15000],
  ["Postres", "Tres leches", "Bizcocho esponjoso bañado en tres leches con crema.", 13000],
  ["Postres", "Flan de caramelo", "Flan casero con caramelo y un toque de canela.", 11000],
];

export const products = raw.map(([category, name, description, price], i) => ({
  id: i + 1,
  category,
  name,
  description,
  price,
  image: imgs[i % imgs.length],
}));

export const formatPrice = (n) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);

  export const fetchMenu = () => Promise.resolve(products);
