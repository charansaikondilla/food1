// FIX: Removed self-import of `CartItem` to resolve a declaration conflict.
export enum Dietary {
    Veg = 'veg',
    NonVeg = 'non-veg',
    All = 'all'
}

export type Category = 'Starters' | 'Main Course' | 'Desserts' | 'Drinks';

export type SubCategory = 'Tandoori' | 'Soups' | 'Biryani' | 'Curries' | 'Chinese' | 'Breads' | 'Cakes' | 'Traditional' | 'Cold' | 'Hot';

export interface MenuItem {
    id: number;
    category: Category;
    subCategory: SubCategory;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    dietary: Dietary.Veg | Dietary.NonVeg;
    spiceLevel: 0 | 1 | 2 | 3;
    rating: number;
    offerFlag?: 'Bestseller' | 'Special' | 'New' | "Chef's Pick";
}

export interface Offer {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    items: string[];
    originalPrice: number;
    discountedPrice: number;
}

export interface CartItem extends MenuItem {
    quantity: number;
}

export interface Order {
    id: string;
    timestamp: number;
    items: CartItem[];
    total: number;
    status: 'new' | 'completed';
}