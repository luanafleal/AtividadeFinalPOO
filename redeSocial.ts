import { Usuario, Publicacao , PublicacaoAvancada, TipoInteracao, Interacao  } from "./modelos";
import { UsuarioJaCadastradoError, UsuarioNaoEncontradoPorIdError, UsuarioNaoEncontradoError, PublicacaoJaCadastradaError, PublicacaoNaoEncontradaOuInvalidaError , UsuarioJaReagiuError } from "./excecoes";

// 2. a 
class RedeSocial{
    private _usuarios: Usuario[] = [];
    private _publicacoes: Publicacao[] = [];

    // 2. a
    adicionarUsuario(usuario: Usuario): void{
        if(this._usuarios.some(u => u.getId() === usuario.getId() || u.getEmail() === usuario.getEmail())){
            throw new UsuarioJaCadastradoError("Usuário com o mesmo ID ou e-mail já cadastrado.");
        }
        
        this._usuarios.push(usuario);
    }

    //2. a
    consultarPorUsuarioId(id: string): Usuario {
        const usuario = this._usuarios.find(u => u.getId() === id);
        if (!usuario) {
            throw new UsuarioNaoEncontradoPorIdError(id);
        }
        return usuario;
    }

    // 2. a
    consultarUsuarioPorEmail(email: string): Usuario { 
        let usuarioProcurado!: Usuario;
        for (let i: number = 0; i < this._usuarios.length; i++) {
            if (this._usuarios[i].getEmail() == email) {
                usuarioProcurado = this._usuarios[i];
                break;
            }
        }
        if (usuarioProcurado == null) {
            throw new UsuarioNaoEncontradoError("Usuário não encontrado com e-mail: " + email);
        }
    
        return usuarioProcurado;
    }

    // 2. a
    adicionarPublicacao(publicacao: Publicacao): void {
        if(this._publicacoes.some(p => p.getId() === publicacao.getId())){
            throw new PublicacaoJaCadastradaError("Publicação com ID já cadastrado.");
        }
        
        this._publicacoes.push(publicacao);
    }

    consultarPublicacaoPorId(id: string): Publicacao | undefined {
        return this._publicacoes.find(p=>p.getId()=== id);
    }

    // c
    listarPublicacoes(): void {
       const publisOrdenadas = this._publicacoes.sort((a,b)=>
       b.getDataHora().getTime() - a.getDataHora().getTime());
       
       publisOrdenadas.forEach(pub=>{
        console.log(`Conteúdo: ${pub.getConteudo()}`);
        console.log(`Data da publicação: ${pub.getDataHora().toLocaleDateString}`);
        if (pub instanceof PublicacaoAvancada) {
            const reacoes = pub['_interacoes'].map((interacao: Interacao) => interacao.getTipoInteracao());
            console.log(`Reações: ${reacoes.join(", ")}`);
        }console.log("-".repeat(30));
       }
       );
    }

    // d
    listarPublicacoesPorUsuario(email: string): void {
        const usuario = this._usuarios.find(u => u.getEmail() === email);
        if (!usuario) {
            throw new UsuarioNaoEncontradoError("Usuário não encontrado.");
        }

        const publicacoesUsuario = this._publicacoes.filter(p => p.getUsuario().getEmail() === email);
        const publicacoesOrdenadas = publicacoesUsuario.sort((a, b) => b.getDataHora().getTime() - a.getDataHora().getTime());

        publicacoesOrdenadas.forEach(pub => {
            
            console.log(`Conteúdo: ${pub.getConteudo()}`);
            console.log(`Data de Publicação: ${pub.getDataHora().toLocaleString()}`);
            console.log(`Usuario: ${pub.getUsuario}`);
            
            if (pub instanceof PublicacaoAvancada) {
                const reacoes = pub['_interacoes'].map((interacao: Interacao) => interacao.getTipoInteracao());
                console.log(`Reações: ${reacoes.join(", ")}`);
            }
            
            console.log("-".repeat(30));
        });
    }
    // e
    reagirPublicacao(usuario: Usuario, publicacaoId: string, tipoReacao: TipoInteracao): void {
        const publicacao = this.consultarPublicacaoPorId(publicacaoId);
        if (publicacao instanceof PublicacaoAvancada) {
            if (publicacao['_interacoes'].some((interacao: Interacao) => interacao.getUsuario().getId() === usuario.getId())) {
                throw new UsuarioJaReagiuError("Usuário já reagiu a esta publicação.");
            }
            const novaInteracao = new Interacao(
                `${publicacao.getId()}-${usuario.getId()}`, 
                publicacao, 
                tipoReacao, 
                usuario, 
                new Date()
            );
            publicacao['_interacoes'].push(novaInteracao);
        } else {
            throw new PublicacaoNaoEncontradaOuInvalidaError("Publicação não encontrada ou não é uma publicação avançada.");
        }
    }
}
