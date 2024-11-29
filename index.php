<?php
/*
Plugin Name: Crypto & Stock Index Display
Description: Displays real-time cryptocurrency and stock indices.
Version: 1.0
Author: Gabriel Soares Silva
*/

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

function csi_enqueue_assets() {
    // Enqueue do estilo CSS do Slick Carousel
    wp_enqueue_style('slick-carousel', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css');
    wp_enqueue_style('slick-carousel-theme', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css');
    
    // Enqueue do JavaScript do Slick Carousel
    wp_enqueue_script('slick-carousel', 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js', ['jquery'], null, true);
    
    // Seu próprio estilo e script
    wp_enqueue_style('csi-style', plugin_dir_url(__FILE__) . 'assets/css/style.css');
    wp_enqueue_script('csi-script', plugin_dir_url(__FILE__) . 'assets/js/script.js', ['jquery'], null, true);
}
add_action('wp_enqueue_scripts', 'csi_enqueue_assets');

function fetch_stock_data_from_python() {
    // Diretório do plugin
    $plugin_directory = plugin_dir_path(__FILE__);
    
    // Caminho do script Python
    $script_path = $plugin_directory . 'assets/js/script.py';

    // Caminho correto do Python 3.13
    $python_path = 'C:/Users/gssilva/AppData/Local/Programs/Python/Python313/python.exe'; // Caminho atualizado do Python

    // Verifique se o script existe
    if (!file_exists($script_path)) {
        error_log("Erro: Script Python não encontrado em: " . $script_path);
        return null;
    }

    // Construa o comando para executar o script Python
    $command = escapeshellcmd($python_path . ' "' . $script_path . '"');
    
    // Log do comando para verificar o que está sendo executado
    error_log("Executando comando: " . $command);

    // Execute o comando e capture a saída
    $output = shell_exec($command);
    
    if ($output) {
        error_log("Saída do Python: " . $output);
        $data = json_decode($output, true);

        if (json_last_error() == JSON_ERROR_NONE) {
            return $data;
        } else {
            error_log("Erro ao decodificar JSON: " . json_last_error_msg());
            return null;
        }
    } else {
        error_log("Erro ao executar o comando Python.");
        return null;
    }
}





function display_stock_data_above_header() {
    $stock_data = fetch_stock_data_from_python(); // Chama a função que pega os dados
    
    if ($stock_data) {
        echo '<div id="stock-data-top" style="background-color: #f1f1f1; padding: 10px; text-align: center;">';
        echo '<h3>Dados das Ações:</h3>';
        echo '<ul class="stock-carousel">';
        foreach ($stock_data as $stock => $price) {
            echo "<li><strong>$stock</strong>: R$ " . number_format($price, 2, ',', '.') . "</li>";
        }
        echo '</ul>';
        echo '</div>';
    } else {
        echo '<div id="stock-data-top" style="background-color: #f1f1f1; padding: 10px; text-align: center;">';
        echo 'Não foi possível obter os dados das ações.';
        echo '</div>';
    }
}
add_action('wp_footer', 'display_stock_data_above_header');