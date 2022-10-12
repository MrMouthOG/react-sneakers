import React, { useContext } from 'react';
import AppContext from '../context';

function Info({ title, description, image }) {
    const {setCartOpened} = useContext(AppContext);

    return (
        <div className='cartEmpty d-flex align-center justify-center flex-column flex'>
            <img className='mb-20' width={120} src={image} alt='Empty' />
            <h2>{title}</h2>
            <p className='opacity-6'>{description}</p>
            <button onClick={() => setCartOpened(false)} className='greenButton'>
                <img src='/img/arrow.svg' alt='Arrow' />
                Вернуться назад
            </button>
        </div>
    )
}

export default Info;