// ========================================
// PONTO ARENA
// ========================================


// ========================================
// CONFIGURAÇÕES
// ========================================

const TOLERANCIA_ATRASO_MINUTOS = 30;
const MINIMO_COBRANCA_MINUTOS = 60;


// ========================================
// ELEMENTOS - TELA INICIAL
// ========================================

const valorHora = document.getElementById("valorHora");
const quantidadeHorarios = document.getElementById("quantidadeHorarios");
const horarioInicio = document.getElementById("horarioInicio");
const custoTotal = document.getElementById("custoTotal");
const btnIniciar = document.getElementById("btnIniciar");

const listaHistorico = document.getElementById("listaHistorico");
const contadorHistorico = document.getElementById("contadorHistorico");


// ========================================
// ELEMENTOS - TELA DA PARTIDA
// ========================================

const nomeJogador = document.getElementById("nomeJogador");
const entradaTeste = document.getElementById("entradaTeste");
const saidaTeste = document.getElementById("saidaTeste");
const btnAdicionar = document.getElementById("btnAdicionar");

const listaJogadores = document.getElementById("listaJogadores");
const contadorJogadores = document.getElementById("contadorJogadores");

const valorHoraExibido = document.getElementById("valorHoraExibido");
const horariosExibidos = document.getElementById("horariosExibidos");
const custoTotalExibido = document.getElementById("custoTotalExibido");
const horarioPartida = document.getElementById("horarioPartida");

const areaAdicionar = document.getElementById("areaAdicionar");

const btnFinalizar = document.getElementById("btnFinalizar");
const btnCopiar = document.getElementById("btnCopiar");
const btnNovaPartida = document.getElementById("btnNovaPartida");


// ========================================
// ESTADO
// ========================================

let jogadores =
    JSON.parse(localStorage.getItem("jogadores")) || [];

let partidaFinalizada =
    localStorage.getItem("partidaFinalizada") === "true";

let valoresFinais =
    JSON.parse(localStorage.getItem("valoresFinais")) || null;

let historicoPartidas =
    JSON.parse(localStorage.getItem("historicoPartidas")) || [];


// ========================================
// CONVERTER DATAS DOS JOGADORES
// ========================================

jogadores = jogadores.map(function(jogador) {

    return {
        ...jogador,

        entrada:
            new Date(jogador.entrada),

        saida:
            jogador.saida
                ? new Date(jogador.saida)
                : null
    };

});


// ========================================
// TELA INICIAL
// ========================================

if (
    valorHora &&
    quantidadeHorarios &&
    horarioInicio &&
    custoTotal &&
    btnIniciar
) {

    function atualizarCusto() {

        const valor =
            Number(valorHora.value);

        const horarios =
            Number(quantidadeHorarios.value);

        const total =
            valor * horarios;

        custoTotal.textContent =
            formatarDinheiro(total);
    }


    valorHora.addEventListener(
        "input",
        atualizarCusto
    );


    quantidadeHorarios.addEventListener(
        "input",
        atualizarCusto
    );


    btnIniciar.addEventListener(
        "click",
        function() {

            const valor =
                Number(valorHora.value);

            const horarios =
                Number(quantidadeHorarios.value);

            const inicio =
                horarioInicio.value;


            const modoSelecionado =
                document.querySelector(
                    'input[name="modoPartida"]:checked'
                );


            const modo =
                modoSelecionado
                    ? modoSelecionado.value
                    : "real";


            if (valor <= 0) {

                alert(
                    "Informe um valor válido para a arena."
                );

                return;
            }


            if (horarios <= 0) {

                alert(
                    "Informe a quantidade de horários."
                );

                return;
            }


            if (!inicio) {

                alert(
                    "Informe o horário de início."
                );

                return;
            }


            // Limpa somente os dados da partida atual.
            // O histórico NÃO é apagado.

            localStorage.removeItem("jogadores");
            localStorage.removeItem("valoresFinais");

            localStorage.setItem(
                "partidaFinalizada",
                "false"
            );


            localStorage.setItem(
                "partidaAtiva",
                "true"
            );

            localStorage.setItem(
                "valorHora",
                valor
            );

            localStorage.setItem(
                "quantidadeHorarios",
                horarios
            );

            localStorage.setItem(
                "horarioInicio",
                inicio
            );

            localStorage.setItem(
                "modoPartida",
                modo
            );


            window.location.href =
                "partida.html";
        }
    );
}


// ========================================
// HISTÓRICO NA TELA INICIAL
// ========================================

if (
    listaHistorico &&
    contadorHistorico
) {

    atualizarHistorico();
}


// ========================================
// TELA DA PARTIDA
// ========================================

if (
    nomeJogador &&
    btnAdicionar &&
    listaJogadores &&
    contadorJogadores
) {

    configurarModoPartida();

    exibirDadosPartida();

    atualizarLista();

    atualizarEstadoInterface();


    btnAdicionar.addEventListener(
        "click",
        adicionarJogador
    );


    nomeJogador.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {
                adicionarJogador();
            }
        }
    );


    if (btnFinalizar) {

        btnFinalizar.addEventListener(
            "click",
            finalizarPartida
        );
    }


    if (btnCopiar) {

        btnCopiar.addEventListener(
            "click",
            copiarResumo
        );
    }


    if (btnNovaPartida) {

        btnNovaPartida.addEventListener(
            "click",
            novaPartida
        );
    }
}


// ========================================
// CONFIGURAR MODO REAL / TESTE
// ========================================

function configurarModoPartida() {

    const modo =
        obterModoPartida();


    const textoCabecalho =
        document.querySelector(
            ".cabecalho p"
        );


    const aviso =
        document.querySelector(
            ".aviso-teste"
        );


    // ========================================
    // MODO REAL
    // ========================================

    if (modo === "real") {

        if (entradaTeste) {
            entradaTeste.style.display =
                "none";
        }


        if (saidaTeste) {
            saidaTeste.style.display =
                "none";
        }


        if (btnAdicionar) {

            btnAdicionar.textContent =
                "🟢 Registrar entrada";
        }


        if (textoCabecalho) {

            textoCabecalho.textContent =
                "🟢 Modo real — horários automáticos";
        }


        if (aviso) {

            aviso.innerHTML =
                "🟢 <strong>Modo real:</strong> entrada e saída são registradas automaticamente pelo horário do dispositivo.";

            aviso.style.color =
                "#15803d";
        }
    }


    // ========================================
    // MODO TESTE
    // ========================================

    else {

        if (entradaTeste) {
            entradaTeste.style.display =
                "";
        }


        if (saidaTeste) {
            saidaTeste.style.display =
                "";
        }


        if (btnAdicionar) {

            btnAdicionar.textContent =
                "🧪 Adicionar teste";
        }


        if (textoCabecalho) {

            textoCabecalho.textContent =
                "🧪 Modo teste — horários manuais";
        }


        if (aviso) {

            aviso.innerHTML =
                "🧪 <strong>Modo teste:</strong> informe entrada e saída manualmente para simular os cálculos.";

            aviso.style.color =
                "#7c3aed";
        }
    }
}


// ========================================
// EXIBIR DADOS DA PARTIDA
// ========================================

function exibirDadosPartida() {

    const valor =
        obterValorHora();

    const horarios =
        obterQuantidadeHorarios();

    const inicioPartida =
        criarDataDoHorario(
            obterHorarioInicio()
        );

    const fimPartida =
        obterFimPartida();


    if (valorHoraExibido) {

        valorHoraExibido.textContent =
            formatarDinheiro(valor);
    }


    if (horariosExibidos) {

        horariosExibidos.textContent =
            horarios;
    }


    if (horarioPartida) {

        horarioPartida.textContent =
            `${formatarHora(inicioPartida)} → ${formatarHora(fimPartida)}`;
    }


    if (custoTotalExibido) {

        custoTotalExibido.textContent =
            formatarDinheiro(
                valor * horarios
            );
    }
}


// ========================================
// ADICIONAR JOGADOR
// ========================================

function adicionarJogador() {

    if (partidaFinalizada) {
        return;
    }


    const nome =
        nomeJogador.value.trim();


    if (!nome) {

        alert(
            "Digite o nome do jogador."
        );

        return;
    }


    const modo =
        obterModoPartida();


    let entrada;
    let saida = null;


    // ========================================
    // MODO REAL
    // ========================================

    if (modo === "real") {

        entrada =
            new Date();

        saida =
            null;
    }


    // ========================================
    // MODO TESTE
    // ========================================

    else {

        if (
            entradaTeste &&
            entradaTeste.value
        ) {

            entrada =
                criarDataDoHorario(
                    entradaTeste.value
                );
        }

        else {

            entrada =
                new Date();
        }


        if (
            saidaTeste &&
            saidaTeste.value
        ) {

            saida =
                criarDataDoHorario(
                    saidaTeste.value
                );
        }
    }


    if (
        saida &&
        saida < entrada
    ) {

        alert(
            "A saída não pode ser anterior à entrada."
        );

        return;
    }


    const jogador = {

        id:
            Date.now() +
            Math.floor(
                Math.random() * 1000
            ),

        nome,

        entrada,

        saida
    };


    jogadores.push(jogador);

    salvarJogadores();


    nomeJogador.value =
        "";


    if (entradaTeste) {
        entradaTeste.value = "";
    }


    if (saidaTeste) {
        saidaTeste.value = "";
    }


    atualizarLista();

    nomeJogador.focus();


    if (modo === "real") {

        mostrarMensagemTemporaria(
            `${nome} entrou às ${formatarHora(entrada)}`
        );
    }
}


// ========================================
// REGISTRAR SAÍDA
// ========================================

function registrarSaida(id) {

    if (partidaFinalizada) {
        return;
    }


    const jogador =
        jogadores.find(
            item => item.id === id
        );


    if (
        !jogador ||
        jogador.saida
    ) {
        return;
    }


    jogador.saida =
        new Date();


    salvarJogadores();

    atualizarLista();


    mostrarMensagemTemporaria(
        `${jogador.nome} saiu às ${formatarHora(jogador.saida)}`
    );
}


// ========================================
// EDITAR JOGADOR
// ========================================

function editarJogador(id) {

    if (partidaFinalizada) {

        alert(
            "A partida já foi finalizada."
        );

        return;
    }


    const jogador =
        jogadores.find(
            item => item.id === id
        );


    if (!jogador) {
        return;
    }


    const novoNome =
        prompt(
            "Nome do jogador:",
            jogador.nome
        );


    if (novoNome === null) {
        return;
    }


    const nomeLimpo =
        novoNome.trim();


    if (!nomeLimpo) {

        alert(
            "O nome não pode ficar vazio."
        );

        return;
    }


    const novaEntrada =
        prompt(
            `Entrada de ${nomeLimpo}:`,
            formatarHora(jogador.entrada)
        );


    if (novaEntrada === null) {
        return;
    }


    if (
        !validarHorario(
            novaEntrada
        )
    ) {

        alert(
            "Use o formato HH:MM."
        );

        return;
    }


    const novaSaida =
        prompt(
            `Saída de ${nomeLimpo}.\nDeixe vazio se ainda estiver jogando:`,
            jogador.saida
                ? formatarHora(
                    jogador.saida
                )
                : ""
        );


    if (novaSaida === null) {
        return;
    }


    if (
        novaSaida !== "" &&
        !validarHorario(
            novaSaida
        )
    ) {

        alert(
            "Use o formato HH:MM."
        );

        return;
    }


    const entrada =
        criarDataDoHorario(
            novaEntrada
        );


    const saida =
        novaSaida === ""
            ? null
            : criarDataDoHorario(
                novaSaida
            );


    if (
        saida &&
        saida < entrada
    ) {

        alert(
            "A saída não pode ser anterior à entrada."
        );

        return;
    }


    jogador.nome =
        nomeLimpo;

    jogador.entrada =
        entrada;

    jogador.saida =
        saida;


    salvarJogadores();

    atualizarLista();
}


// ========================================
// EXCLUIR JOGADOR
// ========================================

function excluirJogador(id) {

    if (partidaFinalizada) {

        alert(
            "A partida já foi finalizada."
        );

        return;
    }


    const jogador =
        jogadores.find(
            item => item.id === id
        );


    if (!jogador) {
        return;
    }


    const confirmar =
        confirm(
            `Excluir ${jogador.nome}?`
        );


    if (!confirmar) {
        return;
    }


    jogadores =
        jogadores.filter(
            item =>
                item.id !== id
        );


    salvarJogadores();

    atualizarLista();
}


// ========================================
// FINALIZAR PARTIDA
// ========================================

function finalizarPartida() {

    if (partidaFinalizada) {
        return;
    }


    if (
        jogadores.length === 0
    ) {

        alert(
            "Adicione pelo menos um jogador."
        );

        return;
    }


    const confirmar =
        confirm(
            "Deseja finalizar a partida?\n\nDepois disso os valores ficarão congelados."
        );


    if (!confirmar) {
        return;
    }


    const fimPartida =
        obterFimPartida();


    // Quem ainda estiver jogando
    // é considerado até o final oficial.

    jogadores.forEach(
        function(jogador) {

            if (!jogador.saida) {

                jogador.saida =
                    new Date(
                        fimPartida
                    );
            }
        }
    );


    salvarJogadores();


    const calculo =
        calcularDistribuicao();


    valoresFinais =
        ajustarCentavos(
            calculo
        );


    localStorage.setItem(
        "valoresFinais",
        JSON.stringify(
            valoresFinais
        )
    );


    localStorage.setItem(
        "partidaFinalizada",
        "true"
    );


    partidaFinalizada =
        true;


    // Salva uma cópia definitiva
    // da partida no histórico.

    salvarPartidaNoHistorico();


    atualizarLista();

    atualizarEstadoInterface();


    alert(
        "Partida finalizada com sucesso! 🏐"
    );
}


// ========================================
// AJUSTAR CENTAVOS
// ========================================

function ajustarCentavos(calculo) {

    const valores = {};


    jogadores.forEach(
        function(jogador) {

            const valor =
                calculo.valores[
                    jogador.id
                ] || 0;


            valores[
                jogador.id
            ] =
                Math.round(
                    valor * 100
                ) / 100;
        }
    );


    let total =
        Object.values(
            valores
        ).reduce(
            (soma, valor) =>
                soma + valor,
            0
        );


    total =
        Math.round(
            total * 100
        ) / 100;


    const alvo =
        Math.round(
            (
                calculo.custoArena -
                calculo.valorAindaNaoDistribuido
            )
            * 100
        ) / 100;


    let diferenca =
        Math.round(
            (
                alvo -
                total
            ) * 100
        );


    if (
        diferenca !== 0 &&
        jogadores.length > 0
    ) {

        const fim =
            obterFimPartida();


        const elegiveis =
            jogadores.filter(
                jogador =>
                    jogador.saida &&
                    jogador.saida >= fim
            );


        const lista =
            elegiveis.length > 0
                ? elegiveis
                : jogadores;


        let indice =
            0;


        while (
            diferenca !== 0
        ) {

            const jogador =
                lista[
                    indice %
                    lista.length
                ];


            valores[
                jogador.id
            ] +=
                diferenca > 0
                    ? 0.01
                    : -0.01;


            valores[
                jogador.id
            ] =
                Math.round(
                    valores[
                        jogador.id
                    ] * 100
                ) / 100;


            diferenca +=
                diferenca > 0
                    ? -1
                    : 1;


            indice++;
        }
    }


    return valores;
}


// ========================================
// CÁLCULO DA DISTRIBUIÇÃO
// ========================================

function calcularDistribuicao() {

    const resultado = {

        valores: {},

        minutosCobrados: {},

        custoArena: 0,

        totalDistribuido: 0,

        redistribuidoSaidas: 0,

        diferencaAtrasos: 0,

        valorAindaNaoDistribuido: 0
    };


    const quantidade = jogadores.length;


    if (
        quantidade === 0
    ) {
        return resultado;
    }


    const valorArenaHora =
        obterValorHora();


    const quantidadeHorarios =
        obterQuantidadeHorarios();


    const inicioPartida =
        criarDataDoHorario(
            obterHorarioInicio()
        );


    const fimPartida =
        obterFimPartida();


    const custoArena =
        valorArenaHora *
        quantidadeHorarios;


    resultado.custoArena =
        custoArena;


    const duracaoTotalMinutos =
        quantidadeHorarios *
        60;


    // ========================================
    // INTERVALOS DE COBRANÇA
    // ========================================

    jogadores.forEach(
        function(jogador) {

            const atraso =
                Math.max(
                    0,
                    diferencaMinutos(
                        inicioPartida,
                        jogador.entrada
                    )
                );


            let inicioCobranca;


            // Até 30 minutos de atraso:
            // assume o horário desde o início.

            if (
                atraso <=
                TOLERANCIA_ATRASO_MINUTOS
            ) {

                inicioCobranca =
                    inicioPartida;
            }


            // Acima de 30 minutos:
            // começa a cobrança na chegada.

            else {

                inicioCobranca =
                    jogador.entrada;
            }


            if (
                inicioCobranca >
                fimPartida
            ) {

                inicioCobranca =
                    fimPartida;
            }


            let fimParticipacao =
                jogador.saida
                    ? jogador.saida
                    : new Date();


            if (
                fimParticipacao >
                fimPartida
            ) {

                fimParticipacao =
                    fimPartida;
            }


            if (
                fimParticipacao <
                inicioCobranca
            ) {

                fimParticipacao =
                    inicioCobranca;
            }


            let minutos =
                diferencaMinutos(
                    inicioCobranca,
                    fimParticipacao
                );


            // Cobrança mínima de 1 hora

            minutos =
                Math.max(
                    MINIMO_COBRANCA_MINUTOS,
                    minutos
                );


            // Nunca ultrapassa a duração total.

            minutos =
                Math.min(
                    duracaoTotalMinutos,
                    minutos
                );


            resultado
                .minutosCobrados[
                    jogador.id
                ] =
                    minutos;


            const fimCobranca = new Date(
                Math.min(
                    fimPartida.getTime(),
                    inicioCobranca.getTime() + minutos * 60000
                )
            );


            resultado.valores[jogador.id] = 0;
            jogador._inicioCobranca = inicioCobranca;
            jogador._fimCobranca = fimCobranca;
        }
    );


    // ========================================
    // DIVISÃO POR PRESENÇA
    // ========================================

    const pontos = [
        inicioPartida.getTime(),
        fimPartida.getTime(),
        ...jogadores.flatMap(jogador => [
            jogador._inicioCobranca.getTime(),
            jogador._fimCobranca.getTime()
        ])
    ];


    const limites = [...new Set(pontos)]
        .filter(ponto =>
            ponto >= inicioPartida.getTime() &&
            ponto <= fimPartida.getTime()
        )
        .sort((a, b) => a - b);


    for (let indice = 0; indice < limites.length - 1; indice++) {
        const inicioTrecho = limites[indice];
        const fimTrecho = limites[indice + 1];


        const presentes = jogadores.filter(jogador =>
            jogador._inicioCobranca.getTime() <= inicioTrecho &&
            jogador._fimCobranca.getTime() >= fimTrecho
        );


        if (presentes.length === 0) {
            continue;
        }


        const minutosTrecho = (fimTrecho - inicioTrecho) / 60000;
        const valorPorJogador =
            valorArenaHora * (minutosTrecho / 60) /
            presentes.length;


        presentes.forEach(jogador =>
            resultado.valores[jogador.id] += valorPorJogador
        );
    }


    jogadores.forEach(function(jogador) {
        delete jogador._inicioCobranca;
        delete jogador._fimCobranca;
    });


    // ========================================
    // TOTAL DISTRIBUÍDO
    // ========================================

    resultado.totalDistribuido =
        Object.values(
            resultado.valores
        ).reduce(
            (soma, valor) =>
                soma + valor,
            0
        );


    resultado.valorAindaNaoDistribuido =
        Math.max(
            0,
            custoArena -
            resultado.totalDistribuido
        );


    return resultado;
}


// ========================================
// ATUALIZAR LISTA DE JOGADORES
// ========================================

function atualizarLista() {

    if (
        !listaJogadores ||
        !contadorJogadores
    ) {
        return;
    }


    contadorJogadores.textContent =
        jogadores.length === 1
            ? "1 jogador"
            : `${jogadores.length} jogadores`;


    if (
        jogadores.length === 0
    ) {

        listaJogadores.innerHTML = `

            <div class="sem-jogadores">

                <div>
                    🏐
                </div>

                <p>
                    Nenhum jogador adicionado.
                </p>

                <small>
                    Registre o primeiro jogador acima.
                </small>

            </div>
        `;

        return;
    }


    const calculo =
        calcularDistribuicao();


    const valoresExibidos =
        partidaFinalizada &&
        valoresFinais

            ? valoresFinais

            : ajustarCentavos(
                calculo
              );


    listaJogadores.innerHTML =
        "";


    jogadores.forEach(
        function(jogador) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "jogador";


            const valor =
                valoresExibidos[
                    jogador.id
                ] || 0;


            const minutos =
                calculo
                    .minutosCobrados[
                        jogador.id
                    ] || 0;


            div.innerHTML = `

                <div class="jogador-info">

                    <div class="jogador-nome">

                        ${escaparHTML(
                            jogador.nome
                        )}

                    </div>


                    <div class="jogador-horario">

                        Entrada:
                        ${formatarHora(
                            jogador.entrada
                        )}

                        ${
                            jogador.saida

                                ? `<br>Saída: ${formatarHora(
                                    jogador.saida
                                  )}`

                                : ""
                        }

                    </div>


                    <div class="${
                        jogador.saida
                            ? "status-saiu"
                            : "status-jogando"
                    }">

                        ${
                            jogador.saida
                                ? "● Saiu da arena"
                                : "● Jogando"
                        }

                    </div>


                    <div class="valor-jogador">

                        ${
                            partidaFinalizada
                                ? "Valor final:"

                                : jogador.saida
                                    ? "Valor a pagar:"

                                    : "Valor atual:"
                        }

                        ${formatarDinheiro(
                            valor
                        )}

                    </div>


                    <div class="jogador-horario">

                        Tempo cobrado:

                        ${formatarDuracao(
                            minutos
                        )}

                    </div>

                </div>


                ${
                    partidaFinalizada

                        ? ""

                        : `

                        <div class="acoes-jogador">

                            ${
                                !jogador.saida

                                    ? `

                                    <button
                                        class="btn-saida"
                                        onclick="registrarSaida(${jogador.id})"
                                    >
                                        Registrar saída
                                    </button>

                                    `

                                    : ""
                            }


                            <button
                                class="btn-editar"
                                onclick="editarJogador(${jogador.id})"
                            >
                                Editar
                            </button>


                            <button
                                class="btn-excluir"
                                onclick="excluirJogador(${jogador.id})"
                            >
                                Excluir
                            </button>

                        </div>
                        `
                }
            `;


            listaJogadores.appendChild(
                div
            );
        }
    );


    adicionarResumoFinanceiro(
        calculo,
        valoresExibidos
    );
}


// ========================================
// RESUMO FINANCEIRO
// ========================================

function adicionarResumoFinanceiro(
    calculo,
    valoresExibidos
) {

    const resumo =
        document.createElement(
            "div"
        );


    resumo.className =
        "resumo-financeiro";


    const totalExibido =
        Object.values(
            valoresExibidos
        ).reduce(
            (soma, valor) =>
                soma + valor,
            0
        );


    const diferenca =
        Math.max(
            0,
            calculo.custoArena -
            totalExibido
        );


    resumo.innerHTML = `

        <h3>

            ${
                partidaFinalizada
                    ? "Resumo final"
                    : "Resumo financeiro"
            }

        </h3>


        <div>

            <span>
                Custo da arena
            </span>

            <strong>

                ${formatarDinheiro(
                    calculo.custoArena
                )}

            </strong>

        </div>


        <div>

            <span>

                ${
                    partidaFinalizada
                        ? "Total dos jogadores"
                        : "Distribuído"
                }

            </span>

            <strong>

                ${formatarDinheiro(
                    totalExibido
                )}

            </strong>

        </div>


        <div>

            <span>

                ${
                    partidaFinalizada
                        ? "Diferença por atrasos"
                        : "Ainda não distribuído"
                }

            </span>

            <strong>

                ${formatarDinheiro(
                    diferenca
                )}

            </strong>

        </div>
    `;


    listaJogadores.appendChild(
        resumo
    );
}


// ========================================
// ESTADO DA INTERFACE
// ========================================

function atualizarEstadoInterface() {

    if (!btnFinalizar) {
        return;
    }


    if (partidaFinalizada) {

        btnFinalizar.style.display =
            "none";


        if (btnCopiar) {

            btnCopiar.style.display =
                "block";
        }


        if (areaAdicionar) {

            areaAdicionar.style.display =
                "none";
        }
    }

    else {

        btnFinalizar.style.display =
            "block";


        if (btnCopiar) {

            btnCopiar.style.display =
                "none";
        }


        if (areaAdicionar) {

            areaAdicionar.style.display =
                "block";
        }
    }
}


// ========================================
// COPIAR RESUMO DA PARTIDA ATUAL
// ========================================

async function copiarResumo() {

    if (
        !partidaFinalizada ||
        !valoresFinais
    ) {

        alert(
            "Finalize a partida primeiro."
        );

        return;
    }


    const calculo =
        calcularDistribuicao();


    let texto =
        "🏐 PONTO ARENA\n\n";


    jogadores.forEach(
        function(jogador) {

            const valor =
                valoresFinais[
                    jogador.id
                ] || 0;


            texto +=
                `${jogador.nome} — ${formatarDinheiro(valor)}\n`;
        }
    );


    const total =
        Object.values(
            valoresFinais
        ).reduce(
            (soma, valor) =>
                soma + valor,
            0
        );


    const diferenca =
        Math.max(
            0,
            calculo.custoArena -
            total
        );


    texto +=
        "\n💰 Total dos jogadores: " +
        formatarDinheiro(total);


    texto +=
        "\n⏰ Diferença por atrasos: " +
        formatarDinheiro(diferenca);


    texto +=
        "\n🏟️ Custo da arena: " +
        formatarDinheiro(
            calculo.custoArena
        );


    try {

        await navigator.clipboard
            .writeText(texto);


        alert(
            "Resumo copiado! Agora é só colar no WhatsApp. ✅"
        );
    }

    catch (erro) {

        prompt(
            "Copie o resumo abaixo:",
            texto
        );
    }
}


// ========================================
// NOVA PARTIDA
// ========================================

function novaPartida() {

    const confirmar =
        confirm(
            "Deseja iniciar uma nova partida?\n\nA partida finalizada continuará salva no histórico."
        );


    if (!confirmar) {
        return;
    }


    localStorage.removeItem(
        "jogadores"
    );

    localStorage.removeItem(
        "valoresFinais"
    );

    localStorage.removeItem(
        "partidaFinalizada"
    );

    localStorage.removeItem(
        "modoPartida"
    );


    localStorage.setItem(
        "partidaAtiva",
        "false"
    );


    window.location.href =
        "index.html";
}


// ========================================
// SALVAR PARTIDA NO HISTÓRICO
// ========================================

function salvarPartidaNoHistorico() {

    if (!valoresFinais) {
        return;
    }


    const calculo =
        calcularDistribuicao();


    const totalJogadores =
        Object.values(
            valoresFinais
        ).reduce(
            (soma, valor) =>
                soma + valor,
            0
        );


    const diferenca =
        Math.max(
            0,
            calculo.custoArena -
            totalJogadores
        );


    const agora =
        new Date();


    const partida = {

        id:
            Date.now(),

        data:
            agora.toISOString(),

        valorHora:
            obterValorHora(),

        quantidadeHorarios:
            obterQuantidadeHorarios(),

        horarioInicio:
            obterHorarioInicio(),

        horarioFim:
            formatarHora(
                obterFimPartida()
            ),

        custoArena:
            calculo.custoArena,

        totalJogadores:
            totalJogadores,

        diferencaAtrasos:
            diferenca,

        redistribuidoSaidas:
            calculo.redistribuidoSaidas,

        modo:
            obterModoPartida(),

        jogadores:
            jogadores.map(
                function(jogador) {

                    return {

                        nome:
                            jogador.nome,

                        entrada:
                            jogador.entrada.toISOString(),

                        saida:
                            jogador.saida
                                ? jogador.saida.toISOString()
                                : null,

                        valor:
                            valoresFinais[
                                jogador.id
                            ] || 0
                    };
                }
            )
    };


    // Evita salvar a mesma partida
    // duas vezes caso algo seja executado novamente.

    const jaExiste =
        historicoPartidas.some(
            function(item) {

                return (
                    item.data ===
                    partida.data
                );
            }
        );


    if (jaExiste) {
        return;
    }


    historicoPartidas.unshift(
        partida
    );


    localStorage.setItem(
        "historicoPartidas",
        JSON.stringify(
            historicoPartidas
        )
    );
}


// ========================================
// EXIBIR HISTÓRICO
// ========================================

function atualizarHistorico() {

    if (
        !listaHistorico ||
        !contadorHistorico
    ) {
        return;
    }


    contadorHistorico.textContent =
        historicoPartidas.length === 1
            ? "1 partida"
            : `${historicoPartidas.length} partidas`;


    if (
        historicoPartidas.length === 0
    ) {

        listaHistorico.innerHTML = `

            <div class="sem-jogadores">

                <div>
                    📚
                </div>

                <p>
                    Nenhuma partida salva.
                </p>

                <small>
                    As partidas finalizadas aparecerão aqui.
                </small>

            </div>
        `;

        return;
    }


    listaHistorico.innerHTML =
        "";


    historicoPartidas.forEach(
        function(partida) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "item-historico";


            const data =
                new Date(
                    partida.data
                );


            const dataFormatada =
                data.toLocaleDateString(
                    "pt-BR"
                );


            item.innerHTML = `

                <div class="historico-info">

                    <strong>
                        🏐 ${dataFormatada}
                    </strong>

                    <span>

                        ${partida.horarioInicio}
                        →
                        ${partida.horarioFim}

                    </span>

                    <span>

                        ${partida.jogadores.length}

                        ${
                            partida.jogadores.length === 1
                                ? "jogador"
                                : "jogadores"
                        }

                    </span>

                    <span>

                        Arena:
                        ${formatarDinheiro(
                            partida.custoArena
                        )}

                    </span>

                </div>


                <div class="historico-acoes">

                    <button
                        class="btn-editar"
                        onclick="verHistorico(${partida.id})"
                    >
                        Ver
                    </button>

                    <button
                        class="btn-excluir"
                        onclick="excluirHistorico(${partida.id})"
                    >
                        Excluir
                    </button>

                </div>
            `;


            listaHistorico.appendChild(
                item
            );
        }
    );
}


// ========================================
// VER HISTÓRICO
// ========================================

function verHistorico(id) {

    const partida =
        historicoPartidas.find(
            item =>
                item.id === id
        );


    if (!partida) {
        return;
    }


    const data =
        new Date(
            partida.data
        );


    const dataFormatada =
        data.toLocaleDateString(
            "pt-BR"
        );


    let texto =
        `🏐 PONTO ARENA\n\n`;


    texto +=
        `📅 ${dataFormatada}\n`;


    texto +=
        `⏰ ${partida.horarioInicio} → ${partida.horarioFim}\n\n`;


    partida.jogadores.forEach(
        function(jogador) {

            texto +=
                `${jogador.nome} — ${formatarDinheiro(jogador.valor)}\n`;
        }
    );


    texto +=
        "\n💰 Total dos jogadores: " +
        formatarDinheiro(
            partida.totalJogadores
        );


    texto +=
        "\n⏰ Diferença por atrasos: " +
        formatarDinheiro(
            partida.diferencaAtrasos
        );


    texto +=
        "\n🏟️ Custo da arena: " +
        formatarDinheiro(
            partida.custoArena
        );


    alert(texto);
}


// ========================================
// EXCLUIR HISTÓRICO
// ========================================

function excluirHistorico(id) {

    const partida =
        historicoPartidas.find(
            item =>
                item.id === id
        );


    if (!partida) {
        return;
    }


    const confirmar =
        confirm(
            "Deseja excluir esta partida do histórico?"
        );


    if (!confirmar) {
        return;
    }


    historicoPartidas =
        historicoPartidas.filter(
            partida =>
                partida.id !== id
        );


    localStorage.setItem(
        "historicoPartidas",
        JSON.stringify(
            historicoPartidas
        )
    );


    atualizarHistorico();
}


// ========================================
// MENSAGEM TEMPORÁRIA
// ========================================

function mostrarMensagemTemporaria(
    mensagem
) {

    const existente =
        document.getElementById(
            "mensagemTemporaria"
        );


    if (existente) {
        existente.remove();
    }


    const aviso =
        document.createElement(
            "div"
        );


    aviso.id =
        "mensagemTemporaria";


    aviso.textContent =
        "✅ " + mensagem;


    aviso.style.position =
        "fixed";

    aviso.style.left =
        "50%";

    aviso.style.bottom =
        "25px";

    aviso.style.transform =
        "translateX(-50%)";

    aviso.style.background =
        "#111827";

    aviso.style.color =
        "#ffffff";

    aviso.style.padding =
        "12px 18px";

    aviso.style.borderRadius =
        "12px";

    aviso.style.fontWeight =
        "bold";

    aviso.style.zIndex =
        "9999";

    aviso.style.boxShadow =
        "0 5px 20px rgba(0,0,0,0.20)";


    document.body.appendChild(
        aviso
    );


    setTimeout(
        function() {

            aviso.remove();

        },
        2500
    );
}


// ========================================
// CONFIGURAÇÕES SALVAS
// ========================================

function obterValorHora() {

    return (
        Number(
            localStorage.getItem(
                "valorHora"
            )
        ) || 0
    );
}


function obterQuantidadeHorarios() {

    return (
        Number(
            localStorage.getItem(
                "quantidadeHorarios"
            )
        ) || 0
    );
}


function obterHorarioInicio() {

    return (
        localStorage.getItem(
            "horarioInicio"
        ) || "20:00"
    );
}


function obterModoPartida() {

    return (
        localStorage.getItem(
            "modoPartida"
        ) || "real"
    );
}


// ========================================
// DATAS
// ========================================

function criarDataDoHorario(
    horario
) {

    const [hora, minuto] =
        horario
            .split(":")
            .map(Number);


    const data =
        new Date();


    data.setHours(
        hora,
        minuto,
        0,
        0
    );


    return data;
}


function obterFimPartida() {

    const inicio =
        criarDataDoHorario(
            obterHorarioInicio()
        );


    const fim =
        new Date(inicio);


    fim.setMinutes(
        fim.getMinutes() +
        obterQuantidadeHorarios() *
        60
    );


    return fim;
}


// ========================================
// UTILITÁRIOS
// ========================================

function diferencaMinutos(
    inicio,
    fim
) {

    return Math.max(
        0,
        (fim - inicio) /
        60000
    );
}


function formatarDuracao(
    minutos
) {

    minutos =
        Math.round(minutos);


    const horas =
        Math.floor(
            minutos / 60
        );


    const resto =
        minutos % 60;


    if (horas === 0) {

        return `${resto} min`;
    }


    if (resto === 0) {

        return `${horas}h`;
    }


    return `${horas}h ${resto}min`;
}


function validarHorario(
    horario
) {

    return /^([01]\d|2[0-3]):[0-5]\d$/.test(
        horario
    );
}


function formatarHora(
    data
) {

    return data.toLocaleTimeString(
        "pt-BR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


function formatarDinheiro(
    valor
) {

    const numero =
        Number(valor) || 0;


    return numero.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


function escaparHTML(
    texto
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        texto;


    return div.innerHTML;
}


// ========================================
// SALVAR JOGADORES
// ========================================

function salvarJogadores() {

    localStorage.setItem(
        "jogadores",
        JSON.stringify(
            jogadores
        )
    );
}
