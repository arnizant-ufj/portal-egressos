document.addEventListener("DOMContentLoaded", function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('menu.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;

                // --- A MÁGICA ACONTECE AQUI! ---
                // Após carregar o menu, precisamos reiniciar os scripts do template
                // para que eles "enxerguem" o novo HTML do menu.

                // 1. Re-inicializa o menu (para mobile e active state)
                const navmenu = document.querySelector('#navmenu');
                if (navmenu) {
                    // Simula a função original do main.js
                    new Navmenu(navmenu);
                }

                // 2. Re-inicializa o cabeçalho fixo (sticky header)
                const header = document.querySelector('#header');
                if (header) {
                    // Simula a função original do main.js
                    new Header(header, {
                        sticky: {
                            offset: 50
                        }
                    });
                }
                
                // 3. Re-ativa os Glightbox para vídeos ou imagens no menu, se houver
                const glightbox = GLightbox({
                    selector: '.glightbox'
                });

            }).catch(error => {
                console.error('Erro ao carregar o menu:', error);
            });
    }
});