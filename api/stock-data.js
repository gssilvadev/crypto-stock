import yahooFinance from 'yahoo-finance2';

let previousPrices = {};

export default async function handler(req, res) {
    const stocks = [
        'BBDC4.SA', 'BBAS3.SA', 'MGLU3.SA', 'VIIA3.SA', 'B3SA3.SA',
        'BTC-USD', 'ETH-USD', 'VALE3.SA', 'PETR4.SA', 'ITUB4.SA'
    ];

    const data = {};

    try {
        for (let stock of stocks) {
            const ticker = await yahooFinance.quote(stock);
            const currentPrice = ticker.regularMarketPrice;
            const previousPrice = previousPrices[stock] || currentPrice;

            // Calcular variação
            const change = currentPrice - previousPrice;
            const changePercent = (change / previousPrice) * 100;

            // Atualizar o preço anterior
            previousPrices[stock] = currentPrice;

            // Armazenar os dados
            data[stock] = {
                price: currentPrice,
                change: change.toFixed(2),
                changePercent: changePercent.toFixed(2)
            };
        }

        // Envia os dados com a variação
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(data);
    } catch (error) {
        console.error('Erro ao obter os dados das ações:', error);
        res.setHeader('Content-Type', 'application/json');
        res.status(500).json({ error: "Erro ao obter os dados das ações." });
    }
}
