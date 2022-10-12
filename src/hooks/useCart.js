import { useContext } from 'react';

import AppContext from '../context';

export const useCart = () => {
    const { setCartItems, cartItems } = useContext(AppContext);
    const totalCost = cartItems.reduce((sum, obj) => obj.price + sum, 0);

    return { cartItems, setCartItems, totalCost };
}