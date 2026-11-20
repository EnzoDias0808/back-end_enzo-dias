const bcrypt = require('bcrypt');
const repository = require('../repositories/usuariosRepository.js');

async function login(usuario, senha) {
    if (typeof usuario !== 'string' || typeof senha !== 'string') {
        return { invalido: true };
    }

    const encontrado = repository.buscarPorUsuario(usuario);

    if (encontrado === undefined) {
        return { invalido: true };
    }

    const confere = await bcrypt.compare(senha, encontrado.senha_hash);

    if (!confere) {
        return { invalido: true };
    }

    return { usuario: { id: encontrado.id, usuario: encontrado.usuario } };
}

module.exports = { login };