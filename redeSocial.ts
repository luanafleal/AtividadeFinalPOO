import { Usuario, Publicacao , PublicacaoAvancada, TipoInteracao, Interacao, EmojiInteracao  } from "./modelos";
import { UsuarioJaCadastradoError, UsuarioNaoEncontradoPorIdError, UsuarioNaoEncontradoError, PublicacaoJaCadastradaError, IdPublicacaoNaoEncontradoError, PublicacaoNaoEncontradaOuInvalidaError , UsuarioJaReagiuError } from "./excecoes";

// 2. a 
class RedeSocial{
    private _usuarios: Usuario[] = [];
    private _publicacoes: Publicacao[] = [];

    // 2. a - inclusão(usuários)
    adicionarUsuario(usuario: Usuario): void{
        // 2 - b.i
        if(this._usuarios.some(u => u.id === usuario.id || u.email === usuario.email)){
            throw new UsuarioJaCadastradoError("Usuário com o mesmo ID ou e-mail já cadastrado.");
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
            throw new UsuarioNaoEncontradoError("Usuário não encontrado com e-mail: " + email);
        }
    
        return usuarioProcurado;
    }

    // 2. a - inclusão(publicação)
    adicionarPublicacao(publicacao: Publicacao): void {
        // 2 - b.i
        if(this._publicacoes.some(p => p.id === publicacao.id)){
            throw new PublicacaoJaCadastradaError("Publicação com ID já cadastrado.");
        }
        
        this._publicacoes.push(publicacao);
    }

    // 2 - a - consulta(publicação)
    consultarPublicacaoPorId(id: number): Publicacao {
        let publicacaoProcurada!: Publicacao;
        for (let i: number = 0; i < this._publicacoes.length; i++) {
            if (this._publicacoes[i].id == id) {
                publicacaoProcurada = this._publicacoes[i];
                break;
            }
        }

        if (publicacaoProcurada == null) {
            throw new PublicacaoNaoEncontradaOuInvalidaError('\n!!! Publicação NÃO Encontrada: ' + id);
        }

        return publicacaoProcurada;
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
        const usuario = this._usuarios.find(u => u.email === email);
        if (!usuario) {
            throw new UsuarioNaoEncontradoError("Usuário não encontrado.");
        }

        const publicacoesUsuario = this._publicacoes.filter(p => p.usuario.email === email);
        const publicacoesOrdenadas = publicacoesUsuario.sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());

        if (exibir) {
            publicacoesOrdenadas.forEach(pub => {
                console.log(`\nId Publicação: ${pub.id}`);
                console.log(`Conteúdo: ${pub.conteudo}`);
                console.log(`Data de Publicação: ${pub.dataHora.toLocaleString()}`);
                console.log(`Usuario: ${pub.usuario.apelido}`);
                
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
            if (publicacao.interacoes.some((interacao: Interacao) => interacao.usuario.id === usuario.id)) {
                throw new UsuarioJaReagiuError("Usuário já reagiu a esta publicação.");
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

    // Getters
    get usuarios(): Usuario[] {
        return this._usuarios;
    }
}

export {RedeSocial};