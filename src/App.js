import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';

import Header from "./components/Header";
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';
import AppContext from './context';

function App() {
    const [items, setItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [cartOpened, setCartOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [cartResponce, favoritesResponse, itemsResponse] = await Promise.all([
                    axios.get('https://6332d9b9a54a0e83d25a173e.mockapi.io/cart'),
                    axios.get('https://6332d9b9a54a0e83d25a173e.mockapi.io/favorite'),
                    axios.get('https://6332d9b9a54a0e83d25a173e.mockapi.io/items'),
                ])

                setIsLoading(false);

                setCartItems(cartResponce.data);
                setFavorites(favoritesResponse.data);
                setItems(itemsResponse.data);
            } catch (error) {
                alert('При загрузке данных произошла ошибка');
                console.error(error);
            }
        }
        fetchData();
    }, [])

    const onAddToCart = async (obj) => {
        try {
            const findItem = cartItems.find(item => Number(item.parentId) === Number(obj.id));
            if (findItem) {
                setCartItems(prev => prev.filter(item => Number(item.parentId) !== Number(obj.id)));
                await axios.delete(`https://6332d9b9a54a0e83d25a173e.mockapi.io/cart/${findItem.id}`);
            } else {
                setCartItems(prev => [...prev, obj]);
                const { data } = await axios.post('https://6332d9b9a54a0e83d25a173e.mockapi.io/cart', obj);
                setCartItems(prev => prev.map(item => {
                    if (item.parentId === data.parentId) {
                        return {
                            ...item,
                            id: data.id
                        };
                    }
                    return item;
                }));
            }
        } catch (error) {
            alert('Не удалось добавить в корзину');
            console.error(error);
        }
    }

    const onRemoveItem = async (id) => {
        try {
            setCartItems((prev) => prev.filter(item => Number(item.id) !== Number(id)));
            await axios.delete(`https://6332d9b9a54a0e83d25a173e.mockapi.io/cart/${id}`);
        } catch (error) {
            alert('Не удалось удалить товар');
            console.error(error);
        }
    }

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    }

    const isItemAdded = (id) => {
        return cartItems.some((obj) => Number(obj.parentId) === Number(id))
    }

    const onAddToFavorite = async (obj) => {
        try {
            if (favorites.find(fav => Number(fav.id) === Number(obj.id))) {
                axios.delete(`https://6332d9b9a54a0e83d25a173e.mockapi.io/favorite/${obj.id}`);
                setFavorites((prev) => prev.filter(item => Number(item.id) !== Number(obj.id)));
            } else {
                const { data } = await axios.post('https://6332d9b9a54a0e83d25a173e.mockapi.io/favorite', obj);
                setFavorites((prev) => [...prev, data]);
            }
        } catch (error) {
            alert('Не удалось добавить в закладки');
            console.error(error);
        }
    }

    return (
        <AppContext.Provider value={{ cartItems, favorites, items, isItemAdded, onAddToCart, onAddToFavorite, setCartOpened, setCartItems }}>
            <div className="wrapper clear">
                <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} opened={cartOpened} />

                <Header onClickCart={() => setCartOpened(true)} />

                <Routes>
                    <Route
                        path='/'
                        element={
                            <Home
                                items={items}
                                cartItems={cartItems}
                                searchValue={searchValue}
                                setSearchValue={setSearchValue}
                                onChangeSearchInput={onChangeSearchInput}
                                onAddToCart={onAddToCart}
                                onAddToFavorite={onAddToFavorite}
                                isLoading={isLoading}
                            />
                        }
                    />

                    <Route
                        path='/favorites'
                        element={<Favorites />}
                    />

                    <Route
                        path='/orders'
                        element={<Orders />}
                    />
                </Routes>
            </div>
        </AppContext.Provider>
    );
}

export default App;
