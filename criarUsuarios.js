const bcrypt = require('bcrypt');
const db = require('./banco.js');

async function criarUsuarios() {
    const usuarios = [
        { usuario: 'diego', senha: '1234' },
        { usuario: 'aluno', senha: 'senha' },
        { usuario: 'enzo', senha: '123456' }
    ];

    for (const u of usuarios) {
        const hash = await bcrypt.hash(u.senha, 10);
        db.prepare(
            `INSERT INTO usuarios (usuario, senha_hash) VALUES (?, ?)
             ON CONFLICT(usuario) DO UPDATE SET senha_hash = excluded.senha_hash`
        ).run(u.usuario, hash);
    }

    console.log('Usuarios criados com senha_hash.');
}

criarUsuarios();