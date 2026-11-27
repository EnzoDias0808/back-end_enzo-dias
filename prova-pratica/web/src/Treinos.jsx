import { useEffect, useState } from 'react';
import { chamar, mensagemDeErro } from './api.js';
import CartaoTreino from './CartaoTreino.jsx';

export default function Treinos({ onSessaoExpirada }) {
  const [treinos, setTreinos] = useState([]);
  const [total, setTotal] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [nome, setNome] = useState('');
  const [duracao, setDuracao] = useState('');

  async function carregar() {
    try {
      const lista = await chamar('GET', '/treinos');
      if (lista.status === 200) {
        setTreinos(lista.dados);
      } else {
        setErro(mensagemDeErro(lista, 'GET /treinos'));
      }

      const t = await chamar('GET', '/treinos/total');
      setTotal(t.status === 200 && t.json ? t.dados.total : null);
    } catch {
      setErro('Não consegui falar com a API.');
    }
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  function conferir(r, rota) {
    if (r.status === 401) {
      onSessaoExpirada();
      return false;
    }
    if (r.status >= 400) {
      setErro(mensagemDeErro(r, rota));
      return false;
    }
    setErro('');
    return true;
  }

  async function enviarNovoTreino() {
    const r = await chamar('POST', '/treinos', {
      nome: nome,
      duracao: Number(duracao),
    });
    if (conferir(r, 'POST /treinos')) {
      setNome('');
      setDuracao('');
      carregar();
    }
  }

  async function concluir(id) {
    const r = await chamar('PUT', `/treinos/${id}/concluir`);
    if (conferir(r, 'PUT /treinos/:id/concluir')) {
      carregar();
    }
  }

  async function apagar(id) {
    const r = await chamar('DELETE', `/treinos/${id}`);
    if (conferir(r, 'DELETE /treinos/:id')) {
      carregar();
    }
  }

  // TAREFA 6: Validação antes de enviar
  function aoEnviar(evento) {
    evento.preventDefault();

    if (!nome.trim()) {
      setErro('O nome do treino não pode ser vazio.');
      return;
    }

    const duracaoNum = Number(duracao);
    if (!Number.isInteger(duracaoNum) || duracaoNum < 1 || duracaoNum > 180) {
      setErro('A duração precisa ser um número inteiro entre 1 e 180 minutos.');
      return;
    }

    setErro('');
    enviarNovoTreino();
  }

  return (
    <>
      {/* TAREFA 5: Campos controlados */}
      <form className="cartao" onSubmit={aoEnviar}>
        <h2>Novo treino</h2>
        <div className="linha-form">
          <div>
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="duracao">Duração (min)</label>
            <input
              id="duracao"
              type="number"
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
            />
          </div>
          <button type="submit">Adicionar</button>
        </div>
      </form>

      {erro && (
        <p className="mensagem-erro" role="alert">
          {erro}
        </p>
      )}

      <section className="cartao">
        <h2>
          Meus treinos{' '}
          <span className="selo">
            {total === null ? 'total: ?' : `total: ${total}`}
          </span>
        </h2>

        {carregando && <p className="suave">Carregando...</p>}

        {/* TAREFA 7: Estado vazio */}
        {!carregando && treinos.length === 0 && (
          <p className="suave">Nenhum treino ainda. Cadastre o primeiro acima.</p>
        )}

        {/* TAREFA 8: Lista de treinos */}
        <ul className="lista">
          {treinos.map((t) => (
            <CartaoTreino
              key={t.id}
              treino={t}
              onConcluir={concluir}
              onApagar={apagar}
            />
          ))}
        </ul>
      </section>
    </>
  );
}
