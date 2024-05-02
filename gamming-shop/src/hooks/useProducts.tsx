import { useCallback, useState } from "react";
import { Product } from "../types/Product";


export const useProducts = () => {
    const [productList, setProductList] = useState<Product[]>([]);
    const [product, setProduct] = useState<Product | null>(null);
    const [cart, setCart] = useState<Product[]>([]);
    const [price, setPrice] = useState<number>(0);
    const [categories, setCategories] = useState<string[]>([]);
    const [category, setCategory] = useState<string>("Sin categorías");

    const getCategories = useCallback(() => {
        const updateCategories = ["Sin categorías", "Accion", "Aventura", "Deportes", "Estrategia", "Otros"];
        setCategories(updateCategories);
    }, []);

    const getAllProducts = useCallback(async () => {
        try {
            const response = await fetch('/products.json'); // Ruta relativa al archivo JSON
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            setProductList(await response.json());
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, []);

    const addProductToCart = useCallback((productCode: number) => {
        const updatedProductList = productList.map(product => {
            if (product.code === productCode && product.quantity > 0) {
                setCart(prevCart => [...prevCart, product]);
                setPrice(prevPrice => prevPrice + product.price);
                return {
                    ...product,
                    quantity: product.quantity - 1
                };
            }

            return product;
        });
        setProductList(updatedProductList);
    }, [productList]);


    const deleteProductFromCart = useCallback((productCode: number) => {
        let found = false;
        const updatedCart = cart.filter(product => {
            if (product.code === productCode && !found) {
                setPrice(prevPrice => prevPrice - product.price);
                found = true;
                return false;
            }
            return true;
        });
        // Encuentra el producto correspondiente en productList y actualiza su cantidad
        const updatedProductList = productList.map(productFromList => {
            if (productFromList.code === productCode) {
                return {
                    ...productFromList,
                    quantity: productFromList.quantity + 1
                };
            } else {
                return productFromList;
            }
        });
        setProductList(updatedProductList);

        return updatedCart;
    }, [cart, productList, setPrice, setProductList]);

    const addProduct = useCallback((product: Product) => {
        console.log(product);
        setProductList(prevProductList => [...prevProductList, product]);
    }, []);

    const addCategory = useCallback((category: string) => {
        setCategories(prevCategories => [...prevCategories, category]);
    }, []);
    

    return {
        setProductList,
        productList,
        product,
        setProduct,
        getAllProducts,
        addProductToCart,
        cart,
        setCart,
        price,
        setPrice,
        deleteProductFromCart,
        getCategories,
        categories,
        setCategories,
        category,
        setCategory,
        addProduct,
        addCategory
    };
};
