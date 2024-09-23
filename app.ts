import prompt from "prompt-sync";
import * as fs from "fs";
import { RedeSocial } from "./redeSocial";
import {
    Usuario,
    Publicacao,
    TipoInteracao,
    Interacao,
    PublicacaoAvancada,
    EmojiInteracao,
} from "./modelos";
import { AplicacaoError } from "./excecoes";
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';
const BLUE = '\x1b[34m'

class AppRedeSocial {
    private _redeSocial: RedeSocial;
    private _idUsuario = 0;
    private _idPublicacao = 0;
    private _idInteracao = 0;
    private CAMINHO_ARQUIVO_USUARIOS = "./../usuarios.txt";
    private CAMINHO_ARQUIVO_PUBLICACOES = "./../publicacoes.txt"
    private CAMINHO_ARQUIVO_INTERACOES = "./../interacoes.txt"
    private _input: prompt.Prompt = prompt();

    constructor() {
        this._redeSocial = new RedeSocial();
        this._input = prompt();
    }
    
    menu() {

        let op: string = "";
        do {
            this.listarOpcoes();
            try {
                op = this._input("Digite uma opção: ");

                switch (op) {
                    case "1":
                        this.cadastrarUsuario();
                        break;
                    case "2":
                        this.publicar();
                        break;
                    case "3":
                        this.listarPublicacoes();
                        break;
                    case "4":
                        this.interagirComPublicacao();
                        break;
                    case "5":
                        this.listarUsuarios();
                        break;
                    case "6":
                        this.mostrarPublicacoesUsuario();
                        break;
                    case "7":
                        this.editarPublicacao();
                        break;
                    case "8":
                        this.alterarStatusUsuario();
                        break;
                    case "9":
                        this.transformarPublicacaoEmAvançada();
                        break;
                }
            } catch (e) {
                if (e instanceof AplicacaoError) {
                    console.log(e.message); // "Ocorreu um erro na aplicação!"
                } else {
                    console.log("Erro desconhecido. Contate o administrador", e);
                }
                this.imprimirPressionarEnter();
            }
            
        } while (op !== "0");
    }

    private listarOpcoes() {
        console.log("\n------ Menu - Rede Social ------");
        console.log("1️⃣  - 👤 Cadastrar Usuário");
        console.log("2️⃣  - 📝 Criar Publicação");
        console.log("3️⃣  - 📜 Listar Publicações");
        console.log("4️⃣  - 💬 Interagir com Publicação");
        console.log("5️⃣  - 👥 Listar Usuários");
        console.log("6️⃣  - 🔍 Ver Publicações de um Usuário");
        console.log("7️⃣  - ✏️ Editar Publicação");
        console.log("8️⃣  - 🔄 Ativar/Desativar Usuário");
        console.log("9️⃣  - 🔓 Liberar Interações");
        console.log("0️⃣  - 🚪 Sair");

    }

    // menu - opcao 1
    private cadastrarUsuario() {
        console.log("\n# 👤 Cadastrar Usuário\n");

        let email = this._input("> Digite o email do usuário: ");
        let apelido = this._input("> Digite o apelido do usuário: ");
        let documento = this._input("> Digite o documento do usuário: ");

        let usuario = new Usuario(this._idUsuario++, email, apelido, documento, true);

        this._redeSocial.adicionarUsuario(usuario);
        console.log("\n# 👤 Usuário cadastrado com sucesso!");
    }

    // menu - opcao 2
    private publicar() {
        console.log("\n# 📜 Publicar\n");
        let email = this._input("Digite o e-mail do usuário que está publicando: ");
        let conteudo = this._input("Digite o conteúdo da publicação: ");
        const tipoPublicacao = this._input("Tipo de Publicação (1 - Simples, 2 - Avançada): ");

        const usuario = this._redeSocial.consultarUsuarioPorEmail(email);

        if (!usuario) {
            console.log(" 👤 Usuário não encontrado.");
            return;
        }

        if (tipoPublicacao === "1") {
            const publicacao = new Publicacao(this._idPublicacao++, usuario, conteudo, new Date());
            this._redeSocial.adicionarPublicacao(publicacao);
            console.log("\n📜 Publicação simples criada com sucesso!");
        } else if (tipoPublicacao === "2") {
            const publicacaoAvancada = new PublicacaoAvancada(
                this._idPublicacao++, usuario, conteudo, new Date()
            );
            this._redeSocial.adicionarPublicacao(publicacaoAvancada);
            console.log("\x1b[32m" + "\n# 📜 Publicação avançada criada com sucesso!" + "\x1b[0m");
        }
    }

    // menu - opcao 3
    private listarPublicacoes() {
        const publicacoes = this._redeSocial.listarPublicacoes();
        console.log(`${BOLD}\n📜 PUBLICAÇÕES:\n${RESET}`);

        for(let publicacao of publicacoes) {
            this.imprimirPublicacao(publicacao);
            console.log("-".repeat(40));
        }

        this.imprimirPressionarEnter();

        const desejaInteragir = this._input("\n💌 Deseja interagir com alguma publicação? (S/N): ").toLowerCase();
        
        if (desejaInteragir === "s") {
            this.interagirComPublicacao();
        }
    }

    private imprimirPublicacao(publicacao: Publicacao) {
        console.log(`${BOLD}ID: ${publicacao.id}${RESET} - Usuário: ${BLUE}${publicacao.usuario.email}${RESET}`);
        console.log(`Conteúdo: ${BOLD}${publicacao.conteudo}${RESET}`);
        console.log("Data:", this.formatarDataHora(publicacao.dataHora));

        if(publicacao instanceof PublicacaoAvancada) {
            this.imprimirInteracoes(publicacao);
        }
    }

    private imprimirInteracoes(publicacao: PublicacaoAvancada) {
        // Exibir Interações
        if(publicacao.interacoes.length > 0) {
            const reacoes = publicacao.interacoes.map((interacao: Interacao) => interacao.tipoInteracao).sort();

            let cont = 0;
            let textoReacoes = '';

            for (let i = 0; i <= reacoes.length; i++) {
                if (i === 0 || reacoes[i] === reacoes[i - 1]) {
                    cont++;
                } else {
                    textoReacoes += `${EmojiInteracao[reacoes[i - 1]]} ${cont} `;
                    cont = 1;
                }
            }
            
            console.log(textoReacoes);

        } else {
            console.log("> Interações: Nenhuma")
        }
    }

    private listarPublicacoesAvancadas() {
        const publicacoes = this._redeSocial.listarPublicacoes();
        console.log(`${BOLD}💌 PUBLICAÇÕES AVANÇADAS:\n${RESET}`);
        for(let publicacao of publicacoes) {
            if(publicacao instanceof PublicacaoAvancada) {
                this.imprimirPublicacao(publicacao);
                console.log("-".repeat(40));
            }
        }
    }

    private listarPublicacoesSimples() {
        const publicacoes = this._redeSocial.listarPublicacoes();
        console.log(`${BOLD}✉️ PUBLICAÇÕES SIMPLES:\n${RESET}`);
        for (let publicacao of publicacoes) {
            if (!(publicacao instanceof PublicacaoAvancada)) {
                this.imprimirPublicacao(publicacao);
                console.log("-".repeat(40));
            }
        }
    }
    
    // menu - opcao 4
    private interagirComPublicacao() {
        console.log("\n💬  Interagir\n");
        this.listarPublicacoesAvancadas();
        const idPublicacao = this._input("Digite o ID da publicação: ");
        const emailUsuario = this._input("Digite o email do usuário que está interagindo: ");

        console.log("\nEscolha a interação:");
        console.log("1 - 👍 Curtir");
        console.log("2 - ❤️  Amei");
        console.log("3 - 😁 Riso");
        console.log("4 - 😯 Surpresa");

        // Obter a escolha do usuário
        const tipoInteracao = parseInt(this._input("Digite o número da interação: "));

        if (TipoInteracao[tipoInteracao] !== undefined) {
            const usuario = this._redeSocial.consultarUsuarioPorEmail(emailUsuario);
            this._redeSocial.reagirPublicacao(this._idInteracao++, usuario, parseInt(idPublicacao), tipoInteracao);
            console.log("\n😍 Interação realizada com sucesso!");
        } else {
            console.log("\n!!!! Número de interação inválido.");
        }
    }

    // menu - opcao 5
    private listarUsuarios() {
        console.log("\n👥 Listar Usuários\n");
        for (let usuario of this._redeSocial.usuarios) {
            console.log(`${usuario.ativo ? "✔️​  Ativo" : "❌​ Inativo"} - Id: ${usuario.id} - Email: ${usuario.email} - Apelido: ${usuario.apelido} - Documento: ${usuario.documento}`);
        }

        this.imprimirPressionarEnter();
    }

    // menu - opcao 6
    private mostrarPublicacoesUsuario() {
        const emailUsuario = this._input("Digite o email do usuário: ");
        this._redeSocial.listarPublicacoesPorUsuario(emailUsuario);
    }

    // menu - opcao 7
    private editarPublicacao() {
        console.log("\n✏️  Editar Publicação\n");
        const idPublicacao = parseInt(this._input("Digite o ID da publicação que deseja editar: "));
        const publicacao = this._redeSocial.consultarPublicacaoPorId(idPublicacao);

        const emailUsuario = this._input("Digite o email do usuário que deseja editar a publicação: ");
        const usuario = this._redeSocial.consultarUsuarioPorEmail(emailUsuario);

        const novoConteudo = this._input("Digite o novo conteúdo da publicação: ");
        this._redeSocial.editarPublicacao(publicacao, novoConteudo, usuario);

        console.log("\n✅ Publicação editada com sucesso!");
    }

    // menu - opcao 8
    private alterarStatusUsuario() {
        console.log("\n🔄 Ativar/Desativar Usuário\n");

        const emailUsuario = this._input("Digite o email do usuário que deseja alterar: ");
        const usuario = this._redeSocial.consultarUsuarioPorEmail(emailUsuario);

        this._redeSocial.alterarStatusUsuario(usuario);

        const novoStatus = usuario.ativo ? "ativo" : "inativo";

        console.log(`\n✅ O usuário agora está ${novoStatus}.`);
    }

    // menu - opção 9
    private transformarPublicacaoEmAvançada() {
        console.log("\n🔄 Transformar Publicação em Avançada\n");
        
       this.listarPublicacoesSimples();

        const idPublicacao = parseInt(this._input("Digite o ID da publicação que deseja transformar: "));

        this._redeSocial.transformarPublicacaoEmAvancada(idPublicacao);
        
        console.log("\n✅ Publicação transformada em avançada com sucesso!");

    }
    
    public carregarUsuarios() {
        const arquivo: string = fs.readFileSync(this.CAMINHO_ARQUIVO_USUARIOS, 'utf-8');
        const linhas: string[] = arquivo.split('\n');
        console.log(linhas);
        console.log("Iniciando leitura de Arquivo");


        for (let i: number = 0; i < linhas.length; i++) {
            let linhaUsuario: string[] = linhas[i].trim().split(",");
            // Verifica se a linha tem o número esperado de colunas
            if (linhaUsuario.length < 5) {
                
                console.warn(`Linha mal formatada: ${linhas[i]}`);
                continue; // Pular linha mal formatada
            }

            let usuario!: Usuario;
            const id = parseInt(linhaUsuario[0]);
            const ativo = linhaUsuario[4] == 'true'

            usuario = new Usuario(id, linhaUsuario[1], linhaUsuario[2], linhaUsuario[3], ativo);
            
            if (id >= this._idUsuario) {
                this._idUsuario = id + 1;
            }
            
            this._redeSocial.adicionarUsuario(usuario);
            console.log(`Usuario ${usuario.email} carregado!`);
        }
        
        console.log("Fim do arquivo");

    }

    // Carregar as Publicações
    public carregarPublicacoes() {
        const arquivo: string = fs.readFileSync(this.CAMINHO_ARQUIVO_PUBLICACOES, 'utf-8');
        const linhas: string[] = arquivo.split('\n');
        console.log(linhas);
        console.log("Iniciando leitura de Arquivo");


        for (let i: number = 0; i < linhas.length; i++) {
            let linhaPublicacao: string[] = linhas[i].trim().split(",");
            
            // Verifica se a linha tem o número esperado de colunas
            if (linhaPublicacao.length < 5) {
                console.warn(`Linha mal formatada: ${linhas[i]}`);
                continue; // Pular linha mal formatada
            }
        
            let publicacao!: Publicacao;
            const idPublicação = parseInt(linhaPublicacao[1]);

            const usuario: Usuario = this._redeSocial.consultarUsuarioPorId(parseInt(linhaPublicacao[1]));

            let tipo: string = linhaPublicacao[0];

            if ( tipo == 'PA') {
                publicacao = new PublicacaoAvancada(idPublicação, usuario, linhaPublicacao[3], new Date(linhaPublicacao[4]));
                
            } else {
                publicacao = new Publicacao(idPublicação, usuario, linhaPublicacao[3], new Date(linhaPublicacao[4]));
            }

            if (idPublicação >= this._idPublicacao) {
                this._idPublicacao = idPublicação + 1;
            }

            this._redeSocial.adicionarPublicacao(publicacao);

            console.log(`Publicaçao ${publicacao.id} carregada!`);
        }

        console.log("Fim do arquivo");
    }

    //  Carregar as interações
    public carregarInteracoes() {
        const arquivo: string = fs.readFileSync(this.CAMINHO_ARQUIVO_INTERACOES, 'utf-8');
        const linhas: string[] = arquivo.split('\n');
        console.log(linhas);
        console.log("Iniciando leitura de Arquivo Interação");

        for (let i: number = 0; i < linhas.length; i++) {
            let linhaInteracoes: string[] = linhas[i].trim().split(",");
            
            // Verifica se a linha tem o número esperado de colunas
            if (linhaInteracoes.length < 5) {
                console.warn(`Linha mal formatada: ${linhas[i]}`);
                continue; // Pular linha mal formatada
            }
        
            let interacao!: Interacao;
            
            const idInteracao = parseInt(linhaInteracoes[0]);

                
            const publicacao: PublicacaoAvancada = <PublicacaoAvancada> this._redeSocial.consultarPublicacaoPorId(parseInt(linhaInteracoes[1]));
            const tipoInteracao = parseInt(linhaInteracoes[2]);
            const usuario: Usuario = this._redeSocial.consultarUsuarioPorId(parseInt(linhaInteracoes[3]));

            interacao = new Interacao(idInteracao, publicacao, tipoInteracao, usuario, new Date(linhaInteracoes[4]));
                
            if (idInteracao >= this._idInteracao) {
                this._idInteracao = idInteracao + 1;
            }

            publicacao.adicionarInteracao(interacao);

            console.log(`Interação ${interacao.id} carregada!`);
        }

        console.log("Fim do arquivo");
    }

    public carregarDadosDoArquivo() {
        this.carregarUsuarios();
        this.carregarPublicacoes();
        this.carregarInteracoes();
    }

    // Salvar dados em arquivos (usuarios, publicacoes, interacoes);
    public salvarDadosEmArquivo() {
        let dadosUsuarios = "";
        let dadosPublicacoes = "";
        let dadosInteracoes = "";
        this._redeSocial.usuarios.forEach((usuario) => {
            // Salvando os dados do usuário
            dadosUsuarios += `${usuario.id},${usuario.email},${usuario.apelido},${usuario.documento},${usuario.ativo}\n`;

            // Salvando as publicações do usuário
            const publicacoes = this._redeSocial.listarPublicacoesPorUsuario(usuario.email, false); // Adicione false para não imprimir
            publicacoes.forEach((pub) => {
                let tipo = 'P';

                if (pub instanceof PublicacaoAvancada) {
                    tipo = 'PA';
                }

                dadosPublicacoes += `${tipo},${pub.id},${pub.usuario.id},${pub.conteudo},${pub.dataHora.toISOString()}\n`;

                // Se a publicação for avançada, salvar as interações
                if (pub instanceof PublicacaoAvancada) {
                    const interacoes = pub.interacoes;
                    interacoes.forEach((interacao) => {
                        dadosInteracoes += `${interacao.id},${interacao.publicacao.id},${interacao.tipoInteracao},${interacao.usuario.id},${interacao.dataHora.toISOString()}\n`;
                    });
                }
            });
        });
        fs.writeFileSync(this.CAMINHO_ARQUIVO_USUARIOS, dadosUsuarios.trim(), "utf-8");
        fs.writeFileSync(this.CAMINHO_ARQUIVO_PUBLICACOES, dadosPublicacoes.trim(), "utf-8");
        fs.writeFileSync(this.CAMINHO_ARQUIVO_INTERACOES, dadosInteracoes.trim(), "utf-8");
        console.log("Dados salvos com sucesso!");
    }

    private formatarDataHora(data: Date): string {
        const dataFormatada = data.toLocaleDateString('pt-BR');
        
        const horaFormatada = data.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `${dataFormatada} ${horaFormatada}`;
    }
    
    private imprimirPressionarEnter() {
        this._input("Pressione <enter>");
    }
}

export { AppRedeSocial };
