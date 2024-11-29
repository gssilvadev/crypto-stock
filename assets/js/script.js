jQuery(document).ready(function($) {
    // Verificar se os dados estão disponíveis
    if (typeof csiData !== 'undefined' && csiData.indices.length > 0) {
        let carouselContent = '';

        // Loop para gerar os itens do carrossel
        csiData.indices.forEach(function(index) {
            carouselContent += `
                <div class="carousel-item">
                    <h3>${index.name}</h3>
                    <p>Preço: R$ ${index.price}</p>
                    ${index.change ? `<p>Variação: ${index.change}</p>` : ''}
                </div>
            `;
        });

        // Inserir os itens no carrossel
        $('#crypto-stock-carousel').html(carouselContent);

        // Inicializar o carrossel Slick
        $('#crypto-stock-carousel').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 2000,
            dots: true,
            arrows: true,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
});
