export const productosDestacados = [
  {
    id: 1,
    nombre: "GORILA BURGER",
    categoria: "Hamburguesas",
    precio: 8990,
    valoracion: 4.9,
    imagen: "/img/gorila-burger.png",
    descripcion:
      "Hamburguesa smash, queso cheddar, tocino crocante, cebolla caramelizada y salsa de la casa.",
    etiqueta: "MÁS VENDIDO",
    colorEtiqueta: "naranja"
  },
  {
    id: 2,
    nombre: "KING KONG BURGER",
    categoria: "Hamburguesas",
    precio: 10990,
    valoracion: 4.8,
    imagen: "/img/KING KONG BURGER.PNG",
    descripcion:
      "Doble carne smash, doble queso cheddar, tocino crocante, cebolla caramelizada y salsa especial Gorila.",
    etiqueta: "PROMO",
    colorEtiqueta: "amarilla"
  },
  {
    id: 3,
    nombre: "PAPAS GORILA",
    categoria: "Papas",
    precio: 5990,
    valoracion: 4.7,
    imagen: "/img/PAPAS GORILA.jpeg",
    descripcion:
      "Papas fritas doradas cubiertas con queso cheddar derretido, tocino y cebollín."
  },
  {
    id: 4,
    nombre: "COMBO BAJÓN",
    categoria: "Combos",
    precio: 11990,
    valoracion: 4.8,
    imagen: "/img/combo bajon.png",
    descripcion:
      "Hamburguesa Gorila + papas fritas + bebida de tu elección. El combo perfecto.",
    etiqueta: "MÁS VENDIDO",
    colorEtiqueta: "naranja"
  }
];

export const productosMenu = [
  ...productosDestacados,
  {
    id: 5,
    nombre: "COMPLETO GORILA",
    categoria: "Completos",
    precio: 4990,
    valoracion: 4.6,
    imagen: "/img/completo gorila.jpg",
    descripcion:
      "Completo italiano con palta, tomate, mayo y una pizca de ají. El clásico chileno elevado."
  },
  {
    id: 6,
    nombre: "CHURRASCO LOMO",
    categoria: "Churrascos",
    precio: 7990,
    valoracion: 4.7,
    imagen: "/img/churrasco lomo.jpeg",
    descripcion:
      "Churrasco de lomo vetado, palta, tomate, mayo y mostaza. Jugoso y bien generoso."
  },
  {
    id: 7,
    nombre: "BEBIDA GRANDE",
    categoria: "Bebidas",
    precio: 1990,
    valoracion: 4.5,
    imagen: "/img/bebidas.jpeg",
    descripcion:
      "Bebidas fruna lo mejor 500ml de puro sabor bien helada para acompañar tu bajón."
  },
  {
    id: 8,
    nombre: "COMBO KING KONG",
    categoria: "Combos",
    precio: 12990,
    valoracion: 4.9,
    imagen: "/img/combo kinkon.jpeg",
    descripcion:
      "King Kong Burger + papas fritas + bebida. El combo más bestial de todo el menú."
  },
  {
    id: 9,
    nombre: "2X GORILA",
    categoria: "Combos",
    precio: 14990,
    valoracion: 4.9,
    imagen: "/img/gorila-burger.png",
    descripcion:
      "Dos hamburguesas Gorila Burger al precio de una. Para compartir o para ti solo."
  }
];


export const promociones = [
  {
    id: 1,
    nombre: "COMBO KING KONG",
    etiqueta: "🔥 COMBO DEL MES",
    descripcion:
      "King Kong Burger + Papas Gorila + Bebida Grande. El combo más bestial del menú.",
    precio: 12990,
    precioOriginal: 20970,
    descuento: 38,
    imagen: "/img/combo kinkon.jpeg",
    textoAlternativo: "Combo King Kong",
    color: "",
    invertida: false
  },
  {
    id: 2,
    nombre: "2X GORILA",
    etiqueta: "⚡ OFERTA 2X1",
    descripcion:
      "Dos hamburguesas Gorila Burger al precio de una. Para compartir o para ti solo.",
    precio: 14990,
    precioOriginal: 17980,
    descuento: 17,
    imagen: "/img/gorila-burger.png",
    textoAlternativo: "Promoción 2x Gorila",
    color: "verde",
    invertida: true
  }
];
