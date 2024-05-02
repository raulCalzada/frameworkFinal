import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.services';
import { Product } from './product.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  productList: Product[] = [];
  cart: Product[] = [];
  price: number = 0;
  categories: string[] = [];
  category: string = "Sin categorías"; 
  admin: boolean = false;

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().then(products => {
      this.productList = products;
    });
    this.categories = this.productService.getCategories();
  }

  handleCategoryChange(event: any): void {
    this.category = event.target.value;
  }

  addToCartHandler(productCode: number): void {
    this.productService.addProductToCart(productCode);
    this.cart = [...this.productService.getCart()]; // Copia el array para evitar mutaciones directas
    this.price = this.productService.getPrice();
    console.log(this.cart);
  }

  deleteFromCartHandler(productCode: number): void {
    this.cart = this.productService.deleteProductFromCart(productCode);
    this.price = this.productService.getPrice();
  }

  pay(): void {
    this.productService.setCart([]);
    this.cart = [];
    this.productService.setPrice(0);
  }

  handleProductSubmit(event: any): void {
    event.preventDefault();
    const product = {
      name: event.target.name.value,
      code: event.target.code.value, // Cambia esto a string
      description: event.target.description.value,
      quantity: parseInt(event.target.quantity.value, 10),
      category: event.target.category.value,
      price: parseFloat(event.target.price.value),
      imageRoute: ""
    };
    this.productService.addProduct(product);
    this.admin = false;
  }

  handleCategorySubmit(event: any): void {
    event.preventDefault();
    const categoryName = event.target.categoryName.value;
    this.productService.addCategory(categoryName);
    this.admin = false;
  }

  setCategory(category: string): void {
    this.productService.setCategory(category);
    this.category = category;
  }

  toggleAdmin(): void {
    this.admin = !this.admin;
  }
}
