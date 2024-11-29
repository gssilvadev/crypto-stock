<?php
// Verifica se o Python está instalado
$python_check = shell_exec('which python');

if ($python_check) {
    // Verifica se o pacote yfinance está instalado
    $pip_check = shell_exec('pip show yfinance');
    
    if (!$pip_check) {
        // Se o yfinance não estiver instalado, tenta instalar
        shell_exec('pip install yfinance');
    }
} else {
    echo "Python não está instalado. Instale o Python e o pip para usar este plugin.";
}
