import ProductsList from "./ProductList";

function Shop() {
  return (
    <div className="shop-page">
      <h1 className="shop-title">
        Tienda <span>Valencia Infinity</span>
      </h1>

      <p className="shop-subtitle">
        Consigue artículos oficiales y coleccionables del Valencia CF.
      </p>

      <ProductsList />
    </div>
  );
}

export default Shop;
