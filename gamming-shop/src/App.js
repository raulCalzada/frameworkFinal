import React, { useState, useEffect } from 'react';
import './App.css';
import { useProducts } from './hooks/useProducts.tsx';

function App() {
  const { productList, getAllProducts, addProductToCart, setCart, cart, price, deleteProductFromCart, categories, getCategories, setCategory, category,addProduct,addCategory  } = useProducts();
  
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    getAllProducts();
    getCategories();
    setCategory("Sin categorías");
  }, []);

  const deleteFromCartHandler = (productCode) => {
    const updatedCart = deleteProductFromCart(productCode);
    setCart(updatedCart);
  };

  const addToCartHandler = (productCode) => {
    addProductToCart(productCode);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  }

  const handleProductSubmit = (event) => {
    event.preventDefault();
    const product = {
      name: event.target.name.value,
      code: event.target.code.value,
      description: event.target.description.value,
      quantity: parseInt(event.target.quantity.value),
      category: event.target.category.value,
      price: parseFloat(event.target.price.value),
      imageRoute: ""
    };
    console.log(product);
    addProduct(product);
    setAdmin(false);
  };

  const handleCategorySubmit = (event) => {
    event.preventDefault();
    const categoryName = event.target.categoryName.value;
    addCategory(categoryName);
    setAdmin(false);
  };

  const pay = () => {
    setCart([]);
  };


  return (
    <body>
      <div class="admin-container">
        {admin ? (
          // Código de administrador aquí
          <div>
            <form onSubmit={handleProductSubmit} id="productForm" class="admin-form">
              <label htmlFor="name">Nombre:</label>
              <input type="text" id="name" name="name" required />
              <label htmlFor="code">Codigo:</label>
              <input type="text" id="code" name="code" required />
              <label htmlFor="description">Descripción:</label>
              <textarea id="description" name="description" required></textarea>
              <label htmlFor="quantity">Stock:</label>
              <input type="number" id="quantity" name="quantity" required />
              <label htmlFor="category">Categoría:</label>
              <select id="category" name="category" required>
                {categories.map(category => <option key={category} value={category}>{category}</option>)}
              </select>
              <label htmlFor="price">Precio:</label>
              <input type="number" id="price" name="price" step="0.01" required />
              <input type="submit" value="Añadir Producto" />
            </form>
            <form onSubmit={handleCategorySubmit} id="categoryForm" class="admin-form">
              <label htmlFor="categoryName">Nombre de la categoría a añadir:</label>
              <input type="text" id="categoryName" name="categoryName" required />
              <input type="submit" value="Añadir Categoría" />
            </form>
            <button onClick={() => setAdmin(false)} id="admin-button" class="admin-button">Admin</button>
          </div>
        ) : (
          <button onClick={() => setAdmin(true)} id="admin-button" class="admin-button">Admin</button>
        )}
      </div>
        
      {
        //pagina web
      }
      <div class="header">
        <img src="/images/logo.png" alt="Logo de la tienda de juegos"></img>
        <h1 class="title">Gaming Shop</h1>
      </div>
      <div class="container">
        <div class="left">
          <label for="categories"><h2>Categorias:</h2></label>
          <select class="categories" id="categories" onChange={handleCategoryChange}>
            {categories.map(categoryValue => (
              <option>{categoryValue}</option>
            ))}
          </select>
          {productList.map(product => {
            // Verifica si la categoría seleccionada es "Sin categorías" o si el producto coincide con la categoría seleccionada
            if (category === "" || category === "Sin categorías" || product.category === category) {
              return (
                <div className="product-card" key={product.id}>
                  <div className="left-product-card">
                    <hidden key={product.id} className="product"></hidden>
                    <h1>{product.name}</h1>
                    <p><strong>Código:</strong> {product.code}</p>
                    <p><strong>Descripción:</strong> {product.description}</p>
                    <p><strong>Stock:</strong> {product.quantity}</p>
                    <p><strong>Categoría:</strong> {product.category}</p>
                    <p><strong>Precio:</strong> €{product.price}</p>
                  </div>
                  <div className="right-product-card">
                    <div className="image-container">
                      <img src={product.imageRoute.slice(product.imageRoute.indexOf('/images'))} alt={product.name} />
                    </div>
                    <button className="btn btn-primary" onClick={() => addToCartHandler(product.code)} class="add-button">Añadir al carrito</button>
                  </div>
                </div>
              );
            } else {
              // Si el producto no coincide con la categoría seleccionada, no renderizamos nada
              return null;
            }
          })}

        </div>
        <div className="right">
          <div className="card">
            <h2>Cesta de la compra</h2>
            {cart.length > 0 ? (
              <>
                {cart.map(product => (
                  <div className="cart-item" key={product.id}>
                    <div className="item-info">
                      <p>{product.name}-{product.price}€</p>
                    </div>
                    <div className="item-actions">
                      <button className="delete-button" onClick={() => deleteFromCartHandler(product.code)}>eliminar</button>
                    </div>
                  </div>
                ))}
                <p style={{ fontSize: "60px" }}>Total: {price}€</p>
                <button id="payButton" class="pay-button" onClick={() => pay()}>Pagar</button>'
              </>
            ) : (
              <p>Sin productos en la cesta.</p>
            )}
          </div>
        </div>
      </div>
    </body>
  );
}

export default App;
