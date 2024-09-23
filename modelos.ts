// 1 - a
class Usuario {
    private _id: number;
    private _email: string;
    private _apelido: string;
    private _documento: string;
    private _ativo: boolean;

    constructor (id: number, email: string, apelido: string, documento: string, ativo: boolean) {
        this._id = id;
        this._email = email;
        this._apelido = apelido;
        this._documento = documento;
        this._ativo = ativo;
    }

    get id(): number {
        return this._id;
    }

    get email(): string {
        return this._email;
    }
    
    get apelido(): string {
        return this._apelido;
    }
    
    get documento(): string {
        return this._documento;
    }

    get ativo(): boolean {
        return this._ativo;
    }

    set ativo(status: boolean) {
        this._ativo = status;
    }
}

// 1 - b
class Publicacao {
    private _id: number;
    private _usuario: Usuario;
    private _conteudo: string;
    private _dataHora: Date;

    constructor (id: number, usuario: Usuario, conteudo: string, dataHora: Date) {
        this._id = id;
        this._usuario = usuario;
        this._conteudo = conteudo;
        this._dataHora = dataHora;
    }

    get id(): number {
        return this._id;
    }
    
    get usuario(): Usuario {
        return this._usuario;
    }
    
    get conteudo(): string {
        return this._conteudo;
    }
    
    get dataHora(): Date {
        return this._dataHora;
    }

    set conteudo(novoConteudo: string) {
        this._conteudo = novoConteudo;
    }
}

//1 - c
enum TipoInteracao {
    Curtir = 1,
    Amei = 2,
    Riso = 3,
    Suspresa = 4,
}

enum EmojiInteracao {
    "👍" = 1,
    "❤️ " = 2,
    "😁" = 3,
    "😮" = 4,
}


//  1 - d
class Interacao {
    private _id: number;
    private _publicacao: Publicacao;
    private _tipoInteracao: TipoInteracao;
    private _usuario: Usuario;
    private _dataHora: Date;

    constructor (id: number, publicacao: Publicacao, tipoInteracao: TipoInteracao, usuario: Usuario, dataHora: Date) {
        this._id = id;
        this._publicacao = publicacao;
        this._tipoInteracao = tipoInteracao;
        this._usuario = usuario;
        this._dataHora = dataHora;
    }

    get id(): number {
        return this._id;
    }

    get publicacao(): Publicacao {
        return this._publicacao;
    }
    
    get tipoInteracao(): TipoInteracao {
        return this._tipoInteracao;
    }
    
    get usuario(): Usuario {
        return this._usuario;
    }

    get dataHora(): Date {
        return this._dataHora;
    }
}

// 1 - e
class PublicacaoAvancada extends Publicacao {
    private _interacoes: Interacao[] = [];

    adicionarInteracao(interacao: Interacao): void {
        this._interacoes.push(interacao);
    }

    get interacoes(): Interacao[] {
        return this._interacoes;
    }
}

export {Usuario, Publicacao, TipoInteracao, EmojiInteracao, Interacao, PublicacaoAvancada}
