// Importando o pacote yahoo-finance2
import yahooFinance from 'yahoo-finance2';

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
                    data[stock] = ticker.regularMarketPrice;
                } else {
                    console.warn(`Dados de preço não encontrados para ${stock}`);
                    data[stock] = null; // Adiciona valor null se não houver preço
                }
            } catch (error) {
                console.error(`Erro ao obter dados para ${stock}:`, error);
                data[stock] = null; // Marca como null se falhar ao obter dados
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
