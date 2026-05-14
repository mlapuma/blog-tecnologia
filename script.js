const articles = [
  {
    title: "Java atual: linguagem, JVM e o que mudou na pratica",
    category: "Java",
    level: "Intermediario",
    read: "12 min",
    summary:
      "Uma leitura guiada sobre evolucao do Java, releases, recursos modernos, compatibilidade e como decidir quando migrar.",
    tags: ["JVM", "LTS", "records", "virtual threads"],
  },
  {
    title: "Spring Boot sem piloto automatico",
    category: "Java",
    level: "Avancado",
    read: "15 min",
    summary:
      "Como usar Spring Boot com criterio: boundaries, configuracao, observabilidade, testes e boas decisoes de arquitetura.",
    tags: ["Spring", "APIs", "testes", "observabilidade"],
  },
  {
    title: "Arquitetura moderna para sistemas que precisam crescer",
    category: "Arquitetura",
    level: "Avancado",
    read: "14 min",
    summary:
      "Comparativo pratico entre modular monolith, microservicos, eventos, mensageria e trade-offs de distribuicao.",
    tags: ["DDD", "eventos", "microservicos"],
  },
  {
    title: "Cloud native: do deploy ao desenho operacional",
    category: "Cloud",
    level: "Intermediario",
    read: "10 min",
    summary:
      "Containers, Kubernetes, serverless, custos, confiabilidade e como pensar operacao antes do primeiro deploy.",
    tags: ["Kubernetes", "containers", "SRE"],
  },
  {
    title: "IA generativa no fluxo de desenvolvimento",
    category: "IA",
    level: "Intermediario",
    read: "9 min",
    summary:
      "Boas praticas para usar IA com revisao tecnica, seguranca, qualidade de codigo e produtividade sustentavel.",
    tags: ["LLM", "prompts", "revisao"],
  },
  {
    title: "Frontend resiliente: acessibilidade, estado e performance",
    category: "Frontend",
    level: "Intermediario",
    read: "11 min",
    summary:
      "Como construir interfaces responsivas, acessiveis e rapidas usando componentes, design system e metricas reais.",
    tags: ["UX", "a11y", "performance"],
  },
  {
    title: "Seguranca para quem escreve codigo todos os dias",
    category: "Seguranca",
    level: "Essencial",
    read: "13 min",
    summary:
      "OWASP, autenticacao, autorizacao, secrets, dependencia segura e revisoes que evitam problemas de producao.",
    tags: ["OWASP", "auth", "secrets"],
  },
  {
    title: "Metodos, APIs e exemplos: como transformar conceito em implementacao",
    category: "Boas praticas",
    level: "Essencial",
    read: "8 min",
    summary:
      "Modelo editorial para publicar tutoriais com contexto, codigo, explicacao de metodo e alternativas de implementacao.",
    tags: ["codigo", "metodos", "tutorial"],
  },
  {
    title: "Banco de dados para aplicacoes modernas",
    category: "Dados",
    level: "Intermediario",
    read: "10 min",
    summary:
      "Modelagem, indices, transacoes, consistencia, cache e criterios para escolher SQL, NoSQL ou busca especializada.",
    tags: ["SQL", "NoSQL", "cache"],
  },
];

const categories = ["Todos", ...new Set(articles.map((article) => article.category))];

const javaTopics = [
  {
    phase: "Fundamentos",
    title: "Sintaxe, OOP e colecoes",
    text: "Classes, interfaces, generics, streams, exceptions, imutabilidade e modelagem limpa.",
  },
  {
    phase: "JVM",
    title: "Memoria, GC e performance",
    text: "Heap, threads, profiling, garbage collectors, tuning e leitura de metricas de runtime.",
  },
  {
    phase: "Frameworks",
    title: "Spring, Quarkus, Micronaut e Jakarta EE",
    text: "Quando usar cada stack, como comparar ecossistemas e como evitar acoplamento desnecessario.",
  },
  {
    phase: "Arquitetura",
    title: "APIs, eventos e sistemas distribuidos",
    text: "REST, mensageria, resiliencia, contratos, modularizacao, DDD e integracao entre servicos.",
  },
  {
    phase: "Qualidade",
    title: "Testes, seguranca e observabilidade",
    text: "JUnit, Testcontainers, logs estruturados, tracing, metricas, seguranca de dependencias e CI.",
  },
  {
    phase: "Java atual",
    title: "Evolucao continua",
    text: "Releases semestrais, versoes LTS, virtual threads, pattern matching, records e migracoes seguras.",
  },
];

const prompts = [
  "Atualizar uma trilha com as mudancas mais recentes de uma versao LTS e explicar o impacto em projetos reais.",
  "Criar um artigo comparando dois frameworks da mesma tecnologia com criterios de adocao, manutencao e custo.",
  "Publicar um guia de implementacao com problema, contexto, codigo, testes, trade-offs e erros comuns.",
  "Revisar uma boa pratica popular e mostrar quando ela ajuda, quando atrapalha e como aplicar com criterio.",
  "Montar uma pauta de arquitetura conectando linguagem, framework, banco de dados, deploy e observabilidade.",
  "Atualizar o radar de seguranca com uma vulnerabilidade, uma prevencao pratica e uma checklist para times.",
  "Criar um roteiro de estudos semanal para profissionais que precisam se atualizar sem perder foco.",
];

const calendar = [
  ["Seg", "Fundamentos e evolucao"],
  ["Ter", "Boas praticas e codigo"],
  ["Qua", "Frameworks e ecossistema"],
  ["Qui", "Arquitetura e cloud"],
  ["Sex", "Seguranca e qualidade"],
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
                  <span>Guia pratico</span>
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
