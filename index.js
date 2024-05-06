const express = require('express');
const { Pool } = require('pg');


const app = express();
const PORT = 4000;

app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'joaorocha',
  password: 'ds564',
  port: 7007,
});

app.get('/fighters',  async (req, res) => { 
    try{
        const fighters = await pool.query("SELECT * FROM fighters");
        res.json({
          total: fighters.rowCount,
          lutadores: fighters.rows
        })
    }catch(error){
      console.log({ erro: error });
    res.status(400).send({ mensagem: 'Falha ao tentar buscar todos os lutadores' });
    }
});

app.get('/fighters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query('SELECT * FROM fighters WHERE id=$1', [id]);

    if (resultado.rowCount == 0) {
      res.status(404).send({ mensagem: `Lutador com o ID "${id}" não foi encontrado` });
    }else {
      res.json(resultado.rows[0])
    }

  } catch (error) {
    console.log({ erro: error });
    res.status(500).send({ mensagem: `Erro ao tentar encontrar o Lutador do do ID ${id}` });
  }
});

app.post('/fighters', async (req, res) => {
try {
  const { name, health, tier, level, fusion, classes, damage, abilityI, abilityII, abilityIII } = req.body;

  
} catch (error) {
  
}
});

app.get('/', async (req, res) => {
  res.status(200).send({ mensagem: 'SERVER BY RNCHX ONN 👻.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 👻`);
});