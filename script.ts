import { AppRedeSocial } from './app';

let appRedeSocial: AppRedeSocial = new AppRedeSocial();

// Carregar os usuários do arquivo no início
appRedeSocial.carregarDadosDoArquivo();

// Exibir o menu interativo para o usuário
appRedeSocial.menu();

// Salvar os usuários no arquivo após o término
appRedeSocial.salvarDadosEmArquivo();
