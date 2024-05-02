import { Injectable } from '@angular/core';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productList: Product[] = [];
  private cart: Product[] = [];
  private price: number = 0;
  private categories: string[] = [];
  private category: string = "Sin categorías";

  constructor() { }

  getCategories(): string[] {
    this.categories = ["Sin categorías", "Accion", "Aventura", "Deportes", "Estrategia", "Otros"];
    return this.categories;
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/assets/products.json'); // Ruta relativa al archivo JSON
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      this.productList = await response.json();
      return this.productList;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  addProductToCart(productCode: number): void {
    const product = this.productList.find(product => product.code == productCode.toString() && product.quantity > 0);
    if (product) {
      this.cart.push(product);
      this.price += product.price;
      product.quantity -= 1;
    }
  }

  deleteProductFromCart(productCode: number): Product[] {
    let found = false;
    const updatedCart = this.cart.filter(product => {
      if (product.code == productCode.toString() && !found) {
        this.price -= product.price;
        found = true;
        return false;
      }
      return true;
    });
    // Encuentra el producto correspondiente en productList y actualiza su cantidad
    const updatedProductList = this.productList.map(productFromList => {
      if (productFromList.code == productCode.toString()) {
        return {
          ...productFromList,
          quantity: productFromList.quantity + 1
        };
      } else {
        return productFromList;
      }
    });
    this.productList = updatedProductList;
    this.cart = updatedCart;
    return updatedCart;
  }

  addProduct(product: Product): void {
    this.productList.push(product);
  }

  addCategory(category: string): void {
    this.categories.push(category);
  }

  getProductList(): Product[] {
    return this.productList;
  }

  setCart(cart: Product[]): void {
    this.cart = cart;
  }

  getCart(): Product[] {
    return this.cart;
  }

  getPrice(): number {
    return this.price;
  }
  setPrice(price: number): void {
    this.price = price;
  }

  getCategory(): string {
    return this.category;
  }

  setCategory(category: string): void {
    this.category = category;
  }
}
