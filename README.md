# Zenith Marketplace

Este é o repositório principal do projeto Zenith, uma plataforma de e-commerce full-stack no estilo marketplace, desenvolvida como um projeto académico.

## Sobre o Projeto

O Zenith conecta Clientes, Vendedores e Administradores. A plataforma utiliza uma arquitetura híbrida de persistência para otimizar a performance, combinando um banco relacional para dados transacionais e um banco NoSQL para dados voláteis e de alto volume.

### Stack Tecnológica

* **Backend:** Java com Spring Boot
* **Banco de Dados:**
    * **MySQL:** Para dados transacionais (utilizadores, produtos, pedidos).
    * **MongoDB:** Para dados voláteis e documentos (carrinhos, avaliações, logs).
* **Frontend:** Aplicação web moderna utilizando (não sabemos como vai ser construido o front)

## Estrutura do Repositório

Este projeto é um "monorepo" lógico, dividido em duas pastas principais:

* `zenith-backend/`: Contém a API RESTful desenvolvida em Spring Boot.
* `zenith-frontend/`: Contém a aplicação de interface do utilizador (UI).

## Como Executar

Para instruções detalhadas sobre como configurar e executar cada parte da aplicação, por favor, consulte os ficheiros `README.md` dentro de cada subpasta:

1.  [**Instruções do Backend**](./zenith-backend/README.md)
2.  [**Instruções do Frontend**](./zenith-frontend/README.md)
