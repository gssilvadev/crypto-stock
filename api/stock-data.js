import yahooFinance from 'yahoo-finance2';

let lastStockData = {}; // Para armazenar os preços anteriores

export default async function handler(req, res) {
    const stocks = [
        'BBDC4.SA', 'BBAS3.SA', 'MGLU3.SA', 'B3SA3.SA',
        'BTC-USD', 'ETH-USD', 'VALE3.SA', 'PETR4.SA', 'ITUB4.SA', 'NDX', '^GSPC'
    ];

    const data = {};

    try {
        // Loop para obter os dados de cada ação
        for (let stock of stocks) {
            try {
                const ticker = await yahooFinance.quote(stock);

                // Verifica se o preço de mercado regular existe
                if (ticker.regularMarketPrice !== undefined) {
                    const currentPrice = ticker.regularMarketPrice;
                    let variation = null;
                    let arrow = '';
                    let percentChange = null;

                    // Verifica se temos um preço anterior para calcular a variação
                    if (lastStockData[stock] !== undefined) {
                        const lastPrice = lastStockData[stock];
                        // Calcula a variação em valor absoluto
                        variation = currentPrice - lastPrice;
                        // Calcula a variação percentual
                        percentChange = ((variation / lastPrice) * 100).toFixed(2); 

                        // Determina a seta com base na variação
                        if (variation > 0) {
                            arrow = '↑'; // Preço subiu
                        } else if (variation < 0) {
                            arrow = '↓'; // Preço caiu
                        } else {
                            arrow = '→'; // Sem variação
                        }
                    }

                    // Atualiza os preços anteriores
                    lastStockData[stock] = currentPrice;

                    // Adiciona as informações no objeto de resposta
                    data[stock] = {
                        price: currentPrice,
                        variation: variation,
                        percentChange: percentChange,
                        arrow: arrow,
                        marketCap: ticker.marketCap || null,
                        regularMarketDayHigh: ticker.regularMarketDayHigh || null,
                        regularMarketDayLow: ticker.regularMarketDayLow || null,
                        regularMarketVolume: ticker.regularMarketVolume || null,
                        previousClose: ticker.regularMarketPreviousClose || null
                    };
                } else {
                    console.warn(`Dados de preço não encontrados para ${stock}`);
                    data[stock] = { 
                        price: null, 
                        variation: null, 
                        percentChange: null, 
                        arrow: null 
                    };
                }
            } catch (error) {
                console.error(`Erro ao obter dados para ${stock}:`, error);
                data[stock] = { 
                    price: null, 
                    variation: null, 
                    percentChange: null, 
                    arrow: null 
                };
            }
        }

        // Garantir que o cabeçalho Content-Type seja JSON
        res.setHeader('Content-Type', 'application/json');
        
        // Envia os dados como resposta JSON
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao obter os dados das ações:', error);
        
        // Garantir que o cabeçalho Content-Type seja JSON
        res.setHeader('Content-Type', 'application/json');
        
        res.status(500).json({ error: "Erro ao obter os dados das ações." });
    }
}

