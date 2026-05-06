import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);

    const addItem = (product) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: (item.quantity || 1) + 1,
                        }
                        : item
                );
            }

            return [
                ...prev,
                {
                    ...product,
                    price: Number(product.price) || 0,
                    quantity: 1,
                },
            ];
        });
    };

    const removeItem = (id) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        const safeQty = Math.max(1, Number(quantity) || 1);

        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        quantity: safeQty,
                    }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const count = useMemo(() => {
        return items.reduce((acc, item) => acc + (item.quantity || 1), 0);
    }, [items]);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                count,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}