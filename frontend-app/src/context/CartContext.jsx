import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load giỏ hàng từ localStorage khi khởi chạy
  useEffect(() => {
    const savedCart = localStorage.getItem('library_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const addToCart = (book) => {
    if (cartItems.find(item => item._id === book._id)) {
      return { success: false, message: 'Sách đã có sẵn trong giỏ mượn!' };
    }
    if (cartItems.length >= 3) {
      return { success: false, message: 'Bạn chỉ được mượn tối đa 3 cuốn sách cùng lúc!' };
    }
    const newCart = [...cartItems, book];
    setCartItems(newCart);
    localStorage.setItem('library_cart', JSON.stringify(newCart));
    return { success: true, message: 'Đã thêm sách vào giỏ mượn thành công!' };
  };

  const removeFromCart = (bookId) => {
    const newCart = cartItems.filter(item => item._id !== bookId);
    setCartItems(newCart);
    localStorage.setItem('library_cart', JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('library_cart');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
