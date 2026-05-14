const articles = [
  {
    title: "Java atual: linguagem, JVM e o que mudou na prática",
    category: "Java",
    level: "Intermediário",
    read: "12 min",
    summary:
      "Uma leitura guiada sobre a evolução do Java, releases, recursos modernos, compatibilidade e como decidir quando migrar.",
    tags: ["JVM", "LTS", "records", "virtual threads"],
  },
  {
    title: "Spring Boot sem piloto automático",
    category: "Java",
    level: "Avançado",
    read: "15 min",
    summary:
      "Como usar Spring Boot com critério: boundaries, configuração, observabilidade, testes e boas decisões de arquitetura.",
    tags: ["Spring", "APIs", "testes", "observabilidade"],
  },
  {
    title: "Arquitetura moderna para sistemas que precisam crescer",
    category: "Arquitetura",
    level: "Avançado",
    read: "14 min",
    summary:
      "Comparativo prático entre modular monolith, microsserviços, eventos, mensageria e trade-offs de distribuição.",
    tags: ["DDD", "eventos", "microsserviços"],
  },
  {
    title: "Cloud native: do deploy ao desenho operacional",
    category: "Cloud",
    level: "Intermediário",
    read: "10 min",
    summary:
      "Containers, Kubernetes, serverless, custos, confiabilidade e como pensar a operação antes do primeiro deploy.",
    tags: ["Kubernetes", "containers", "SRE"],
  },
  {
    title: "IA generativa no fluxo de desenvolvimento",
    category: "IA",
    level: "Intermediário",
    read: "9 min",
    summary:
      "Boas práticas para usar IA com revisão técnica, segurança, qualidade de código e produtividade sustentável.",
    tags: ["LLM", "prompts", "revisão"],
  },
  {
    title: "Frontend resiliente: acessibilidade, estado e performance",
    category: "Frontend",
    level: "Intermediário",
    read: "11 min",
    summary:
      "Como construir interfaces responsivas, acessíveis e rápidas usando componentes, design system e métricas reais.",
    tags: ["UX", "a11y", "performance"],
  },
  {
    title: "Segurança para quem escreve código todos os dias",
    category: "Segurança",
    level: "Essencial",
    read: "13 min",
    summary:
      "OWASP, autenticação, autorização, secrets, dependência segura e revisões que evitam problemas de produção.",
    tags: ["OWASP", "auth", "secrets"],
  },
  {
    title: "Métodos, APIs e exemplos: como transformar conceito em implementação",
    category: "Boas práticas",
    level: "Essencial",
    read: "8 min",
    summary:
      "Modelo editorial para publicar tutoriais com contexto, código, explicação de método e alternativas de implementação.",
    tags: ["código", "métodos", "tutorial"],
  },
  {
    title: "Banco de dados para aplicações modernas",
    category: "Dados",
    level: "Intermediário",
    read: "10 min",
    summary:
      "Modelagem, índices, transações, consistência, cache e critérios para escolher SQL, NoSQL ou busca especializada.",
    tags: ["SQL", "NoSQL", "cache"],
  },
];

const categories = ["Todos", ...new Set(articles.map((article) => article.category))];

const javaTopics = [
  {
    phase: "Fundamentos",
    title: "Sintaxe, OOP e coleções",
    text: "Classes, interfaces, generics, streams, exceptions, imutabilidade e modelagem limpa.",
  },
  {
    phase: "JVM",
    title: "Memória, GC e performance",
    text: "Heap, threads, profiling, garbage collectors, tuning e leitura de métricas de runtime.",
  },
  {
    phase: "Frameworks",
    title: "Spring, Quarkus, Micronaut e Jakarta EE",
    text: "Quando usar cada stack, como comparar ecossistemas e como evitar acoplamento desnecessário.",
  },
  {
    phase: "Arquitetura",
    title: "APIs, eventos e sistemas distribuídos",
    text: "REST, mensageria, resiliência, contratos, modularização, DDD e integração entre serviços.",
  },
  {
    phase: "Qualidade",
    title: "Testes, segurança e observabilidade",
    text: "JUnit, Testcontainers, logs estruturados, tracing, métricas, segurança de dependências e CI.",
  },
  {
    phase: "Java atual",
    title: "Evolução contínua",
    text: "Releases semestrais, versões LTS, virtual threads, pattern matching, records e migrações seguras.",
  },
];

const prompts = [
  "Atualizar uma trilha com as mudanças mais recentes de uma versão LTS e explicar o impacto em projetos reais.",
  "Criar um artigo comparando dois frameworks da mesma tecnologia com critérios de adoção, manutenção e custo.",
  "Publicar um guia de implementação com problema, contexto, código, testes, trade-offs e erros comuns.",
  "Revisar uma boa prática popular e mostrar quando ela ajuda, quando atrapalha e como aplicar com critério.",
  "Montar uma pauta de arquitetura conectando linguagem, framework, banco de dados, deploy e observabilidade.",
  "Atualizar o radar de segurança com uma vulnerabilidade, uma prevenção prática e uma checklist para times.",
  "Criar um roteiro de estudos semanal para profissionais que precisam se atualizar sem perder foco.",
];

const calendar = [
  ["Seg", "Fundamentos e evolução"],
  ["Ter", "Boas práticas e código"],
  ["Qua", "Frameworks e ecossistema"],
  ["Qui", "Arquitetura e cloud"],
  ["Sex", "Segurança e qualidade"],
  ["Sab", "IA, produtividade e carreira"],
  ["Dom", "Curadoria e plano da semana"],
];

let activeCategory = "Todos";

const articleGrid = document.querySelector("#articleGrid");
const filterTabs = document.querySelector("#filterTabs");
const searchInput = document.querySelector("#searchInput");
const javaMap = document.querySelector("#javaMap");
const calendarStrip = document.querySelector("#calendarStrip");
const dailyPrompt = document.querySelector("#dailyPrompt");
const newPrompt = document.querySelector("#newPrompt");
const themeToggle = document.querySelector("#themeToggle");

function renderFilters() {
  filterTabs.innerHTML = categories
    .map(
      (category) =>
        `<button type="button" class="${category === activeCategory ? "active" : ""}" data-category="${category}">${category}</button>`,
    )
    .join("");
}

function renderArticles() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = articles.filter((article) => {
    const matchesCategory = activeCategory === "Todos" || article.category === activeCategory;
    const content = `${article.title} ${article.category} ${article.summary} ${article.tags.join(" ")}`.toLowerCase();
    return matchesCategory && content.includes(term);
  });

  articleGrid.innerHTML = filtered.length
    ? filtered
        .map(
          (article) => `
            <article class="article-card">
              <div>
                <div class="tag-row">
                  <span class="tag">${article.category}</span>
                  <span class="tag">${article.level}</span>
                </div>
                <h3>${article.title}</h3>
                <p>${article.summary}</p>
              </div>
              <div>
                <div class="tag-row">
                  ${article.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
                </div>
                <div class="meta">
                  <span>${article.read}</span>
                  <span>Guia prático</span>
                </div>
              </div>
            </article>
          `,
        )
        .join("")
    : `<p class="empty-state">Nenhum artigo encontrado para esse filtro.</p>`;
}

function renderJavaMap() {
  javaMap.innerHTML = javaTopics
    .map(
      (topic) => `
        <article>
          <strong>${topic.phase}</strong>
          <div>
            <h3>${topic.title}</h3>
            <p>${topic.text}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderCalendar() {
  calendarStrip.innerHTML = calendar
    .map(
      ([day, topic]) => `
        <div>
          <strong>${day}</strong>
          <span>${topic}</span>
        </div>
      `,
    )
    .join("");
}

function setDailyPrompt(offset = 0) {
  const today = new Date();
  const index = (today.getFullYear() + today.getMonth() + today.getDate() + offset) % prompts.length;
  dailyPrompt.textContent = prompts[index];
}

filterTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderFilters();
  renderArticles();
});

searchInput.addEventListener("input", renderArticles);

newPrompt.addEventListener("click", () => {
  const index = Math.floor(Math.random() * prompts.length);
  dailyPrompt.textContent = prompts[index];
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

renderFilters();
renderArticles();
renderJavaMap();
renderCalendar();
setDailyPrompt();
