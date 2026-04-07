document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================
    // 1. CARREGAMENTO DO MENU
    // ==========================================
    const menuPlaceholder = document.getElementById('menu-placeholder');
    
    if (menuPlaceholder) {
        // Busca o menu.html na mesma pasta raiz do index.html
        fetch('menu.html')
            .then(response => {
                if (!response.ok) throw new Error("Erro ao carregar o menu");
                return response.text();
            })
            .then(data => {
                // Injeta o HTML do menu na página
                menuPlaceholder.innerHTML = data;

                // Re-inicializa a lógica de abrir/fechar o menu no celular
                const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
                if (mobileNavToggleBtn) {
                    mobileNavToggleBtn.addEventListener('click', function (e) {
                        document.querySelector('body').classList.toggle('mobile-nav-active');
                        this.classList.toggle('bi-list');
                        this.classList.toggle('bi-x');
                    });
                }

                // Opcional: Se houver vídeos/imagens no menu, reinicia o GLightbox
                if (typeof GLightbox !== 'undefined') {
                    GLightbox({ selector: '.glightbox' });
                }
            })
            .catch(error => {
                console.error('Erro ao carregar o menu:', error);
            });
    }

    // ==========================================
    // 2. CARREGAMENTO DAS NOTÍCIAS
    // ==========================================
    async function carregarNoticias() {
        try {
            const container = document.getElementById('noticias-container');
            if (!container) return; // Se não achar a div, cancela a função

            // MOCK TEMPORÁRIO DE DADOS (Simulando um Banco de Dados)
            const dadosBanco = [
                { id: 1, titulo: "Novo portal lançado", autor: "Equipe UFJ", categoria: "Tecnologia", data: "12 de Dezembro", imagem: "assets/img/blog/blog-post-1.webp", link: "blog-details.html" },
                { id: 2, titulo: "Encontro de Egressos 2026", autor: "Reitoria", categoria: "Eventos", data: "10 de Janeiro", imagem: "assets/img/blog/blog-post-2.webp", link: "blog-details.html" },
                { id: 3, titulo: "Oportunidades no agronegócio", autor: "Prof. Souza", categoria: "Mercado", data: "15 de Janeiro", imagem: "assets/img/blog/blog-post-3.webp", link: "blog-details.html" },
                { id: 4, titulo: "Notícia extra", autor: "Autor", categoria: "Geral", data: "20 de Janeiro", imagem: "assets/img/blog/blog-post-3.webp", link: "blog-details.html" }
            ];

            // Pega apenas as 3 primeiras notícias para mostrar na home
            const ultimasNoticias = dadosBanco.slice(0, 3);

            // Monta o HTML dinamicamente e injeta no container
            ultimasNoticias.forEach(noticia => {
                const cardHTML = `
                  <div class="col-xl-4 col-md-6">
                    <div class="post-item position-relative h-100" data-aos="fade-up" data-aos-delay="100">
                      <div class="post-img position-relative overflow-hidden">
                        <img src="${noticia.imagem}" class="img-fluid" alt="${noticia.titulo}">
                        <span class="post-date">${noticia.data}</span>
                      </div>
                      <div class="post-content d-flex flex-column">
                        <h3 class="post-title">${noticia.titulo}</h3>
                        <div class="meta d-flex align-items-center">
                          <div class="d-flex align-items-center">
                            <i class="bi bi-person"></i><span class="ps-2">${noticia.autor}</span>
                          </div>
                          <span class="px-3 text-black-50">/</span>
                          <div class="d-flex align-items-center">
                            <i class="bi bi-folder2"></i><span class="ps-2">${noticia.categoria}</span>
                          </div>
                        </div>
                        <hr />
                        <a href="${noticia.link}?id=${noticia.id}" class="readmore stretched-link">
                          <span>Saiba mais</span><i class="bi bi-arrow-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                `;
                container.innerHTML += cardHTML;
            });

            // Exibe o botão de "Ver todas" se houver mais de 3 itens
            if (dadosBanco.length > 3) {
                const btnTodas = document.getElementById('btn-todas-noticias');
                if (btnTodas) btnTodas.style.display = 'block';
            }

        } catch (error) {
            console.error("Erro ao carregar notícias:", error);
            document.getElementById('noticias-container').innerHTML = '<p>Não foi possível carregar as notícias no momento.</p>';
        }
    }

    carregarNoticias();

    // ==========================================
    // 3. CARREGAMENTO DOS EVENTOS
    // ==========================================
    async function carregarEventos() {
        try {
            const container = document.getElementById('eventos-container');
            if (!container) return; // Cancela a função se não achar a div

            // QUANDO TIVER O BANCO DE DADOS, SUBSTITUA PELO FETCH REAL:
            // const response = await fetch('URL_DO_BANCO/eventos?limit=5'); 
            // const dadosBancoEventos = await response.json();

            // MOCK TEMPORÁRIO DE DADOS
            const dadosBancoEventos = [
                { id: 1, titulo: "Semana de Engenharia de Software", descricao: "Apresentação de projetos finais e tendências em desenvolvimento ágil.", icone: "bi-laptop", link: "#" },
                { id: 2, titulo: "Workshop: Ética e Segurança em IA", descricao: "Debate focado nos novos desafios de segurança e auditoria em sistemas.", icone: "bi-shield-lock", link: "#" },
                { id: 3, titulo: "Hackathon de Computação Gráfica", descricao: "Maratona de desenvolvimento de soluções visuais interativas em 48 horas.", icone: "bi-palette", link: "#" },
                { id: 4, titulo: "Encontro de Egressos de TI", descricao: "Networking com ex-alunos que atuam no mercado nacional e parceiros.", icone: "bi-people", link: "#" },
                { id: 5, titulo: "Seminário de Sistemas Operacionais", descricao: "Estudos de caso e palestras sobre SO para sistemas críticos e IoT.", icone: "bi-cpu", link: "#" }
            ];

            // Pega apenas os 4 primeiros eventos para alinhar na home
            const ultimosEventos = dadosBancoEventos.slice(0, 4);

            // Monta o HTML dinamicamente
            let animDelay = 100; // Controle do atraso da animação AOS
            
            ultimosEventos.forEach(evento => {
                const cardHTML = `
                  <div class="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="${animDelay}">
                    <div class="service-item position-relative">
                      <div class="icon">
                        <i class="bi ${evento.icone} icon"></i>
                      </div>
                      <h4><a href="${evento.link}?id=${evento.id}" class="stretched-link">${evento.titulo}</a></h4>
                      <p>${evento.descricao}</p>
                    </div>
                  </div>
                `;
                container.innerHTML += cardHTML;
                animDelay += 100; // Aumenta 100ms para o próximo card
            });

            // Exibe o botão de "Ver todos" se houver mais de 4 itens no banco
            if (dadosBancoEventos.length > 4) {
                const btnTodos = document.getElementById('btn-todos-eventos');
                if (btnTodos) btnTodos.style.display = 'block';
            }

        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
            document.getElementById('eventos-container').innerHTML = '<p>Não foi possível carregar os eventos no momento.</p>';
        }
    }

    // Executa a função
    carregarEventos();

    // ==========================================
    // 4. CARREGAMENTO DOS DEPOIMENTOS
    // ==========================================
    async function carregarDepoimentos() {
        try {
            const wrapper = document.getElementById('depoimentos-wrapper');
            if (!wrapper) return;

            // QUANDO TIVER O BANCO DE DADOS, SUBSTITUA PELO FETCH REAL:
            // const response = await fetch('URL_DO_BANCO/depoimentos'); 
            // const dadosBancoDepoimentos = await response.json();

            // MOCK TEMPORÁRIO DE DADOS
            const dadosBancoDepoimentos = [
                { id: 1, nome: "Carlos Mendes", curso: "Ciência da Computação", texto: "Fui contratado pela Agrotechx graças às oportunidades divulgadas por ex-alunos aqui no portal. Uma rede de contatos fantástica!", imagem: "assets/img/person/person-m-9.webp", estrelas: 5 },
                { id: 2, nome: "Ana Júlia", curso: "Engenharia de Software", texto: "A plataforma facilitou muito minha conexão com o mercado. Acompanhar os egressos inspira a continuar evoluindo na carreira técnica.", imagem: "assets/img/person/person-f-5.webp", estrelas: 5 },
                { id: 3, nome: "Mariana Souza", curso: "Sistemas de Informação", texto: "Excelente iniciativa da universidade! Através do portal, consegui aplicar os conhecimentos em um projeto de impacto real na sociedade.", imagem: "assets/img/person/person-f-12.webp", estrelas: 5 },
                { id: 4, nome: "Lucas Alves", curso: "Medicina Veterinária", texto: "Manter o vínculo com a universidade e com os colegas abre muitas portas. Recomendo que todos os formandos participem ativamente.", imagem: "assets/img/person/person-m-12.webp", estrelas: 4 }
            ];

            // Renderiza os slides dinamicamente
            dadosBancoDepoimentos.forEach(depoimento => {
                
                // Lógica para montar as estrelas (de 1 a 5)
                let estrelasHTML = '';
                for (let i = 0; i < depoimento.estrelas; i++) {
                    estrelasHTML += '<i class="bi bi-star-fill"></i>';
                }

                const slideHTML = `
                  <div class="swiper-slide">
                    <div class="testimonial-item">
                      <img src="${depoimento.imagem}" class="testimonial-img" alt="Foto de ${depoimento.nome}">
                      <h3>${depoimento.nome}</h3>
                      <h4>${depoimento.curso}</h4>
                      <div class="stars">
                        ${estrelasHTML}
                      </div>
                      <p>
                        <i class="bi bi-quote quote-icon-left"></i>
                        <span>${depoimento.texto}</span>
                        <i class="bi bi-quote quote-icon-right"></i>
                      </p>
                    </div>
                  </div>
                `;
                wrapper.innerHTML += slideHTML;
            });

            // ATENÇÃO: Como injetamos os slides dinamicamente, precisamos avisar a 
            // biblioteca Swiper para recalcular o carrossel.
            setTimeout(() => {
                const swiperContainer = document.querySelector('.init-swiper');
                if (swiperContainer && swiperContainer.swiper) {
                    swiperContainer.swiper.update(); // Atualiza os slides e paginação
                }
            }, 100); // Um pequeno delay para garantir que o DOM renderizou o HTML

        } catch (error) {
            console.error("Erro ao carregar depoimentos:", error);
        }
    }

    // Executa a função
    carregarDepoimentos();
});