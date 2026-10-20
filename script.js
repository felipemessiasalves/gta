const nomeEl = document.querySelector(".nome");
const personagemEl = document.querySelector(".personagem");
const menu = document.getElementById("menu");
const botaoSelfie = document.getElementById("btn-selfie");

const COR_SELFIE = "#ffd319";
const CHAVE_SELFIE = "gta-selfie";
const CHAVE_ULTIMO = "gta-ultimo";

function escolherPersonagem(nomePersonagem, imagemPersonagem, corPersonagem, botao, tipo) {
  nomeEl.textContent = nomePersonagem;
  nomeEl.style.color = corPersonagem;
  nomeEl.style.setProperty("--escala", Math.min(1, 6 / Math.max(nomePersonagem.length, 1)));

  personagemEl.src = imagemPersonagem;
  personagemEl.alt = nomePersonagem;
  personagemEl.classList.toggle("cartao", tipo === "selfie");

  document.documentElement.style.setProperty("--cor", corPersonagem);

  menu.querySelectorAll(".avatar-btn").forEach((b) => {
    const ativo = b === botao;
    b.classList.toggle("ativo", ativo);
    b.setAttribute("aria-pressed", ativo);
  });

  [nomeEl, personagemEl].forEach((el) => {
    el.classList.remove("entrando");
    void el.offsetWidth;
    el.classList.add("entrando");
  });

  guardar(CHAVE_ULTIMO, botao?.dataset.nome);
}

function escolherPorBotao(botao) {
  escolherPersonagem(
    botao.dataset.nome,
    botao.dataset.img,
    botao.dataset.cor,
    botao,
    botao.dataset.tipo,
  );
}

menu.addEventListener("click", (e) => {
  const botao = e.target.closest(".avatar-btn");
  if (botao) escolherPorBotao(botao);
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
  if (document.getElementById("modal-selfie").open) return;
  if (e.target.matches("input")) return;

  const botoes = [...menu.querySelectorAll(".avatar-btn")];
  const atual = botoes.findIndex((b) => b.classList.contains("ativo"));
  const passo = e.key === "ArrowRight" ? 1 : -1;
  const proximo = botoes[(atual + passo + botoes.length) % botoes.length];
  escolherPorBotao(proximo);
  proximo.focus();
});

function guardar(chave, valor) {
  try {
    if (valor === undefined) localStorage.removeItem(chave);
    else localStorage.setItem(chave, valor);
  } catch {}
}

function ler(chave) {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}

function adicionarAvatarSelfie(nome, imagem) {
  let botao = document.getElementById("avatar-selfie");

  if (!botao) {
    const wrap = document.createElement("div");
    wrap.className = "avatar-wrap";

    botao = document.createElement("button");
    botao.id = "avatar-selfie";
    botao.className = "avatar-btn";
    botao.dataset.tipo = "selfie";
    botao.dataset.cor = COR_SELFIE;
    botao.setAttribute("aria-pressed", "false");
    botao.innerHTML = '<img class="avatar" alt="" />';

    const excluir = document.createElement("button");
    excluir.className = "excluir";
    excluir.type = "button";
    excluir.textContent = "×";
    excluir.addEventListener("click", excluirSelfie);

    wrap.append(botao, excluir);
    menu.insertBefore(wrap, botaoSelfie);
  }

  botao.dataset.nome = nome;
  botao.dataset.img = imagem;
  botao.setAttribute("aria-label", "Escolher " + nome);
  botao.parentElement.querySelector(".excluir").setAttribute("aria-label", "Excluir " + nome);
  botao.querySelector("img").src = imagem;
  return botao;
}

function excluirSelfie() {
  const botao = document.getElementById("avatar-selfie");
  if (!botao) return;
  if (!confirm("Excluir o personagem " + botao.dataset.nome + "?")) return;

  const estavaAtivo = botao.classList.contains("ativo");
  botao.parentElement.remove();
  guardar(CHAVE_SELFIE);

  if (estavaAtivo) {
    escolherPorBotao(menu.querySelector(".avatar-btn"));
  } else if (ler(CHAVE_ULTIMO) === botao.dataset.nome) {
    guardar(CHAVE_ULTIMO);
  }
}

const modal = document.getElementById("modal-selfie");
const video = document.getElementById("video");
const previa = document.getElementById("previa");
const guia = document.getElementById("guia");
const aviso = document.getElementById("modal-aviso");
const campoNome = document.getElementById("campo-nome");
const btnCapturar = document.getElementById("btn-capturar");
const btnUsar = document.getElementById("btn-usar");
const btnRefazer = document.getElementById("btn-refazer");
const btnUpload = document.getElementById("btn-upload");
const btnCancelar = document.getElementById("btn-cancelar");
const inputArquivo = document.getElementById("arquivo");

const AVISO_PADRAO = "Enquadre o rosto e capture. Vamos transformar em arte de quadrinhos.";

let stream = null;
let resultado = null;

async function iniciarCamera() {
  pararCamera();
  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error("sem suporte");
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
      audio: false,
    });
    video.srcObject = stream;
    btnCapturar.disabled = false;
  } catch {
    btnCapturar.disabled = true;
    aviso.textContent = "Não consegui acessar a câmera. Use “Enviar foto” para escolher uma imagem.";
  }
}

function pararCamera() {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  stream = null;
  video.srcObject = null;
}

function mostrarCamera() {
  resultado = null;
  previa.hidden = true;
  video.hidden = false;
  guia.hidden = false;
  btnCapturar.hidden = false;
  btnUpload.hidden = false;
  btnUsar.hidden = true;
  btnRefazer.hidden = true;
  aviso.textContent = AVISO_PADRAO;
  iniciarCamera();
}

function mostrarPrevia(dataUrl) {
  resultado = dataUrl;
  previa.src = dataUrl;
  previa.hidden = false;
  video.hidden = true;
  guia.hidden = true;
  btnCapturar.hidden = true;
  btnUpload.hidden = true;
  btnUsar.hidden = false;
  btnRefazer.hidden = false;
  aviso.textContent = "Ficou com cara de lenda. Dê um nome e use o personagem.";
  pararCamera();
}

botaoSelfie.addEventListener("click", () => {
  campoNome.value = ler(CHAVE_SELFIE) ? JSON.parse(ler(CHAVE_SELFIE)).nome : "";
  modal.showModal();
  mostrarCamera();
});

btnCapturar.addEventListener("click", async () => {
  if (!video.videoWidth) return;
  const cartao = await gerarCartao(video, video.videoWidth, video.videoHeight, true);
  mostrarPrevia(cartao);
});

inputArquivo.addEventListener("change", () => {
  const arquivo = inputArquivo.files[0];
  inputArquivo.value = "";
  if (!arquivo) return;

  const url = URL.createObjectURL(arquivo);
  const img = new Image();
  img.onload = async () => {
    const cartao = await gerarCartao(img, img.naturalWidth, img.naturalHeight, false);
    URL.revokeObjectURL(url);
    mostrarPrevia(cartao);
  };
  img.onerror = () => {
    aviso.textContent = "Não consegui ler essa imagem. Tente outra.";
  };
  img.src = url;
});

btnRefazer.addEventListener("click", mostrarCamera);

btnUsar.addEventListener("click", () => {
  if (!resultado) return;
  const nome = (campoNome.value.trim() || "Você").toUpperCase();

  guardar(CHAVE_SELFIE, JSON.stringify({ nome, img: resultado }));
  const botao = adicionarAvatarSelfie(nome, resultado);
  escolherPorBotao(botao);
  modal.close();
});

btnCancelar.addEventListener("click", () => modal.close());
modal.addEventListener("close", pararCamera);
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close();
});

const LARGURA = 360;
const ALTURA = 540;

async function gerarCartao(fonte, larguraFonte, alturaFonte, espelhar) {
  const trab = document.createElement("canvas");
  trab.width = LARGURA;
  trab.height = ALTURA;
  const tc = trab.getContext("2d", { willReadFrequently: true });

  let sw = alturaFonte * (2 / 3);
  let sh = alturaFonte;
  if (sw > larguraFonte) {
    sw = larguraFonte;
    sh = larguraFonte * 1.5;
  }
  const sx = (larguraFonte - sw) / 2;
  const sy = (alturaFonte - sh) / 2;

  tc.filter = "blur(1.2px)";
  if (espelhar) {
    tc.translate(LARGURA, 0);
    tc.scale(-1, 1);
  }
  tc.drawImage(fonte, sx, sy, sw, sh, 0, 0, LARGURA, ALTURA);
  tc.setTransform(1, 0, 0, 1, 0, 0);
  tc.filter = "none";

  const dados = tc.getImageData(0, 0, LARGURA, ALTURA);
  const px = dados.data;
  const cinza = new Float32Array(LARGURA * ALTURA);

  for (let i = 0, p = 0; i < px.length; i += 4, p++) {
    cinza[p] = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
  }

  const NIVEIS = 4;
  const passo = 255 / (NIVEIS - 1);
  const saida = new Uint8ClampedArray(px.length);

  for (let y = 0; y < ALTURA; y++) {
    for (let x = 0; x < LARGURA; x++) {
      const p = y * LARGURA + x;
      const i = p * 4;
      const g = cinza[p];

      for (let c = 0; c < 3; c++) {
        let v = g + (px[i + c] - g) * 1.5;
        v = (v - 128) * 1.25 + 128;
        v = Math.max(0, Math.min(255, v));
        saida[i + c] = Math.round(v / passo) * passo;
      }
      saida[i + 3] = 255;

      if (x > 0 && y > 0 && x < LARGURA - 1 && y < ALTURA - 1) {
        const gx =
          -cinza[p - LARGURA - 1] - 2 * cinza[p - 1] - cinza[p + LARGURA - 1] +
          cinza[p - LARGURA + 1] + 2 * cinza[p + 1] + cinza[p + LARGURA + 1];
        const gy =
          -cinza[p - LARGURA - 1] - 2 * cinza[p - LARGURA] - cinza[p - LARGURA + 1] +
          cinza[p + LARGURA - 1] + 2 * cinza[p + LARGURA] + cinza[p + LARGURA + 1];
        if (Math.abs(gx) + Math.abs(gy) > 150) {
          saida[i] = 25;
          saida[i + 1] = 10;
          saida[i + 2] = 40;
        }
      }
    }
  }
  tc.putImageData(new ImageData(saida, LARGURA, ALTURA), 0, 0);

  tc.globalCompositeOperation = "overlay";
  const grad = tc.createLinearGradient(0, 0, LARGURA, ALTURA);
  grad.addColorStop(0, "rgba(255, 60, 172, 0.55)");
  grad.addColorStop(1, "rgba(255, 170, 40, 0.45)");
  tc.fillStyle = grad;
  tc.fillRect(0, 0, LARGURA, ALTURA);
  tc.globalCompositeOperation = "source-over";

  try {
    await document.fonts.load('40px "Bangers"');
  } catch {}

  const W = 480;
  const H = 720;
  const cartao = document.createElement("canvas");
  cartao.width = W;
  cartao.height = H;
  const cc = cartao.getContext("2d");

  const fundo = cc.createLinearGradient(0, 0, W, H);
  fundo.addColorStop(0, "#ff3cac");
  fundo.addColorStop(0.5, "#784ba0");
  fundo.addColorStop(1, "#2a0845");
  cc.fillStyle = fundo;
  cc.fillRect(0, 0, W, H);

  const m = 18;
  cc.imageSmoothingQuality = "high";
  cc.drawImage(trab, m, m, W - m * 2, H - m * 2);

  const faixa = cc.createLinearGradient(0, H - 150, 0, H - m);
  faixa.addColorStop(0, "rgba(10, 2, 25, 0)");
  faixa.addColorStop(1, "rgba(10, 2, 25, 0.88)");
  cc.fillStyle = faixa;
  cc.fillRect(m, H - 150, W - m * 2, 150 - m);

  cc.textAlign = "center";
  cc.fillStyle = "#ffd319";
  cc.font = '64px "Bangers", Impact, sans-serif';
  const nomeFaixa = (campoNome.value.trim() || "Você").toUpperCase();
  cc.fillText(nomeFaixa, W / 2, H - 50, W - m * 4);

  cc.lineWidth = 6;
  cc.strokeStyle = "#fff";
  cc.strokeRect(m, m, W - m * 2, H - m * 2);

  return cartao.toDataURL("image/jpeg", 0.88);
}

(function iniciar() {
  const salvo = ler(CHAVE_SELFIE);
  if (salvo) {
    try {
      const { nome, img } = JSON.parse(salvo);
      adicionarAvatarSelfie(nome, img);
    } catch {}
  }

  const ultimo = ler(CHAVE_ULTIMO);
  const botao = [...menu.querySelectorAll(".avatar-btn")].find((b) => b.dataset.nome === ultimo);
  if (botao && !botao.classList.contains("ativo")) escolherPorBotao(botao);
})();
