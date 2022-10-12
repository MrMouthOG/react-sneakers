import React from 'react';
import Card from "../components/Card";

function Home({items, searchValue, setSearchValue, onChangeSearchInput, onAddToCart, onAddToFavorite, isLoading}) {
    
    const renderItems = () => {
        const filteredItems = items.filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase()));
        return (isLoading ? [...Array(8)] : filteredItems).map((item, index) => {
            return <Card
                key={index}
                onPlus={(item) => onAddToCart(item)}
                onFavorite={(item) => onAddToFavorite(item)}
                loading={isLoading}
                {...item}
            />
        })
    }

    return (
        <div className="content p-40">
        <div className="d-flex align-center justify-between mb-40">
            <h1>{searchValue ? `Поиск по запросу "${searchValue}"` : 'Все кроссовки'}</h1>
            <div className="search-block d-flex">
                <img src="/img/search.svg" alt="Search" />
                {searchValue && <img onClick={() => setSearchValue('')} className="cu-p clear" src="img/btn-remove.svg" alt="Remove" />}
                <input onChange={onChangeSearchInput} value={searchValue} placeholder="Поиск..." />
            </div>
        </div>

        <div className="d-flex flex-wrap">
            {
                renderItems()
            }
        </div>
    </div>
    )
}

export default Home;