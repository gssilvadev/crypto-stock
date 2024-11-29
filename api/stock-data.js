// Importando o pacote yahoo-finance2
import yahooFinance from 'yahoo-finance2';

// Armazenando os preços anteriores (pode ser em um banco ou arquivo, mas para fins de exemplo, usaremos um objeto simples)
let lastStockData = {};

export default async function handler(req, res) {
    const stocks = [
        'BBDC4.SA', 'BBAS3.SA', 'MGLU3.SA', 'VIIA3.SA', 'B3SA3.SA',
        'BTC-USD', 'ETH-USD', 'VALE3.SA', 'PETR4.SA', 'ITUB4.SA'
    ];

    const data = {};

    try {
        // Loop para obter o preço de fechamento de cada ação
        for (let stock of stocks) {
            try {
                const ticker = await yahooFinance.quote(stock);

                // Verifica se a informação de preço de mercado existe
                if (ticker.regularMarketPrice !== undefined) {
                    const currentPrice = ticker.regularMarketPrice;
                    let variation = null;
                    let arrow = '';

                    // Verifica se já temos o preço anterior para calcular a variação
                    if (lastStockData[stock] !== undefined) {
                        const lastPrice = lastStockData[stock];
                        // Calcula a variação percentual
                        variation = ((currentPrice - lastPrice) / lastPrice) * 100;

                        // Define a seta baseada na variação
                        if (variation > 0) {
                            arrow = '↑'; // Seta para cima se subiu
                        } else if (variation < 0) {
                            arrow = '↓'; // Seta para baixo se caiu
                        }
                    }

                    // Atualiza os preços anteriores
                    lastStockData[stock] = currentPrice;

                    // Adiciona os dados à resposta
                    data[stock] = {
                        price: currentPrice,
                        variation: variation,
                        arrow: arrow
                    };
                } else {
                    console.warn(`Dados de preço não encontrados para ${stock}`);
                    data[stock] = { price: null, variation: null, arrow: null }; // Adiciona valor null se não houver preço
                }
            } catch (error) {
                console.error(`Erro ao obter dados para ${stock}:`, error);
                data[stock] = { price: null, variation: null, arrow: null }; // Marca como null se falhar ao obter dados
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
