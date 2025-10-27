import { createContext, useEffect, useState } from "react"

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
    const [topCoins, setTopCoins] = useState([]);
    const [allCoins, setAllCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currency, setCurrency] = useState({
        name: "usd",
        symbol: "$"
    })

    const fetchAllCoin = async () => {
        const headers = { accept: 'application/json' }
        const apiKey = import.meta?.env?.VITE_CG_API_KEY
        if (apiKey) headers['x-cg-demo-api-key'] = apiKey
        const options = { method: 'GET', headers };

        try {
            setLoading(true);
            setError(null);
            const [resTop, resAll] = await Promise.all([
                fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h`, options),
                fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`, options),
            ])
            if (!resTop.ok) throw new Error(`Top API error ${resTop.status}`)
            if (!resAll.ok) throw new Error(`All API error ${resAll.status}`)
            const [dataTop, dataAll] = await Promise.all([resTop.json(), resAll.json()])
            setTopCoins(dataTop)
            setAllCoins(dataAll)
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to load coins');
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllCoin();
    }, [currency])

    const contextValue = {
        topCoins,
        allCoins,
        loading,
        error,
        currency,
        setCurrency,
    }

    return ( 
        <CoinContext.Provider value={contextValue}>
            {props.children}
        </CoinContext.Provider>
    )
}

export default CoinContextProvider;