const bcrypt = require('bcrypt');
const db = require('./banco.js');

db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario    TEXT UNIQUE NOT NULL,
        senha_hash TEXT NOT NULL
    )
`);

async function criarUsuarios() {
    const usuarios = [
        { usuario: 'enzo', senha: '123456' },
    ];

    for (const u of usuarios) {
        const hash = await bcrypt.hash(u.senha, 10);
        db.prepare(
            'INSERT OR REPLACE INTO usuarios (usuario, senha_hash) VALUES (?, ?)'
        ).run(u.usuario, hash);
    }

    console.log('Usuarios criados com senha_hash.');
}

criarUsuarios();