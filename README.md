# 🌤️ Clima Bela

Um aplicativo web de previsão do tempo moderno e inteligente, desenvolvido com HTML, CSS e JavaScript puro (Vanilla JS). O Azra Clima fornece dados meteorológicos em tempo real e previsões precisas para os próximos 5 dias, com uma interface elegante que se adapta dinamicamente ao clima atual.

## ✨ Funcionalidades

* **Busca Inteligente:** Pesquise por cidade ou especifique a localização usando `Cidade, Estado` (ex: "Resende, Rio de Janeiro") para evitar resultados duplicados.
* **Fundos Dinâmicos:** A imagem de fundo do aplicativo muda automaticamente com base nas condições climáticas atuais (Sol, Chuva, Neve, Nublado, Tempestade).
* **Previsão de 5 Dias:** Acompanhe as temperaturas máximas e o clima dos próximos dias com ícones intuitivos.
* **Design Moderno:** Interface de usuário construída com conceitos de *Soft UI / Glassmorphism*, com tipografia limpa (Poppins) e cores agradáveis.
* **Sistema de Cache:** Salva as últimas pesquisas para economizar requisições à API e carregar os dados instantaneamente.

## 🛠️ Tecnologias Utilizadas

* **HTML5** e **CSS3** (Variáveis, Grid, Flexbox, Gradientes)
* **JavaScript** (ES6 Modules, Promises, Async/Await, Fetch API)
* **[Open-Meteo API](https://open-meteo.com/):** Fornece os dados meteorológicos precisos (totalmente gratuita e sem necessidade de chave de API).
* **Open-Meteo Geocoding API:** Usada para converter os nomes das cidades e estados em coordenadas globais (Latitude e Longitude).
* **Unsplash / Pinterest:** Fontes das imagens dinâmicas de fundo.

## 🚀 Como executar o projeto

Como o projeto utiliza **JavaScript Modules** (`type="module"`), você não pode simplesmente abrir o arquivo `index.html` com um duplo clique no navegador (isso causa um erro de CORS). 

Para rodar o projeto localmente, siga os passos:

1. Faça o clone deste repositório ou baixe os arquivos.
2. Abra a pasta do projeto no **VS Code**.
3. Instale a extensão **Live Server** (caso não tenha).
4. Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.
5. O aplicativo abrirá automaticamente no seu navegador padrão.

## 📁 Estrutura do Projeto

```text
/
├── index.html           # Estrutura principal da página
├── favicon.png          # Ícone do navegador (opcional)
├── README.md            # Documentação do projeto
├── css/
│   └── style.css        # Estilos globais e design responsivo
└── src/
    └── javascript/
        ├── api.js           # Lógica de busca e comunicação com a Open-Meteo
        ├── renderWeather.js # Lógica de renderização do HTML, fundos e emojis
        └── utility/
            └── cache.js     # Sistema de armazenamento local (Local Storage)
