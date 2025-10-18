
import { MENU_ITEMS, OFFERS } from '../constants';
import type { MenuItem, Offer } from '../types';

export const fetchMenuData = async (): Promise<{ menu: MenuItem[], offers: Offer[] }> => {
    // This simulates a network request to fetch data, e.g., from a Google Sheet.
    console.log("Fetching menu data...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Data fetched successfully.");
    return {
        menu: MENU_ITEMS,
        offers: OFFERS,
    };
};
