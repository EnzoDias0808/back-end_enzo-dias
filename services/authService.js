const bcrypt = require('bcrypt');
const db = require('../banco.js');

async function autenticar(usuario, senha) {
    const u = db.prepare(
        'SELECT * FROM usuarios WHERE usuario = ?'
    ).get(usuario);

    if (u === undefined) {
        return false;
    }

    return await bcrypt.compare(senha, u.senha_hash);
}

module.exports = { autenticar };