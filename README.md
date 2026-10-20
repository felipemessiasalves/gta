# 🌆 Dev City

> **Não é só um jogo.**
> Escolha uma lenda de Dev City. Ou tire uma selfie e vire uma.

🔗 **Demo online:** https://felipemessiasalves.github.io/gta/

---

## 📖 Sobre o projeto

**Dev City** é um jogo web com estética inspirada em jogos de mundo aberto urbano. O projeto começa pela tela de **seleção de personagem**, onde o jogador pode escolher um personagem pronto ou criar o próprio a partir de uma foto.

## ✨ Funcionalidades

- 🎮 **Seleção de personagem** com personagens pré-definidos:
  - Lucia
  - Jason
  - CJ
- 📷 **Vire uma lenda:** use a câmera para enquadrar o rosto e capturar uma selfie, que é transformada em **arte de quadrinhos**.
- 🖼️ **Envio de foto:** em vez de tirar uma selfie na hora, é possível enviar uma imagem da galeria.
- ✏️ **Nome personalizado** para o seu personagem.
- 📱 **Layout responsivo**, pensado para celular e desktop.

## 🗂️ Estrutura do projeto

```
gta/
├── index.html      # Tela de seleção de personagem
├── img/            # Imagens dos personagens (lucia.png, jason.png, cj.png)
└── ...
```

> Ajuste a estrutura acima conforme os arquivos reais do repositório.

## 🚀 Como executar

Não é preciso instalar nada. Basta clonar o repositório e abrir no navegador:

```bash
git clone https://github.com/felipemessiasalves/gta.git
cd gta
```

Abra o `index.html` no navegador. Para testar a câmera, prefira rodar em um servidor local (o navegador exige `https` ou `localhost` para acessar a câmera):

```bash
# com Python
python3 -m http.server 8000

# ou com Node
npx serve
```

Depois acesse `http://localhost:8000`.

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript
- API de câmera do navegador (`getUserMedia`)
- Hospedagem no **GitHub Pages**

## 🗺️ Próximos passos

- [ ] Tela de jogo / mundo aberto
- [ ] Salvar o personagem criado
- [ ] Mais personagens

## 👤 Autor

**Felipe Messias Alves Correa**

- GitHub: [@felipemessiasalves](https://github.com/felipemessiasalves)

## 📄 Licença

Defina a licença do projeto (por exemplo, MIT).
