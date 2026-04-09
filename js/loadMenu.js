document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // 0. CONFIGURAÇÃO GERAL
  // ==========================================
  const supabaseUrl = "https://gginfmhtmljrupzxqdic.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnaW5mbWh0bWxqcnVwenhxZGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MzIyNTYsImV4cCI6MjA5MTAwODI1Nn0.bqtLxP8Wf65ulEx_WVHztSbS3Mwobb6-Klq0cfcFTyQ";
  const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

  const mesesDoAno = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  // ==========================================
  // 1. CARREGAMENTO DO MENU
  // ==========================================
  const menuPlaceholder = document.getElementById('menu-placeholder');
  if (menuPlaceholder) {
    fetch('menu.html')
      .then(res => res.ok ? res.text() : Promise.reject("Erro ao carregar o menu"))
      .then(data => {
        menuPlaceholder.innerHTML = data;
        const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
        if (mobileNavToggleBtn) {
          mobileNavToggleBtn.addEventListener('click', function () {
            document.querySelector('body').classList.toggle('mobile-nav-active');
            this.classList.toggle('bi-list');
            this.classList.toggle('bi-x');
          });
        }
        if (typeof GLightbox !== 'undefined') {
          GLightbox({ selector: '.glightbox' });
        }
      })
      .catch(err => console.error(err));
  }

  // ==========================================
  // 2. CARREGAMENTO DAS NOTÍCIAS (DO BANCO)
  // ==========================================
  async function carregarNoticias() {
    const container = document.getElementById('noticias-container');
    if (!container) return;

    try {
      const { data: noticiasBanco, error } = await supabase
        .from('noticias')
        .select('*')
        .order('id', { ascending: false })
        .limit(4);

      if (error) throw error;
      container.innerHTML = '';

      const ultimasNoticias = noticiasBanco.slice(0, 3);

      ultimasNoticias.forEach(noticia => {
        const dataObj = new Date(noticia.created_at);
        const dataFormatada = `${dataObj.getDate()} de ${mesesDoAno[dataObj.getMonth()]}`;

        const cardHTML = `
                  <div class="col-xl-4 col-md-6">
                    <div class="post-item position-relative h-100" data-aos="fade-up" data-aos-delay="100">
                      <div class="post-img position-relative overflow-hidden">
                        <img src="${noticia.imagem_principal}" class="img-fluid" alt="${noticia.titulo}" style="width: 100%; height: 250px; object-fit: cover;">
                        <span class="post-date">${dataFormatada}</span>
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
                        <a href="blog-details.html?id=${noticia.id}" class="readmore stretched-link">
                          <span>Saiba mais</span><i class="bi bi-arrow-right"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                `;
        container.innerHTML += cardHTML;
      });

      if (noticiasBanco.length > 3) {
        const btnTodas = document.getElementById('btn-todas-noticias');
        if (btnTodas) btnTodas.style.display = 'block';
      }
    } catch (error) {
      console.error("Erro em Notícias:", error);
      container.innerHTML = '<p class="text-center w-100">Nenhuma notícia disponível no momento.</p>';
    }
  }

  // ==========================================
  // 3. CARREGAMENTO DOS EVENTOS (DO BANCO)
  // ==========================================
  async function carregarEventos() {
    const container = document.getElementById('eventos-container');
    if (!container) return;

    try {
      const hoje = new Date().toISOString().split('T')[0];

      const { data: eventosBanco, error } = await supabase
        .from('eventos')
        .select('*')
        .gte('data_inicio', hoje)
        .order('data_inicio', { ascending: true })
        .limit(5);

      if (error) throw error;
      container.innerHTML = '';

      const ultimosEventos = eventosBanco.slice(0, 4);
      let animDelay = 100;

      ultimosEventos.forEach(evento => {
        // Formata a data de início
        const dataInicioObj = new Date(evento.data_inicio + 'T00:00:00'); // T00:00:00 evita bugs de fuso horário
        let dataExibicao = `${dataInicioObj.getDate()} de ${mesesDoAno[dataInicioObj.getMonth()]}`;

        // Se o evento tiver data de fim, adiciona ao texto
        if (evento.data_fim) {
          const dataFimObj = new Date(evento.data_fim + 'T00:00:00');
          dataExibicao += ` a ${dataFimObj.getDate()} de ${mesesDoAno[dataFimObj.getMonth()]}`;
        }

        const cardHTML = `
                  <div class="col-xl-3 col-md-6 d-flex" data-aos="fade-up" data-aos-delay="${animDelay}">
                    <div class="service-item position-relative w-100">
                      <div class="icon">
                        <i class="bi bi-calendar-event icon"></i>
                      </div>
                      <h4><a href="evento-details.html?id=${evento.id}" class="stretched-link">${evento.titulo}</a></h4>
                      <p class="mt-3 text-secondary fw-medium">
                        <i class="bi bi-clock me-1 text-primary"></i> ${dataExibicao}
                      </p>
                    </div>
                  </div>
                `;
        container.innerHTML += cardHTML;
        animDelay += 100;
      });

      if (eventosBanco.length === 0) {
        container.innerHTML = '<p class="text-center w-100 text-muted">Nenhum evento futuro programado no momento.</p>';
      }

      if (eventosBanco.length > 4) {
        const btnTodos = document.getElementById('btn-todos-eventos');
        if (btnTodos) btnTodos.style.display = 'block';
      }
    } catch (error) {
      console.error("Erro em Eventos:", error);
      container.innerHTML = '<p class="text-center w-100">Nenhum evento disponível no momento.</p>';
    }
  }

  // ==========================================
  // 4. CARREGAMENTO DOS DEPOIMENTOS (DADOS FICTÍCIOS)
  // ==========================================
  async function carregarDepoimentos() {
    try {
      const wrapper = document.getElementById('depoimentos-wrapper');
      if (!wrapper) return;

      // MOCK TEMPORÁRIO DE DADOS
      const dadosBancoDepoimentos = [
        { id: 1, nome: "Carlos Mendes", curso: "Ciência da Computação", texto: "Fui contratado pela Agrotechx graças às oportunidades divulgadas por ex-alunos aqui no portal. Uma rede de contatos fantástica!", imagem: "assets/img/person/person-m-9.webp", estrelas: 5 },
        { id: 2, nome: "Ana Júlia", curso: "Engenharia de Software", texto: "A plataforma facilitou muito minha conexão com o mercado. Acompanhar os egressos inspira a continuar evoluindo na carreira técnica.", imagem: "assets/img/person/person-f-5.webp", estrelas: 5 },
        { id: 3, nome: "Mariana Souza", curso: "Sistemas de Informação", texto: "Excelente iniciativa da universidade! Através do portal, consegui aplicar os conhecimentos em um projeto de impacto real na sociedade.", imagem: "assets/img/person/person-f-12.webp", estrelas: 5 },
        { id: 4, nome: "Lucas Alves", curso: "Medicina Veterinária", texto: "Manter o vínculo com a universidade e com os colegas abre muitas portas. Recomendo que todos os formandos participem ativamente.", imagem: "assets/img/person/person-m-12.webp", estrelas: 4 }
      ];

      wrapper.innerHTML = ''; // Limpa o container antes de renderizar

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
                      <img src="${depoimento.imagem}" class="testimonial-img" alt="Foto de ${depoimento.nome}" style="width: 90px; height: 90px; object-fit: cover;">
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

  // Executa as funções simultaneamente para a página carregar mais rápido
  carregarNoticias();
  carregarEventos();
  carregarDepoimentos();
});