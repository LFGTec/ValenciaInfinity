import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import type { Product } from "../services/productService";

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
