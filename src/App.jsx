import React from 'react'
import Navbar from './components/Navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Coin from './Pages/Coin/Coin'
import Cryptocurrencies from './Pages/Cryptocurrencies/Cryptocurrencies'

const App = () => {
    return (
        <div className='app'>
            <Navbar/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/coin/:coinId' element={<Coin/>}/>
                <Route path='/cryptocurrencies' element={<Cryptocurrencies/>} />
            </Routes>
        </div>
    )
}


export default App