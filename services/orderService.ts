import type { Order, CartItem } from '../types';
import { MENU_ITEMS } from '../constants';

const ORDERS_KEY = 'tastifyOrders';

const generateMockOrders = (): Order[] => {
    console.log("Generating mock orders...");
    const mockOrders: Order[] = [];
    const now = Date.now();

    // Helper to create a random cart
    const createRandomCart = (): CartItem[] => {
        const cart: CartItem[] = [];
        const numItems = Math.floor(Math.random() * 4) + 1; // 1 to 4 items per order
        const shuffledMenu = [...MENU_ITEMS].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < numItems; i++) {
            if (shuffledMenu[i]) {
                cart.push({
                    ...shuffledMenu[i],
                    quantity: Math.floor(Math.random() * 2) + 1, // 1 or 2 quantity
                });
            }
        }
        return cart;
    };

    // Create 5-7 mock orders
    const orderCount = Math.floor(Math.random() * 3) + 5;
    for (let i = 0; i < orderCount; i++) {
        const items = createRandomCart();
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const total = subtotal * 1.05;
        const timestamp = now - i * 1000 * 60 * (15 + Math.random() * 30); // Stagger orders by 15-45 mins

        mockOrders.push({
            id: `T-${timestamp.toString().slice(-6)}`,
            timestamp,
            items,
            total,
            status: i < 3 ? 'new' : 'completed', // First 3 are new
        });
    }

    return mockOrders;
};


export const getOrders = (): Order[] => {
    try {
        const ordersJson = localStorage.getItem(ORDERS_KEY);
        if (!ordersJson || JSON.parse(ordersJson).length === 0) {
            const mockData = generateMockOrders();
            localStorage.setItem(ORDERS_KEY, JSON.stringify(mockData));
            return mockData;
        }
        return JSON.parse(ordersJson) as Order[];
    } catch (error) {
        console.error("Failed to parse orders from localStorage", error);
        return [];
    }
};

export const saveOrder = (order: Order): void => {
    const orders = getOrders();
    const newOrders = [order, ...orders];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
};

export const updateOrderStatus = (orderId: string): Order[] => {
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex > -1) {
        const currentStatus = orders[orderIndex].status;
        orders[orderIndex].status = currentStatus === 'new' ? 'completed' : 'new';
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
    return orders;
};