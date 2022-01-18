let etapaAtual = 0;
let numeroDigitado = "";
let votoEmBranco = false;
let votoNulo = false;
let votoLegenda = false;

function addClasse(seletor, classe) {
    let elemento = document.querySelector(seletor);
    elemento.classList.add(classe);
}

function removeClasse(seletor, classe) {
    let elemento = document.querySelector(seletor);
    elemento.classList.remove(classe);
}

function addHTML(seletor, menssagem) {
    let elemento = document.querySelector(seletor);
    elemento.innerHTML = menssagem;
}

function liberarEntrda() {
    let btns = document.querySelectorAll(".teclas-numeros");
    document.addEventListener("keyup", (event) => {
        let regex = new RegExp("[0-9]");
        if (event.key.match(regex)) {
            entrada(event.key);
        }
    });
    for (let btn of btns) {
        btn.onclick = () => {
            entrada(btn.innerHTML);
        };
    }
    document.querySelector(".tecla-branco").onclick = () => branco();
    document.querySelector(".tecla-corrige").onclick = () => corrigir();
    document.querySelector(".tecla-confirma").onclick = () => confirmar();
}

function inicarVotacao() {
    votoEmBranco = false;
    votoNulo = false;
    votoLegenda = false;
    atualizaCandidados();
    let etapa = etapas[etapaAtual];
    let numerosElemento = ``;

    removeClasse(".tela-principal", "esconder");
    removeClasse(".numero-input", "esconder");
    addClasse(".tela-fim", "esconder");
    addClasse(".nome-vice", "esconder");
    addClasse(".partido-vice", "esconder");
    addClasse(".candidato-menor", "esconder");

    addClasse(".rotulo-info span", "esconder");
    addClasse(".rotulo-numero span", "esconder");
    addClasse(".direita", "esconder");
    addClasse(".tela-rodape", "esconder");
    addClasse(".candidato-selecionado", "esconder");
    addClasse(".menssagem", "esconder");
    addClasse(".menssagem-erro", "esconder");
    addClasse(".mensagem-voto-legenda", "esconder");

    addHTML(".rotulo-cargo span", etapa.titulo);

    for (let i = 0; i < etapa.numeros; i++) {
        if (i === 0) {
            addHTML(
                ".numero-input",
                (numerosElemento += `<div class="numero n-${i + 1} pisca"></div>`)
            );
        } else {
            addHTML(
                ".numero-input",
                (numerosElemento += `<div class="numero n-${i + 1}"></div>`)
            );
        }
    }
    liberarEntrda();
}

function atualizaCandidados() {
    removeClasse(".candidato-container", "esconder");
    let etapa = etapas[etapaAtual];
    let candidatoHtml = "";

    addHTML(".candidato-container h3 span", `${etapa.titulo}`);

    for (let num in etapa["candidatos"]) {
        candidatoHtml = `${candidatoHtml}
        <div class="candidato-votante">
                <img src="img/${etapa["candidatos"][num].foto}" alt="">
            <div class="dados-canditado">
                <div class="numero-candidato"> 
                    Número: 
                    <span>${num}</span>
                </div>
                <span class="nome-canditado">
                    ${etapa["candidatos"][num].nome}
                </span>
                <div class="partido-canditado"> 
                    Partido: 
                    <span>${etapa["candidatos"][num].partido}</span>
                </div>
            </div>
        </div>
        `;

        addHTML(".candidato-lista", `${candidatoHtml}`);
    }
}

function entrada(n) {
    let elNumero = document.querySelector(".numero.pisca");
    if (elNumero != null) {
        numeroDigitado = `${numeroDigitado}${n}`;
        addHTML(".numero.pisca", n);
        removeClasse(".numero.pisca", "pisca");
        new Audio("../audio/se1.mp3").play();

        if (etapaAtual == 0 && numeroDigitado.length == 2) {
            votoLegenda = true;
            atualizarInterface();
        } else {
            votoLegenda = false;

        }

        if (elNumero.nextElementSibling) {
            elNumero.nextElementSibling.classList.add("pisca");
        } else {
            atualizarInterface();
        }
    }
}

function atualizarInterface() {
    let etapa = etapas[etapaAtual];
    let candidato = null;
    let legenda = null;


    if (votoLegenda) {
        let proximaEtapa = etapas[etapaAtual + 1];
        for (let num in proximaEtapa["candidatos"]) {
            if (num == numeroDigitado) {
                legenda = proximaEtapa["candidatos"][num].partido;
                break;
            }
        }
    } else {
        for (let num in etapa["candidatos"]) {
            if (num == numeroDigitado) {
                candidato = etapa["candidatos"][num];
                votoNulo = false;
                break;
            } else {
                votoNulo = true;
            }
        }
    }

    if (candidato) {
        removeClasse(".rotulo-info span", "esconder");
        removeClasse(".rotulo-numero span", "esconder");
        removeClasse(".direita", "esconder");
        removeClasse(".tela-rodape", "esconder");
        removeClasse(".candidato-selecionado", "esconder");

        addClasse(".mensagem-voto-legenda", "esconder");
        addClasse(".menssagem", "esconder");



        addHTML(".nome-candidato span", candidato.nome);
        addHTML(".partido-politico span", candidato.partido);
        addHTML(".cargo p", etapas[etapaAtual].titulo);
        document.querySelector(".imagem img").src = `img/${candidato.foto}`;

        if (etapaAtual == 1) {
            removeClasse(".candidato-menor", "esconder");
            removeClasse(".nome-vice", "esconder");
            removeClasse(".partido-vice", "esconder");

            document.querySelector(
                ".candidato-menor img"
            ).src = `img/${candidato.vice.foto}`;
            addHTML(".nome-vice span", candidato.vice.nome);
            addHTML(".partido-vice span", candidato.vice.partido);
            addHTML(".candidato-menor .cargo p", "Vice-Prefeito");

        }
    }
    if (legenda) {

        addHTML(".menssagem", `voto na legenda`);
        addHTML(".mensagem-voto-legenda span", `${partidos[legenda].nome}`);
        removeClasse(".mensagem-voto-legenda", "esconder");
        removeClasse(".menssagem", "esconder");
        removeClasse(".direita", "esconder");
        addHTML(".cargo p", "Partido");
        document.querySelector(".imagem img").src = `img/${partidos[legenda].img}`;


    }
    if (votoNulo) {
        addClasse(".mensagem-voto-legenda", "esconder");
        addClasse(".direita", "esconder");

        removeClasse(".menssagem", "esconder");
        addHTML(".menssagem", "voto nulo");

        removeClasse(".menssagem-erro", "esconder");
        addHTML(".menssagem", "voto nulo");
        removeClasse(".rotulo-info span", "esconder");
        removeClasse(".rotulo-numero span", "esconder");
        removeClasse(".tela-rodape", "esconder");
    }
}

function branco() {
    if (numeroDigitado === "") {
        new Audio("../audio/se2.mp3").play();
        numeroDigitado = "";
        votoEmBranco = true;
        removeClasse(".menssagem", "esconder");
        addHTML(".menssagem", "voto em branco");

        removeClasse(".rotulo-info span", "esconder");

        removeClasse(".tela-rodape", "esconder");
        addClasse(".numero-input", "esconder");
    } else {
        alert("Para votar em BRANCO,\nnão poder ter digitado nenhum número!");
    }
}

function corrigir() {
    new Audio("../audio/se2.mp3").play();
    numeroDigitado = "";
    inicarVotacao();
}

function confirmar() {

    if (
        votoEmBranco ||
        votoLegenda ||
        votoNulo ||
        numeroDigitado.length == etapas[etapaAtual].numeros
    ) {
        new Audio("../audio/se2.mp3").play();

        if (sessionStorage.getItem(numeroDigitado) !== null) {
            let votos = parseInt(sessionStorage.getItem(numeroDigitado)) + 1;
            sessionStorage.setItem(numeroDigitado, votos);
        } else {
            sessionStorage.setItem(numeroDigitado, 1);
        }

        if (etapaAtual == 1) {
            etapaAtual = 0;
            numeroDigitado = "";
            fim();
        } else {
            etapaAtual++;
            numeroDigitado = "";
            inicarVotacao();
        }
    }
}

inicarVotacao();

function fim() {
    addClasse(".candidato-container", "esconder");
    addClasse(".tela-principal", "esconder");
    addClasse(".tela-rodape", "esconder");
    removeClasse(".tela-salvando", "esconder");
    addClasse(".tela-principal", "esconder");
    setTimeout(() => {
        addClasse(".tela-salvando", "esconder");
        removeClasse(".tela-fim", "esconder");
        new Audio("../audio/se3.mp3").play();
        updataRelogio();
        setInterval(updataRelogio, 1000);
    }, 4000);
}

function updataRelogio() {
    let data = new Date();
    // horas = data.getHours(),
    // minutos = data.getMinutes(),
    // segundos = data.getSeconds();
    //addHTML(".dataHora", `${fixZero(horas)}:${fixZero(minutos)}:${fixZero(segundos)}`);
    // let monName = new Array("Janeiro", "Jevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro");
    //  `${dayName[data.getDay()]} , ${data.getDate()} de ${monName[data.getMonth()]} de ${data.getFullYear ()}`)

    let dayName = new Array("Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb");

    let dataString = `${dayName[data.getDay()]}, ${data.toLocaleString("PT-BR")}`;
    addHTML(".dataHora", dataString);
}

function fixZero(time) {
    return time < 10 ? `0${time}` : time;
}