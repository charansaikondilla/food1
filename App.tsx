
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { MenuItem, Category, Offer, SubCategory, CartItem, Order } from './types';
import { Dietary } from './types';
import { fetchMenuData } from './services/menuService';
import { getOrders, saveOrder, updateOrderStatus } from './services/orderService';
import Hero from './components/Hero';
import OfferHighlight from './components/OfferHighlight';
import FilterBar from './components/FilterBar';
import MenuGrid from './components/MenuGrid';
import ActionFooter from './components/ActionFooter';
import ItemDetailModal from './components/ItemDetailModal';
import Loader from './components/Loader';
import AISearch from './components/AISearch';
import EmberfallOverlay from './components/EmberfallOverlay';
import CartModal from './components/CartModal';
// FIX: Corrected import path for AdminPanel.
import AdminPanel from './components/admin/AdminPanel';
import AdminLoginModal from './components/admin/AdminLoginModal';

const ADMIN_CODE = "admin123";

const App: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [allItems, setAllItems] = useState<MenuItem[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
    const [activeSubCategory, setActiveSubCategory] = useState<SubCategory | 'All'>('All');
    const [activeDietary, setActiveDietary] = useState<Dietary>(Dietary.All);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [favorites, setFavorites] = useState<number[]>([]);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
    const [aiRecommendedIds, setAiRecommendedIds] = useState<number[] | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartVisible, setIsCartVisible] = useState<boolean>(false);
    
    // Admin state
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoginModalVisible, setIsLoginModalVisible] = useState<boolean>(false);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const { menu, offers: fetchedOffers } = await fetchMenuData();
                setAllItems(menu);
                setOffers(fetchedOffers);
                setOrders(getOrders());
            } catch (error)
            {
                console.error("Failed to fetch menu data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();

        const savedFavorites = localStorage.getItem('tastifyFavorites');
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        
        const savedCart = localStorage.getItem('tastifyCart');
        if (savedCart) setCart(JSON.parse(savedCart));

    }, []);

    useEffect(() => {
        localStorage.setItem('tastifyFavorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('tastifyCart', JSON.stringify(cart));
    }, [cart]);
    
    const handleAiSearch = async () => {
        if (!searchQuery.trim() || isAiLoading) return;
        
        setIsAiLoading(true);
        setAiRecommendedIds(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const simplifiedMenu = allItems.map(({ id, name, description, category, subCategory, dietary, spiceLevel }) => 
                ({ id, name, description, category, subCategory, dietary, spiceLevel }));

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Based on my request: "${searchQuery}", please recommend dishes from the following menu: ${JSON.stringify(simplifiedMenu)}. Return the IDs of the recommended dishes.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            recommended_ids: {
                                type: Type.ARRAY,
                                description: 'List of recommended menu item IDs.',
                                items: { type: Type.NUMBER }
                            }
                        },
                        required: ['recommended_ids'],
                    }
                }
            });

            const responseJson = JSON.parse(response.text);
            if (responseJson.recommended_ids) {
                setAiRecommendedIds(responseJson.recommended_ids);
            }

        } catch (error) {
            console.error("AI search failed:", error);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleFilterChange = useCallback((category: Category | 'All', subCategory: SubCategory | 'All', dietary: Dietary) => {
        setActiveCategory(category);
        setActiveSubCategory(subCategory);
        setActiveDietary(dietary);
        setAiRecommendedIds(null);
    }, []);

    const toggleFavorite = useCallback((id: number) => {
        setFavorites(prev =>
            prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
        );
    }, []);

    const handleUpdateQuantity = useCallback((itemId: number, newQuantity: number) => {
        setCart(prevCart => {
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.id !== itemId);
            }
    
            const itemExists = prevCart.some(item => item.id === itemId);
    
            if (itemExists) {
                return prevCart.map(item => 
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                );
            } else {
                const itemToAdd = allItems.find(item => item.id === itemId);
                if (itemToAdd) {
                    return [...prevCart, { ...itemToAdd, quantity: newQuantity }];
                }
            }
            return prevCart;
        });
    }, [allItems]);

    const handlePlaceOrder = useCallback(() => {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const total = subtotal * 1.05; // 5% tax included
        
        const newOrder: Order = {
            id: `T-${Date.now()}`,
            timestamp: Date.now(),
            items: cart,
            total: total,
            status: 'new',
        };

        saveOrder(newOrder);
        setOrders(prev => [newOrder, ...prev]);

        return new Promise<void>(resolve => {
            setTimeout(() => {
                setCart([]);
                setIsCartVisible(false);
                resolve();
            }, 1500);
        });
    }, [cart]);

    const handleAdminLogin = (code: string) => {
        if (code === ADMIN_CODE) {
            setIsLoggedIn(true);
            setIsLoginModalVisible(false);
            return true;
        }
        return false;
    };

    const handleAdminLogout = () => setIsLoggedIn(false);

    const handleToggleOrderStatus = (orderId: string) => {
        const updatedOrders = updateOrderStatus(orderId);
        setOrders(updatedOrders);
    };

    const cartItemCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

    const filteredItems = useMemo(() => {
        if (aiRecommendedIds !== null) {
            const recommendedSet = new Set(aiRecommendedIds);
            return allItems.filter(item => recommendedSet.has(item.id));
        }

        return allItems.filter(item => {
            const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
            const subCategoryMatch = activeCategory === 'All' || activeSubCategory === 'All' || item.subCategory === activeSubCategory;
            const dietaryMatch = activeDietary === Dietary.All || item.dietary === activeDietary;
            const searchMatch = searchQuery.trim() === '' ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());
            return categoryMatch && subCategoryMatch && dietaryMatch && searchMatch;
        });
    }, [allItems, activeCategory, activeSubCategory, activeDietary, searchQuery, aiRecommendedIds]);

    if (loading) {
        return <Loader />;
    }
    
    if (isLoggedIn) {
        return <AdminPanel orders={orders} onLogout={handleAdminLogout} onToggleStatus={handleToggleOrderStatus} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 relative">
            <EmberfallOverlay />
            <main className="pb-24 relative z-10">
                <Hero onAdminClick={() => setIsLoginModalVisible(true)} />
                <OfferHighlight offers={offers} />
                <AISearch 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery}
                    onAiSearch={handleAiSearch}
                    isLoading={isAiLoading}
                />
                 {aiRecommendedIds !== null && (
                    <div className="px-4 mb-4 text-center animate-fade-in-up">
                        <h2 className="text-xl font-bold text-slate-800">✨ AI Recommendations</h2>
                        <button 
                            onClick={() => setAiRecommendedIds(null)}
                            className="mt-1 text-sm font-semibold text-red-600 hover:text-red-800 transition-colors"
                        >
                           Clear Results
                        </button>
                    </div>
                )}
                <FilterBar
                    activeCategory={activeCategory}
                    activeSubCategory={activeSubCategory}
                    activeDietary={activeDietary}
                    onFilterChange={handleFilterChange}
                    disabled={aiRecommendedIds !== null}
                />
                <MenuGrid
                    items={filteredItems}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onSelectItem={setSelectedItem}
                    isAiFiltered={aiRecommendedIds !== null}
                />
            </main>
            <ActionFooter cartItemCount={cartItemCount} onShowCart={() => setIsCartVisible(true)} />
            {selectedItem && (
                <ItemDetailModal
                    item={selectedItem}
                    isFavorite={favorites.includes(selectedItem.id)}
                    cartItem={cart.find(ci => ci.id === selectedItem.id)}
                    onClose={() => setSelectedItem(null)}
                    onToggleFavorite={toggleFavorite}
                    onUpdateQuantity={handleUpdateQuantity}
                />
            )}
            {isCartVisible && (
                 <CartModal
                    cart={cart}
                    onClose={() => setIsCartVisible(false)}
                    onUpdateQuantity={handleUpdateQuantity}
                    onPlaceOrder={handlePlaceOrder}
                 />
            )}
            {isLoginModalVisible && (
                <AdminLoginModal
                    onClose={() => setIsLoginModalVisible(false)}
                    onLogin={handleAdminLogin}
                />
            )}
        </div>
    );
};

export default App;