// js/adminLayout.js

const supabaseUrl = "https://gginfmhtmljrupzxqdic.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnaW5mbWh0bWxqcnVwenhxZGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MzIyNTYsImV4cCI6MjA5MTAwODI1Nn0.bqtLxP8Wf65ulEx_WVHztSbS3Mwobb6-Klq0cfcFTyQ";
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

async function inicializarPainel(paginaAtual, baseDir = ".") {
    try {
        // 1. VERIFICA SESSÃO
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
        if (!session || sessionError) {
            window.location.href = `${baseDir}/login.html`;
            return null;
        }

        // 2. BUSCA PERFIL
        const { data: perfil, error: perfilError } = await supabaseClient
            .from("perfis")
            .select("*")
            .eq("id", session.user.id)
            .single();

        if (perfilError || !perfil) {
            alert("Erro ao carregar perfil.");
            window.location.href = `${baseDir}/login.html`;
            return null;
        }

        // 3. REDIRECIONA EGRESSO CASO ELE TENTE ACESSAR O DASHBOARD
        if (paginaAtual === 'dashboard' && perfil.nivel_acesso === 'egresso') {
            window.location.href = `${baseDir}/perfil/index.html`;
            return null;
        }

        // 4. ATUALIZA HEADER
        const userNameEl = document.getElementById("user-name");
        const badgeNivelEl = document.getElementById("badge-nivel");
        if (userNameEl) userNameEl.innerText = perfil.nome;
        if (badgeNivelEl) {
            if (perfil.nivel_acesso === "administrador") badgeNivelEl.innerText = "Painel Admin";
            else if (perfil.nivel_acesso === "coordenacao") badgeNivelEl.innerText = "Coordenação";
            else badgeNivelEl.innerText = "Painel Egresso";
        }

        // 5. CONSTROÍ MENU DINÂMICO
        const menuContainer = document.getElementById("sidebar-menu");
        if (menuContainer) {
            let menuItems = [];

            if (perfil.nivel_acesso === "egresso") {
                menuItems = [
                    { id: 'perfil', url: `${baseDir}/perfil/index.html`, icon: 'bi-person-fill', text: 'Meu Perfil' },
                    { id: 'vagas', url: `${baseDir}/vagas/listar.html`, icon: 'bi-briefcase-fill', text: 'Oportunidades' },
                ];
            } else {
                menuItems = [
                    { id: 'dashboard', url: `${baseDir}/painel.html`, icon: 'bi-grid-1x2-fill', text: 'Dashboard' },
                    { id: 'perfil', url: `${baseDir}/perfil/index.html`, icon: 'bi-person-fill', text: 'Meu Perfil' },
                    { id: 'vagas', url: `${baseDir}/vagas/listar.html`, icon: 'bi-briefcase-fill', text: 'Oportunidades' },
                    { id: 'noticias', url: `${baseDir}/noticias/listar.html`, icon: 'bi-newspaper', text: 'Notícias' },
                    { id: 'eventos', url: `${baseDir}/eventos/listar.html`, icon: 'bi-calendar-event-fill', text: 'Eventos' },
                ];

                if (perfil.nivel_acesso === "administrador") {
                    menuItems.push({ id: 'usuarios', url: `${baseDir}/usuarios/listar.html`, icon: 'bi-people-fill', text: 'Usuários' });
                }
            }

            menuItems.forEach((item) => {
                const link = document.createElement("a");
                link.href = item.url;
                link.innerHTML = `<i class="bi ${item.icon}"></i> ${item.text}`;

                if (item.id === paginaAtual) {
                    link.classList.add("active");
                    const pageTitle = document.getElementById("page-title");
                    if (pageTitle) pageTitle.innerText = item.text;
                }

                menuContainer.appendChild(link);
            });
        }

        // 6. LÓGICA DE LOGOUT
        const btnLogout = document.getElementById("btn-logout");
        if (btnLogout) {
            btnLogout.addEventListener("click", async function (e) {
                e.preventDefault();
                await supabaseClient.auth.signOut();
                window.location.href = `${baseDir}/../index.html`;
            });
        }

        // 7. REMOVE TELA DE CARREGAMENTO
        const loading = document.getElementById("loading-screen");
        const mainPanel = document.getElementById("main-panel");
        if (loading) loading.style.display = "none";
        if (mainPanel) mainPanel.style.display = "block";

        return { supabase: supabaseClient, session, perfil };

    } catch (err) {
        console.error("Erro fatal na inicialização:", err);
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.innerHTML = `<div class="alert alert-danger m-4">Erro na inicialização. Verifique o console (F12).</div>`;
        }
    }
}