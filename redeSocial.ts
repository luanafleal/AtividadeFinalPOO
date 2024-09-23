import { Usuario, Publicacao , PublicacaoAvancada, TipoInteracao, Interacao } from "./modelos";
import {
    UsuarioJaCadastradoError, UsuarioNaoEncontradoPorIdError, UsuarioNaoEncontradoError,
    PublicacaoJaCadastradaError, PublicacaoNaoEncontradaOuInvalidaError , UsuarioJaReagiuError,
    UsuarioSemPermissaoError, PublicacaoJaEhAvancadaError, UsuarioInativoError
} from "./excecoes";
import { error } from "console";

// 2. a 
class RedeSocial{
    private _usuarios: Usuario[] = [];
    private _publicacoes: Publicacao[] = [];

    // 2. a - inclusão(usuários)
    adicionarUsuario(usuario: Usuario): void{
        // 2 - b.i
        if(this._usuarios.some(u => u.id === usuario.id || u.email === usuario.email)){
            throw new UsuarioJaCadastradoError("\n!!! Usuário com o mesmo ID ou e-mail já cadastrado.\n");
        }
        
        this._usuarios.push(usuario);
    }

    // 2. a - consulta(usuários) - por id
    consultarUsuarioPorId(id: number): Usuario {
        const usuario = this._usuarios.find(u => u.id === id);
        if (!usuario) {
            throw new UsuarioNaoEncontradoPorIdError(id);
        }

        return usuario;
    }

    // 2. a - consulta(usuários) - por email
    consultarUsuarioPorEmail(email: string): Usuario { 
        let usuarioProcurado!: Usuario;
        for (let i: number = 0; i < this._usuarios.length; i++) {
            if (this._usuarios[i].email == email) {
                usuarioProcurado = this._usuarios[i];
                break;
            }
        }
        
        if (usuarioProcurado == null) {
            throw new UsuarioNaoEncontradoError(`\n!!! Usuário não encontrado com e-mail: ${email}\n`);
        }
    
        return usuarioProcurado;
    }

    // 2. a - inclusão(publicação)
    adicionarPublicacao(publicacao: Publicacao, carregandoArquivo = false): void {
        // 2 - b.
        if (!publicacao.usuario.ativo && !carregandoArquivo) {
            throw new UsuarioInativoError(`\n!!! Usuario está inativo: ${publicacao.usuario.email}\n`);
        }

        if(this._publicacoes.some(p => p.id === publicacao.id)){
            throw new PublicacaoJaCadastradaError("\n!!! Publicação com ID já cadastrado.\n");
        }
        
        this._publicacoes.push(publicacao);
    }

    // 2 - a - consulta(publicação por id)
    consultarPublicacaoPorId(id: number): Publicacao {
        let publicacaoProcurada!: Publicacao;
        for (let i: number = 0; i < this._publicacoes.length; i++) {
            if (this._publicacoes[i].id == id) {
                publicacaoProcurada = this._publicacoes[i];
                break;
            }
        }

        if (publicacaoProcurada == null) {
            throw new PublicacaoNaoEncontradaOuInvalidaError(`\n!!! Publicação NÃO Encontrada: ${id}\n`);
        }

        return publicacaoProcurada;
    }

    // 2 - a - consulta(publicação por indice)
    consultarPublicacaoPorIndice(numero: number): number {
        let indiceProcurado: number = -1;
        for (let i: number = 0; i < this._publicacoes.length; i++) {
            if (this._publicacoes[i].id == numero) {
                indiceProcurado = i;
                break;
            }
        }

        if (indiceProcurado == -1) {
            throw new PublicacaoNaoEncontradaOuInvalidaError(`\n!!! Publicação NÃO encontrada: ${numero}\n`);
        }

        return indiceProcurado;
    }

    // 2 - c
    listarPublicacoes(): Publicacao[] {
        const publisOrdenadas = this._publicacoes.sort((a, b) =>
            b.dataHora.getTime() - a.dataHora.getTime()
        );

        return publisOrdenadas;
    }
    
    //2 - d
    listarPublicacoesPorUsuario(email: string, exibir: boolean = true): Publicacao[] {
        const usuario = this.consultarUsuarioPorEmail(email);
        
        const publicacoesUsuario = this._publicacoes.filter(p => p.usuario.id === usuario.id);
        const publicacoesOrdenadas = publicacoesUsuario.sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());

        if (exibir) {
            publicacoesOrdenadas.forEach(pub => {
                console.log(`\nId Publicação: ${pub.id}`);
                console.log(`Conteúdo: ${pub.conteudo}`);
                console.log(`Data de Publicação: ${pub.dataHora.toLocaleString()}`);
                console.log(`Apelido: ${pub.usuario.apelido}`);
                
                if (pub instanceof PublicacaoAvancada) {
                    const reacoes = pub['_interacoes'].map((interacao: Interacao) => interacao.tipoInteracao);
                    console.log(`Reações: ${reacoes.join(", ")}`);
                }
                
                console.log("-".repeat(30));
            });
        }

        return publicacoesOrdenadas;
    }

    // 2 - e
    reagirPublicacao(idInteracao: number, usuario: Usuario, publicacaoId: number, tipoReacao: TipoInteracao): void {
        const publicacao = this.consultarPublicacaoPorId(publicacaoId);
        if (publicacao instanceof PublicacaoAvancada) {
            if (!usuario.ativo) {
                throw new UsuarioInativoError(`\n!!! Usuario está inativo: ${usuario.email}\n`);
            }

            if (publicacao.interacoes.some((interacao: Interacao) => interacao.usuario.id === usuario.id)) {
                throw new UsuarioJaReagiuError("\n!!! Usuário já reagiu a esta publicação.\n");
            }
            const novaInteracao = new Interacao(
                idInteracao,
                publicacao, 
                tipoReacao, 
                usuario, 
                new Date()
            );
            publicacao.adicionarInteracao(novaInteracao);
        } else {
            throw new PublicacaoNaoEncontradaOuInvalidaError("\x1b[31m" + "\n !!! Publicação não encontrada ou não é uma publicação avançada."  + "\x1b[0m");
        }
    }

    // 3
    editarPublicacao(publicacao: Publicacao, novoConteudo: string, usuario: Usuario): void {
        if (!usuario.ativo) {
            throw new UsuarioInativoError(`\n!!! Usuario está inativo: ${usuario.email}\n`);
        }
        if (publicacao.usuario.email !== usuario.email) {
            throw new UsuarioSemPermissaoError("\n!!! Erro: Usuário não tem permissão para editar esta publicação.\n");
        }

        // Utiliza o método para alterar o conteúdo
        publicacao.conteudo = novoConteudo;
    }

    // 3
    transformarPublicacaoEmAvancada(publicacaoId: number): void {
        const publicacao = this.consultarPublicacaoPorId(publicacaoId);

        // Verificar se a publicação já é avançada
        if (publicacao instanceof PublicacaoAvancada) {
            throw new PublicacaoJaEhAvancadaError("\x1b[31m" + "\n !!! A publicação já é avançada." + "\x1b[0m");
        }

        // Criar uma nova publicação avançada com os mesmos dados
        const publicacaoAvancada = new PublicacaoAvancada(publicacao.id, publicacao.usuario, publicacao.conteudo, publicacao.dataHora);

        // alterarPorIndice
        let indice = this.consultarPublicacaoPorIndice(publicacaoId);

        if (indice != -1) {
            this._publicacoes[indice] = publicacaoAvancada;
        }
    }

    // 3
    excluirPublicacao(publicacao: Publicacao, idUsuario: number): void {
        // Verifica se o usuário que está tentando excluir é o autor da publicação
        if (publicacao.usuario.id !== idUsuario) {
            throw new UsuarioSemPermissaoError("\n!!! Ação não permitida. Apenas o autor pode excluir a publicação.\n");
        }

        this._publicacoes = this._publicacoes.filter(p => p.id !== publicacao.id);
    }

    // 3
    alterarStatusUsuario(usuario: Usuario): void {
        usuario.ativo = !usuario.ativo;
    }

    // Getters
    get usuarios(): Usuario[] {
        return this._usuarios;
    }

    get publicacoes(): Publicacao[] {
        return this._publicacoes;
    }
}

export {RedeSocial};