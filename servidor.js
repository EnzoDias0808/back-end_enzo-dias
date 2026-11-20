
const express = require('express');
const treinosController = require('./controllers/treinosController.js');
const authController = require('./controllers/authController.js');

const app = express();
app.use(express.json());

function exigirLogin(req, res, next) {
    const usuario = authController.usuarioDaRequisicao(req);

    if (usuario === null) {
        return res.status(401).json({
            erro: 'Faca login primeiro.'
        });
    }

    next();
}

app.get('/treinos', treinosController.listar);
app.get('/treinos/total', exigirLogin, treinosController.total);
app.get('/treinos/:id', treinosController.buscarUm);

app.post('/treinos', treinosController.criar);
app.put('/treinos/:id', treinosController.atualizar);
app.delete('/treinos/:id', treinosController.remover);

app.post('/login', authController.login);
app.get('/perfil', authController.perfil);
app.post('/logout', authController.logout);

const PORTA = 3000;

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
