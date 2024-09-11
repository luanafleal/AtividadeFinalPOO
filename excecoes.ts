class AplicacaoError extends Error {
    constructor(message: string) {
        super(message);
    }
}

// 2.b.i
class UsuarioJaCadastradoError extends AplicacaoError {
    constructor(message: string) {
        super(message);
        this.name = "UsuarioJaCadastradoError";
    }
}

class UsuarioNaoEncontradoPorIdError extends AplicacaoError {
    constructor(id: string) {
        super(`Usuário não encontrado com ID: ${id}`);
        this.name = "UsuarioNaoEncontradoPorIdError";
    }
}

// 2.b.ii
class PublicacaoJaCadastradaError extends AplicacaoError {
    constructor(message: string) {
        super(message);
        this.name = "PublicacaoJaCadastradaError";
    }
}

// Para consultarUsuario
class UsuarioNaoEncontradoError extends AplicacaoError {
    constructor(message: string) {
        super(message)
        this.name = "UsuarioNaoEncontradoError"
    }
}

class PublicacaoNaoEncontradaOuInvalidaError extends AplicacaoError {
    constructor(message: string) {
        super(message);
        this.name = "PublicacaoNaoEncontradaOuInvalidaError";
    }
}

// Para ReagirPublicacao
class UsuarioJaReagiuError extends AplicacaoError {
    constructor(message: string) {
        super(message);
        this.name = "UsuarioJaReagiuError";
    }
}

export {AplicacaoError, UsuarioJaCadastradoError, UsuarioNaoEncontradoPorIdError, PublicacaoJaCadastradaError, UsuarioNaoEncontradoError, PublicacaoNaoEncontradaOuInvalidaError, UsuarioJaReagiuError}