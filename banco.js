const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcrypt');

const db = new DatabaseSync('treinos.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS treinos (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        nome    TEXT    NOT NULL,
        duracao INTEGER NOT NULL
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario    TEXT NOT NULL UNIQUE,
        senha_hash TEXT NOT NULL
    )
`);

// dois usuarios de teste (so cria se ainda nao existirem)
const seeds = [
    { usuario: 'diego', senha: '1234' },
    { usuario: 'aluno', senha: 'senha' }
];

for (const s of seeds) {
    const existe = db.prepare('SELECT id FROM usuarios WHERE usuario = ?').get(s.usuario);
    if (existe === undefined) {
        db.prepare('INSERT INTO usuarios (usuario, senha_hash) VALUES (?, ?)')
            .run(s.usuario, bcrypt.hashSync(s.senha, 10));
    }
}

module.exports = db;