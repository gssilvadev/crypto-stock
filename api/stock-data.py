import yfinance as yf
import json

def handler(request):
    # Lista de símbolos de ações, índices e criptomoedas
    stocks = [
        'BBDC4.SA', 'BBAS3.SA', 'MGLU3.SA', 'VIIA3.SA', 'B3SA3.SA',  # Ações brasileiras
        'BTC-USD', 'ETH-USD',  # Criptomoedas
        'VALE3.SA', 'PETR4.SA', 'ITUB4.SA'  # Outras ações brasileiras
    ]
    
    data = {}

    for stock in stocks:
        ticker = yf.Ticker(stock)
        history = ticker.history(period="1d")
        
        if not history.empty:
            data[stock] = history['Close'].iloc[-1]
        else:
            data[stock] = "No data available"

    return json.dumps(data)  # Retorna os dados como JSON
