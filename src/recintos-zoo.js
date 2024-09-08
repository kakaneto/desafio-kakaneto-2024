class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3, tamanho: 1 }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1, tamanho: 2 }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1, tamanho: 3 }] },
        ];

        this.animaisValidos = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false },
        };
    }

    analisaRecintos(animal, quantidade) {
        // verifica se o animal é válido
        if (!this.animaisValidos[animal]) {
            return { erro: "Animal inválido" };
        }

        // verifica se a quantidade é válida
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const { tamanho, biomas, carnivoro } = this.animaisValidos[animal];
        const recintosViaveis = [];

        for (const recinto of this.recintos) {
            let espacoOcupado = 0;
            let especiesNoRecinto = new Set();
            let macacoNoRecinto = false;
            let carnivoroNoRecinto = false;

            // verifica se o bioma do recinto é compatível com o animal
            if (!biomas.includes(recinto.bioma) && !(animal === 'HIPOPOTAMO' && recinto.bioma === 'savana e rio')) {
                continue;
            }

            // cacula o espaço ocupado pelos animais existentes no recinto
            for (const existente of recinto.animais) {
                espacoOcupado += existente.quantidade * existente.tamanho;
                especiesNoRecinto.add(existente.especie);

                if (existente.especie === 'MACACO') {
                    macacoNoRecinto = true;
                }

                // verifica se existem carnívoros no recinto
                if (this.animaisValidos[existente.especie].carnivoro) {
                    carnivoroNoRecinto = true;
                }

                // nao deixa que carnívoros sejam colocados com outras espécies
                if (carnivoro && existente.especie !== animal) {
                    espacoOcupado = recinto.tamanho + 1; // Invalida o recinto
                }

                // nao deixa que masqueicos sejam colocados com carnívoros
                if (!carnivoro && carnivoroNoRecinto) {
                    espacoOcupado = recinto.tamanho + 1; // Invalida o recinto
                }
            }

            // calcula o espaço necessário para os novos animais
            let espacoNecessario = tamanho * quantidade;

            // adiciona um espaço extra se existe mais de uma espécie no recinto
            if (especiesNoRecinto.size > 0 && !especiesNoRecinto.has(animal)) {
                espacoNecessario += 1;
            }

            // nao deixa que masqueicos sejam colocados sozinhos em recintos vazios
            if (animal === 'MACACO' && quantidade === 1 && !macacoNoRecinto && recinto.animais.length === 0) {
                espacoOcupado = recinto.tamanho + 1; // Invalida o recinto
            }

            // adiciona o recinto a lista de viáveis se o espaço necessário couber
            if (espacoOcupado + espacoNecessario <= recinto.tamanho) {
                recintosViaveis.push({
                    numero: recinto.numero,
                    espacoLivre: recinto.tamanho - (espacoOcupado + espacoNecessario),
                    total: recinto.tamanho
                });
            }
        }

        // se nenhum recinto viável seja encontrado
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        // ordena os recintos pelo número antes de gerar o output
        recintosViaveis.sort((a, b) => a.numero - b.numero);

        return {
            recintosViaveis: recintosViaveis.map(
                r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.total})`
            )
        };
    }
}

export { RecintosZoo as RecintosZoo };
