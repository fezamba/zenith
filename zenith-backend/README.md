# Backend do Marketplace Zenith

Este diretório (`zenith-backend/`) contém a API RESTful completa para a plataforma de marketplace Zenith.

Esta API é *stateless*, utiliza autenticação baseada em JWT e serve todos os dados necessários para os três atores da plataforma (Clientes, Vendedores e Administradores), conforme definido nos documentos de requisitos.

O projeto utiliza uma arquitetura de **persistência híbrida**:

  * **MySQL** é usado para dados transacionais e relacionais centrais (Utilizadores, Produtos, Pedidos).
  * **MongoDB** é usado para dados mais voláteis, não estruturados ou de alto volume (Carrinhos de Compras, Avaliações de Produtos).

## Stack

  * **Java 21**
  * **Spring Boot 3.3.0**
      * **Spring Web:** Para a camada de API REST.
      * **Spring Data JPA:** Para a persistência relacional com MySQL.
      * **Spring Data MongoDB:** Para a persistência não relacional.
      * **Spring Security 6:** Para autenticação JWT e autorização baseada em *roles*.
  * **MySQL 8.0:** Banco de dados relacional.
  * **MongoDB:** Banco de dados NoSQL.
  * **Maven:** Gestor de dependências e build.
  * **Lombok:** Para redução de *boilerplate* em modelos e DTOs.
  * **jjwt (JSON Web Token):** Para a geração e validação de tokens de autenticação.
  * **Springdoc OpenAPI (Swagger):** Para a documentação automática da API.

## Pré-requisitos

Antes de começar, certifique-se de que tem as seguintes ferramentas instaladas e a correr localmente:

1.  **JDK 21** (ou superior).
2.  **Maven 3.9** (ou superior).
3.  **MySQL Server** (a correr na porta `3306`).
4.  **MongoDB Community Server** (a correr na porta `27017`).

## Configuração

Para que a aplicação arranque, são necessários 3 passos de configuração:

### 1\. Configurar o MySQL

A aplicação espera uma base de dados MySQL chamada `zenith_db`.

Execute o seguinte comando no seu *client* MySQL para criar a base de dados:

```sql
CREATE DATABASE IF NOT EXISTS zenith_db;
```

### 2\. Configurar o MongoDB

A aplicação espera uma base de dados MongoDB chamada `zenith_db`. O MongoDB irá criá-la automaticamente na primeira vez que a aplicação tentar escrever nela, pelo que não é necessária nenhuma ação manual.

### 3\. Configurar o `application.properties`

O ficheiro de configuração principal está em `src/main/resources/application.properties`.

Poderá ter de alterar as seguintes secções:

**Credenciais do Banco de Dados:**
Altere o `username` e `password` para corresponderem às suas credenciais de *root* do MySQL.

```properties
# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/zenith_db
spring.datasource.username=root
spring.datasource.password=root
```

**JWT:**
Altere o `zenith.jwt.secret` para uma *string* longa e segura. Este segredo é usado para assinar os tokens de autenticação.

```properties
# JWT
zenith.jwt.secret=SUA_CHAVE_SECRETA_MUITO_LONGA_E_SEGURA_DEVE_SER_COLOCADA_AQUI
zenith.jwt.expiration-ms=3600000
```

## Como Executar

Após concluir a configuração:

1.  Abra um terminal na raiz deste diretório (`zenith-backend/`).

2.  Execute o comando Maven para arrancar a aplicação:

    ```bash
    mvn spring-boot:run
    ```

A API estará agora a ser executada em `http://localhost:8080`.

## Documentação da API

Assim que a aplicação estiver a ser executada, a documentação completa e interativa da API estará disponível no seu navegador:

-> **`http://localhost:8080/swagger-ui.html`**

Esta interface permite visualizar e testar todos os endpoints disponíveis para Clientes, Vendedores e Administradores.