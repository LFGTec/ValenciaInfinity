import React from "react";
import { ShoppingCart, Star } from "lucide-react";

import camisetaImg from "../../assets/Camisa VF.png";
import bufandaImg from "../../assets/BufandoVF.png";
import gorraImg from "../../assets/GorraVF.png";
import sobresImg from "../../assets/Sobredecartas.png";

export function StorePage() {
  const products = [
    {
      name: "Camiseta Local 25/26",
      price: "69.99",
      oldPrice: "89.99",
      img: camisetaImg,
      offer: true,
    },
    {
      name: "Bufanda VCF",
      price: "74.99",
      oldPrice: "89.99",
      img: bufandaImg,
      offer: true,
    },
    {
      name: "Sobre de Cartas Premium",
      price: "79.99",
      oldPrice: "89.99",
      img: sobresImg,
      offer: true,
    },
    {
      name: "Gorra Oficial",
      price: "84.99",
      img: gorraImg,
      offer: false,
    },
    {
      name: "Camiseta Local 25/26",
      price: "89.99",
      img: camisetaImg,
      offer: false,
    },
    {
      name: "Bufanda VCF",
      price: "94.99",
      img: bufandaImg,
      offer: false,
    },
    {
      name: "Sobre de Cartas Premium",
      price: "99.99",
      img: sobresImg,
      offer: false,
    },
    {
      name: "Gorra Oficial",
      price: "104.99",
      img: gorraImg,
      offer: false,
    },
    {
      name: "Camiseta Local 25/26",
      price: "109.99",
      img: camisetaImg,
      offer: false,
    },
    {
      name: "Bufanda VCF",
      price: "114.99",
      img: bufandaImg,
      offer: false,
    },
    {
      name: "Sobre de Cartas Premium",
      price: "119.99",
      img: sobresImg,
      offer: false,
    },
    {
      name: "Gorra Oficial",
      price: "124.99",
      img: gorraImg,
      offer: false,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12 bg-content">
      <div className="mb-8">
        <h1 className="text-5xl font-black mb-3 text-foreground">
          TIENDA{" "}
          <span className="text-vcf-orange">OFICIAL</span>
        </h1>
        <p className="text-base text-muted-foreground">
          Productos oficiales del Valencia CF
        </p>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {[
          "TODO",
          "CAMISETAS",
          "ACCESORIOS",
          "COLECCIÓN",
          "SOBRES DE CARTAS",
          "OFERTAS",
        ].map((cat) => (
          <button
            key={cat}
            className={`px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all text-base ${
              cat === "TODO"
                ? "bg-vcf-orange text-white"
                : "bg-card border-2 border-border hover:border-vcf-orange text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, i) => (
          <div
            key={i}
            className="bg-card border-2 border-border rounded-lg overflow-hidden hover:border-vcf-orange transition-all group shadow-md hover:shadow-lg"
          >
            <div className="aspect-square bg-white relative overflow-hidden">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              />
              {product.offer && (
                <div className="absolute top-3 right-3 bg-vcf-red text-white px-3 py-1 rounded text-sm font-black shadow-md">
                  OFERTA
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-black mb-2 group-hover:text-vcf-orange transition-colors text-foreground text-sm">
                {product.name}
              </h3>
              <div className="flex items-center justify-between mb-3">
                <div>
                  {product.oldPrice && (
                    <div className="text-xs text-muted-foreground line-through">
                      €{product.oldPrice}
                    </div>
                  )}
                  <div className="text-xl font-black text-foreground">
                    €{product.price}
                  </div>
                </div>
                <Star size={20} className="text-vcf-yellow" />
              </div>
              <button className="w-full py-3 bg-vcf-orange border-2 border-vcf-orange text-white rounded-lg font-black hover:bg-[#e05516] hover:border-[#e05516] transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2 text-sm">
                <ShoppingCart size={18} />
                COMPRAR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}