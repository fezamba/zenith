# Zenith Frontend

Interface web para a plataforma de e-commerce Zenith, focada em sustentabilidade e comércio local. Este projeto foi desenvolvido utilizando JavaScript Vanilla, sem dependência de frameworks, garantindo leveza e total controle sobre a arquitetura.

## Stack

  * **HTML5:** Estrutura semântica.
  * **CSS3:** Design responsivo, uso de CSS Grid/Flexbox e Variáveis CSS para o tema.
  * **JavaScript:** Arquitetura modular para separação de responsabilidades.
  * **Fetch API:** Comunicação assíncrona com o Backend RESTful.
  * **JWT:** Gestão de autenticação e sessões via localStorage.

## Funcionalidades

O frontend implementa fluxos distintos para três tipos de atores:

### Cliente

  * **Vitrine:** Listagem de produtos com paginação e destaques.
  * **Busca Avançada:** Filtros por texto, categoria, faixa de preço e selos.
  * **Carrinho:** Gestão de itens, alteração de quantidade e cálculo de subtotal.
  * **Conta:** Login, cadastro e visualização de perfil.

### Vendedor

  * **Dashboard:** Visão geral dos seus produtos cadastrados.
  * **Gestão de Catálogo:** Cadastro e inativação de produtos.
  * **Gestão de Vendas:** Visualização de pedidos recebidos e atualização de status.
  * **Selos:** Solicitação de selos de sustentabilidade para produtos.

### Administrador

  * **Aprovações:** Fluxo de aprovação para novos vendedores e solicitações de selos.
  * **Categorias:** Gestão das categorias do sistema.

## Estrutura do Projeto

A arquitetura foi pensada para separar a lógica de negóciosda lógica de apresentação.

```bash
zenith-frontend/
│
├── pages/                  # Telas da aplicação
│   ├── home.html           # Página inicial
│   ├── produto-detalhe.html
│   ├── carrinho.html
│   ├── painel-vendedor.html
│   └── ...
│
└── assets/                 # Recursos estáticos
    ├── css/
    │   ├── style.css       # Estilos globais e variáveis de tema
    │   └── ...             # Estilos específicos por página
    │
    └── js/
        ├── api.js          # Camada de serviço
        ├── auth.js         # Gestão de Token JWT e Sessão
        ├── utils.js        # Formatadores
        └── ...             # Scripts controladores de cada página
```

## Instalação e Execução

### Pré-requisitos

  * O Backend deve estar rodando na porta `8080`.

### Passo a Passo

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/fezamba/zenith.git
    cd zenith/zenith-frontend
    ```

2.  **Configure a API:**
    Se o seu backend não estiver em `localhost:8080`, edite a constante `API_BASE_URL` no arquivo:
    `assets/js/api.js`

3.  **Execute o Frontend:**
    Você precisa servir os arquivos através de HTTP.

      * **Opção A (VS Code):**
        Instale a extensão Live Server, abra o arquivo `pages/home.html` e clique em "Go Live".

      * **Opção B (Python):**

        ```bash
        # Dentro da pasta zenith-frontend
        python -m http.server 5500
        # Acesse: http://localhost:5500/pages/home.html
        ```

      * **Opção C (Node):**

        ```bash
        npx http-server .
        ```

Desenvolvido para a disciplina de Engenharia de Software I e Projeto Integrador II - UNIRIO.
