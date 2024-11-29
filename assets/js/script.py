import yfinance as yf
import json

# Lista de símbolos de ações, índices e criptomoedas
stocks = [
    'BBDC4.SA', 'BBAS3.SA', 'MGLU3.SA', 'B3SA3.SA',  # Ações brasileiras
    # 'INX', 'NDX', 'DOLAR=X', 'EURUSD=X',  # Índices e moedas
    'BTC-USD', 'ETH-USD',  # Criptomoedas
    'VALE3.SA', 'PETR4.SA', 'ITUB4.SA'  # Outras ações brasileiras
]

data = {}

# Loop para obter o preço de fechamento de cada ativo
for stock in stocks:
    ticker = yf.Ticker(stock)
    history = ticker.history(period="1d")
    
    # Verifica se há dados disponíveis
    if not history.empty:
        data[stock] = history['Close'].iloc[-1]
    else:
        data[stock] = "No data available"  # Caso não haja dados

# Exibe os dados no formato JSON
print(json.dumps(data))  # Corrigido para json.dumps
