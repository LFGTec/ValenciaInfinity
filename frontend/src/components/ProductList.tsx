import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import type { Product } from "../services/productService";
import "./ProductList.css";

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="products-container">
      <h1 className="products-title">Tienda del Fan</h1>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h2>{product.nombre}</h2>
            <p>{product.descripcion}</p>
            <p className="price">€{product.precio}</p>
            <button className="buy-button">Comprar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
