import React from 'react';
import StockPic from '../src/img/stock2.png';

function Home(){
    return (
        <div className='home'>
            <img src={StockPic} alt="stock" />
            <h1>Stock Prices</h1>
            <p>Welcome to the Stock Market Page. </p>
            <p>You may click on stocks to view all the stocks or search to view the latest 100 days of activity</p>
        </div>
    );
}

export default Home;
