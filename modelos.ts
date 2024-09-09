// 1 - a
class Usuario {
    private _id: string;
    private _email: string;
    private _apelido: string;
    private _documento: string;

    constructor (id: string, email: string, apelido: string, documento: string) {
        this._id = id;
        this._email = email;
        this._apelido = apelido;
        this._documento = documento;
    }

    getId(): string {
        return this._id;
    }

    getEmail(): string {
        return this._email;
    }
    
    getApelido(): string {
        return this._apelido;
    }
    
    getDocumento(): string {
        return this._documento;
    }
}

// b
class Publicacao {
    private _id: string;
    private _usuario: Usuario;
    private _conteudo: string;
    private _dataHora: Date;

    constructor (id: string, usuario: Usuario, conteudo: string, dataHora: Date) {
        this._id = id;
        this._usuario = usuario;
        this._conteudo = conteudo;
        this._dataHora = dataHora;
    }

    getId(): string {
        return this._id;
    }
    
    getUsuario(): Usuario {
        return this._usuario;
    }
    
    getConteudo(): string {
        return this._conteudo;
    }
    
    getDataHora(): Date {
        return this._dataHora;
    }
}

// c
enum TipoInteracao {
    Curtir = 1,
    NaoCurtir = 2,
    Riso = 3,
    Suspresa = 4,
}

// d
class Interacao {
    private _id: string;
    private _publicacao: Publicacao;
    private _tipoInteracao: TipoInteracao;
    private _usuario: Usuario;
    private _dataHora: Date;

    constructor (id: string, publicacao: Publicacao, tipoInteracao: TipoInteracao, usuario: Usuario, dataHora: Date) {
        this._id = id;
        this._publicacao = publicacao;
        this._tipoInteracao = tipoInteracao;
        this._usuario = usuario;
        this._dataHora = dataHora;
    }

    getId(): string {
        return this._id;
    }

    getPublicacao(): Publicacao {
        return this._publicacao;
    }
    
    getTipoInteracao(): TipoInteracao {
        return this._tipoInteracao;
    }
    
    getUsuario(): Usuario {
        return this._usuario;
    }

    getDataHora(): Date {
        return this._dataHora;
    }
}

class PublicacaoAvancada extends Publicacao {
    private _interacoes: Interacao[] = [];
}

export {Usuario, Publicacao, TipoInteracao, Interacao, PublicacaoAvancada}