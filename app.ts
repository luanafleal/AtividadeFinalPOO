import prompt from "prompt-sync";
import * as fs from "fs";
import { RedeSocial } from "./redeSocial";
import {
    Usuario,
    Publicacao,
    TipoInteracao,
    Interacao,
    PublicacaoAvancada,
} from "./modelos";
import { AplicacaoError } from "./excecoes";

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
        // ### para script.ts
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
                        // ### para script.ts
                        this.mostrarPublicacoesUsuario();
                        break;
                }
            } catch (e) {
                if (e instanceof AplicacaoError) {
                    console.log(e.message); // "Ocorreu um erro na aplicação!"
                } else {
                    console.log(
                        "Erro desconhecido. Contate o administrador",
                        e
                    );
                }
                this.imprimirPressionarEnter();
            }
        } while (op !== "0");
    }

    private listarOpcoes() {
        console.log("\n##### Menu - Rede Social #####\n");
        console.log("1 - Cadastrar Usuário");
        console.log("2 - Criar Publicação");
        console.log("3 - Listar Publicações");
        console.log("4 - Interagir com Publicação");
        console.log("5 - Listar Usuários");
        console.log("6 - Ver Publicações de um Usuário");
        console.log("0 - Sair");
    }

    // menu - opcao 1
    private cadastrarUsuario() {
        console.log("\n# Cadastrar Novo Usuario\n");

        let email = this._input("> Digite o email do usuário: ");
        let apelido = this._input("> Digite o apelido do usuário: ");
        let documento = this._input("> Digite o documento do usuário: ");

        let usuario = new Usuario(this._idUsuario++, email, apelido, documento);

        try {
            this._redeSocial.adicionarUsuario(usuario);
            console.log("\n# Usuário cadastrado com sucesso!");
        } catch (error) {
            // concertar isso aqui
            if (error instanceof AplicacaoError) {
                console.log(error.message);
            } else {
                console.log("Ocorreu um erro desconhecido.");
            }
        }
    }

    // menu - opcao 2
    private publicar() {
        console.log("\n# Publicar\n");
        let email = this._input("Digite o e-mail do usuário que está publicando: ");
        let conteudo = this._input("Digite o conteúdo da publicação: ");
        const tipoPublicacao = this._input("Tipo de Publicação (1 - Simples, 2 - Avançada): ");

        const usuario = this._redeSocial.consultarUsuarioPorEmail(email);

        if (!usuario) {
            console.log("Usuário não encontrado.");
            return;
        }

        if (tipoPublicacao === "1") {
            const publicacao = new Publicacao(this._idPublicacao++, usuario, conteudo, new Date());
            this._redeSocial.adicionarPublicacao(publicacao);
            console.log("\n# Publicação simples criada com sucesso!");
        } else if (tipoPublicacao === "2") {
            const publicacaoAvancada = new PublicacaoAvancada(
                this._idPublicacao++, usuario, conteudo, new Date()
            );
            this._redeSocial.adicionarPublicacao(publicacaoAvancada);
            console.log("\x1b[32m" + "\n# Publicação avançada criada com sucesso!" + "\x1b[0m");
        }
    }

    // menu - opcao 3
    private listarPublicacoes(solicitarEnter: boolean = true) {
        const publicacoes = this._redeSocial.listarPublicacoes();
        console.log("\nPublicações: ");
        publicacoes.forEach((pub) => {
            console.log(
                `ID: ${pub.id} - Usuário: ${pub
                    .usuario
                    .apelido} - Conteúdo: ${pub.conteudo} - Data: ${pub.dataHora}`
            );
        });

        if (solicitarEnter) {
            this.imprimirPressionarEnter();
        }
    }

    // menu - opcao 4
    private interagirComPublicacao() {
        console.log("\n# Interagir\n");
        const idPublicacao = this._input("Digite o ID da publicação: ");
        const emailUsuario = this._input("Digite o email do usuário que está interagindo: ");

        console.log("\nEscolha a interação:");
        console.log("1 - Curtir");
        console.log("2 - Não Curtir");
        console.log("3 - Riso");
        console.log("4 - Surpresa");

        // Obter a escolha do usuário
        const tipoInteracaoStr = this._input("Digite o número da interação: ");
        const tipoInteracaoNum = parseInt(tipoInteracaoStr, 10);

        // Converter o número para o tipo de interação
        const tipoInteracao = this.converterParaTipoInteracao(tipoInteracaoNum);

        if (tipoInteracao !== undefined) {
            try {
                const usuario = this._redeSocial.consultarUsuarioPorEmail(emailUsuario);
                if (usuario) {
                    this._redeSocial.reagirPublicacao(this._idInteracao, usuario, parseInt(idPublicacao), tipoInteracao);
                    console.log("Interação realizada com sucesso!");
                } else {
                    console.log("Usuário não encontrado.");
                }
            } catch (error) {
                if (error instanceof AplicacaoError) {
                    console.log(error.message);
                } else {
                    console.log("Ocorreu um erro desconhecido.");
                }
            }
        } else {
            console.log("Número de interação inválido.");
        }
    }

    private converterParaTipoInteracao(numero: number): TipoInteracao | undefined {
        // Verifica se o número é um valor válido do enum
        return Object.values(TipoInteracao).find(
            (value) => value === numero
        ) as TipoInteracao | undefined;
    }


    // menu - opcao 5
    private listarUsuarios() {
        console.log("\n# Listar Usuários\n");
        for (let usuario of this._redeSocial.usuarios) {
            console.log(`> Id: ${usuario.id} - Email: ${usuario.email} - Apelido: ${usuario.apelido} - Documento: ${usuario.documento}`);
        }

        this.imprimirPressionarEnter();
    }

    // menu - opcao 6
    private mostrarPublicacoesUsuario() {
        const emailUsuario = this._input("Digite o email do usuário: ");
        try {
            this._redeSocial.listarPublicacoesPorUsuario(emailUsuario); // Atualize para chamar a função correta
        } catch (error) {
            if (error instanceof AplicacaoError) {
                console.log(error.message);
            } else {
                console.log(
                    "Erro desconhecido. Contate o administrador",
                    error
                );
            }
        }
    }

    // Carregar Usuarios do arquivo (trazer para o programa ao iniciar os usuarios que já foram cadastrados)
    public carregarUsuariosDoArquivo() {
        const arquivo: string = fs.readFileSync(this.CAMINHO_ARQUIVO_USUARIOS, 'utf-8');
        const linhas: string[] = arquivo.split('\n');
        console.log(linhas);
        console.log("Iniciando leitura de Arquivo");


        for (let i: number = 0; i < linhas.length; i++) {
            let linhaUsuario: string[] = linhas[i].trim().split(",");
            // Verifica se a linha tem o número esperado de colunas
            if (linhaUsuario.length < 4) {
                
                console.warn(`Linha mal formatada: ${linhas[i]}`);
                continue; // Pular linha mal formatada
            }

            let usuario!: Usuario;
            const id = parseInt(linhaUsuario[0]);

            try {
                usuario = new Usuario(id, linhaUsuario[1], linhaUsuario[2], linhaUsuario[3]);

                if (id >= this._idUsuario) {
                    this._idUsuario = id + 1;
                }

                this._redeSocial.adicionarUsuario(usuario);

                console.log(`Usuario ${usuario.email} carregado!`);
            } catch (error) {
                if (error instanceof AplicacaoError) {
                    console.log(`Erro ao processar usuário na linha ${i + 1}: ${error.message}`);
                } else {
                    console.log("Erro desconhecido. Contate o administrador", error);
                }
            }
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
            console.log(`Linha Usuario: ${linhaPublicacao}`);
            console.log(`tamanhoLinha: ${linhaPublicacao.length}`);
            // Verifica se a linha tem o número esperado de colunas
            if (linhaPublicacao.length < 5) {
                console.warn(`Linha mal formatada: ${linhas[i]}`);
                continue; // Pular linha mal formatada
            }
        
            let publicacao!: Publicacao;
            const idPublicação = parseInt(linhaPublicacao[1]);

            try {
                const usuario: Usuario = this._redeSocial.consultarPorUsuarioId(parseInt(linhaPublicacao[1]));

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

            } catch (error) {
                if (error instanceof AplicacaoError) {
                    console.error(`Erro ao processar publicação na linha ${i + 1}: ${error.message}`);
                } else {
                    console.error("Erro desconhecido ao processar publicação. Contate o administrador.", error);
                }
            }
        }

        console.log("Fim do arquivo");
    }

    // #####! Carregar as interações (falta implementar)

    // public carregarInteracoes() {
    //     const arquivo: string = fs.readFileSync(this.CAMINHO_ARQUIVO_INTERACOES, 'utf-8');
    //     const linhas: string[] = arquivo.split('\n');
    //     console.log(linhas);
    //     console.log("Iniciando leitura de Arquivo");


    //     for (let i: number = 0; i < linhas.length; i++) {
    //         let linhaPublicacao: string[] = linhas[i].trim().split(",");
    //         console.log(`Linha Usuario: ${linhaPublicacao}`);
    //         console.log(`tamanhoLinha: ${linhaPublicacao.length}`);
    //         // Verifica se a linha tem o número esperado de colunas
    //         if (linhaPublicacao.length < 5) {
    //             console.warn(`Linha mal formatada: ${linhas[i]}`);
    //             continue; // Pular linha mal formatada
    //         }
        
    //         let interacao!: Interacao;
    //         const idPublicação = parseInt(linhaPublicacao[0]);

    //         try {
    //         const usuario: Usuario = this._redeSocial.consultarPorUsuarioId(parseInt(linhaPublicacao[1]));

    //             interacao = new Publicacao(idPublicação, usuario, linhaPublicacao[2], new Date(linhaPublicacao[3]));
    //             if (idPublicação >= this._idPublicacao) {
    //                 this._idPublicacao = idPublicação + 1;
    //             }

    //             this._redeSocial.adicionarPublicacao(interacao);

    //             console.log(`Publicaçao ${interacao.id} carregada!`);
    //         } catch (error) {
    //             if (error instanceof AplicacaoError) {
    //                 console.error(`Erro ao processar publicação na linha ${i + 1}: ${error.message}`);
    //             } else {
    //                 console.error("Erro desconhecido ao processar publicação. Contate o administrador.", error);
    //             }
    //         }
    //     }

    //     console.log("Fim do arquivo");
    // }

    // #####!!!!! quando tiver implementado, descomentar //this.carregarInteracoes();
    public carregarDadosDoArquivo() {
        this.carregarUsuariosDoArquivo();
        this.carregarPublicacoes();
        //this.carregarInteracoes();
    }

    // Salvar dados em arquivos (usuarios, publicacoes, interacoes);
    // Falta adicionar o salvar as interações
    public salvarUsuariosEmArquivo() {
        try {
            let dadosUsuarios = "";
            let dadosPublicacoes = "";
            this._redeSocial.usuarios.forEach((usuario) => {
                // Salvando os dados do usuário
                dadosUsuarios += `${usuario.id},${usuario.email},${usuario.apelido},${usuario.documento}\n`;

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
                            dadosPublicacoes += `Interacao,${interacao.id},${interacao.publicacao.id},${interacao.usuario.id},${interacao.tipoInteracao},${interacao.dataHora.toISOString()}\n`;
                        });
                    }
                });
            });
            fs.writeFileSync(this.CAMINHO_ARQUIVO_USUARIOS, dadosUsuarios.trim(), "utf-8");
            fs.writeFileSync(this.CAMINHO_ARQUIVO_PUBLICACOES, dadosPublicacoes.trim(), "utf-8");
            console.log("Dados salvos com sucesso!");
        } catch (error) {
            console.log("Erro ao salvar usuários e publicacoes no arquivo:");
        }
    }
    
    private imprimirPressionarEnter() {
        this._input("Pressione <enter>");
    }

}

export { AppRedeSocial };
