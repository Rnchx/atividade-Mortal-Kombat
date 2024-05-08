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

async function calculateFighterWinner(fighterIdI, fighterIdII) {
  let fighterI = await pool.query('SELECT * FROM fighters WHERE id = $1', [fighterIdI]);
  let fighterII = await pool.query('SELECT * FROM fighters WHERE id = $1', [fighterIdII]);

  fighterI = fighterI.rows[0];
  fighterII = fighterII.rows[0];

  if (fighterI.damage > fighterII.damage) {
    return fighterI.id;
  } else if (fighterII.damage > fighterI.damage) {
    return fighterII.id;
  } else {
    if (fighterI.fusion > fighterII.fusion || fighterI.health > fighterII.health) {
      return fighterI.id;
    } else if (fighterII.fusion > fighterI.fusion || fighterII.health > fighterI.health) {
      return fighterII.id;
    } else {
      if (fighterI.level > fighterII.level) {
        return fighterI.id;
      } else {
        return fighterII.id;
      }
    }
  }
}

app.get('/fighters', async (req, res) => {
  try {
    const fighters = await pool.query("SELECT * FROM fighters");
    res.json({
      total: fighters.rowCount,
      lutadores: fighters.rows
    })
  } catch (error) {
    console.log({ erro: error });
    res.status(400).send({ mensagem: 'Falha ao tentar buscar todos os lutadores' });
  }
});

app.get('/fighters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM fighters WHERE id=$1', [id]);

    if (result.rowCount == 0) {
      res.status(404).send({ mensagem: `Lutador com o ID "${id}" não foi encontrado` });
    } else {
      res.json(result.rows[0])
    }

  } catch (error) {
    console.log({ erro: error });
    res.status(500).send({ mensagem: `Erro ao tentar encontrar o Lutador do ID ${id}` });
  }
});

app.post('/fighters', async (req, res) => {
  try {
    const { name, health, tier, level, fusion, classes, damage, abilityI, abilityII, abilityIII } = req.body;

    let tiersMk = [
      "Bronze",
      "bronze",
      "Prata",
      "prata",
      "Ouro",
      "ouro",
      "Diamante",
      "diamante"
    ];

    let fusionsMk = [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X"
    ];

    let classesMk = [
      "Deus Ancestral",
      "Artista Marcial",
      "Exoterra",
      "nômade",
      "Submundo",
      "Operações Especiais"
    ];

    if (name == '' || health == '' || tier == '' || level == '' || fusion == '' || classes == '' || damage == '' || abilityI == '' || abilityII == '' || abilityIII == '') {
      return res.status(422).send({ mensagem: 'Preencha todos os campos' });
    }

    if (!tiersMk.includes(tier)) {
      return res.status(422).send({ mensagem: 'Coloque uma classe de lutador válida' });
    }

    if (level < 0 || level > 60) {
      return res.status(422).send({ mensagem: 'Coloque uma level de lutador válido' });
    }

    if(!fusionsMk.includes(fusion)) {
      return res.status(422).send({ mensagem: 'Coloque uma fusão de lutador válida' });
    }

    if(!classesMk.includes(classes)) {
      return res.status(422).send({ mensagem: 'Coloque um grupo de lutador válido' });
    }

    await pool.query('INSERT INTO fighters (name, health, tier, level, fusion, classes, damage, abilityI, abilityII, abilityIII) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [name, health, tier, level, fusion, classes, damage, abilityI, abilityII, abilityIII]);
    res.status(200).send({ mensagem: 'Sucesso ao Cadastrar um novo Lutador' })
  } catch (error) {
    console.error('Erro ao tentar cadastrar um novo lutador:', error);
    res.status(500).send({ mensagem: 'Obteve FALHA ao tentar cadastrar um novo lutador', erro: error });
  }
});

app.delete('/fighters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM fighters WHERE id = $1', [id]);
    res.status(200).send({ mensagem: `lutador com o ID ${id} foi deletado` });
  } catch (error) {
    console.log('error:', error);
    res.status(500).send(`Erro ao tentar deletar o lutador ${id}.`)
  }
});


app.put('/fighters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, health, tier, level, fusion, classes, damage, abilityI, abilityII, abilityIII } = req.body;

    let tiersMk = [
      "Bronze",
      "bronze",
      "Prata",
      "prata",
      "Ouro",
      "ouro",
      "Diamante",
      "diamante"
    ];

    let fusionsMk = [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X"
    ];
    let classesMk = [
      "Deus Ancestral",
      "Artista Marcial",
      "Exoterra",
      "nômade",
      "Submundo",
      "Operações Especiais"
    ];

    if (name == '' || health == '' || tier == '' || level == '' || fusion == '' || classes == '' || damage == '' || abilityI == '' || abilityII == '' || abilityIII == '') {
      return res.status(422).send({ mensagem: 'Preencha todos os campos' });
    }

    if (!tiersMk.includes(tier)) {
      return res.status(422).send({ mensagem: 'Coloque uma classe de lutador válida' });
    }

    if(!fusionsMk.includes(fusion)) {
      return res.status(422).send({ mensagem: 'Coloque uma fusão de lutador válida' });
    }

    if(!classesMk.includes(classes)) {
      return res.status(422).send({ mensagem: 'Coloque um grupo de lutador válido' });
    }

    await pool.query('UPDATE fighters SET name = $1, health = $2, tier = $3, level = $4, fusion = $5, classes = $6, damage = $7, abilityI = $8, abilityII = $9, abilityIII = $10 WHERE id = $11', [name, health, tier, level, fusion, classes, damage, abilityI, abilityII, abilityIII, id]);
    res.status(201).send({ mensagem: 'Lutador editado com sucesso' })
  } catch (error) {
    console.log('erorr:', error);
    res.status(500).send({ mensagem: `Falha ao tentar editar/atualizar o Lutador` });
  }
});

app.get('/fighters/level/:level', async (req, res) => {
  try {
    const { level } = req.params;

    const result = await pool.query('SELECT * FROM fighters WHERE level = $1', [level]);

    if (level < 0 || level > 60) {
      res.status(404).send({ mensagem: `Lutadores com o level "${level}" não existe` });
    } else {
      res.json({
        lutadoresComEsseLevel: result.rows
      })
    }
  } catch (error) {
    console.log({ erro: error });
    res.status(500).send({ mensagem: `Erro ao tentar encontrar o Lutador` });
  }
});

app.get('/fighters/fusion/:fusion', async (req, res) => {
  try {
    const { fusion } = req.params;

    const result = await pool.query('SELECT * FROM fighters WHERE fusion = $1', [fusion]);

    let fusionsMk = [
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X"
    ];

    if(!fusionsMk.includes(fusion)) {
      return res.status(422).send({ mensagem: 'Coloque uma fusão de lutador válida' });
    } else {
      res.json({
        lutadoresComEssaFusão: result.rows
      })
    }
  } catch (error) {
    console.log({ erro: error });
    res.status(500).send({ mensagem: `Erro ao tentar encontrar o Lutador` });
  }
});

app.get('/fighters/name/:name', async (req, res) => {
  try {
    const { name } = req.params;

    const result = await pool.query('SELECT * FROM fighters WHERE name = $1', [name]);

      res.json({
        lutador: result.rows
      })
  } catch (error) {
    console.log({ erro: error });
    res.status(500).send({ mensagem: `Erro ao tentar encontrar o Lutador` });
  }
});

app.get('/fighters/tier/:tier', async (req, res) => {
  try {
    const { tier } = req.params;

    const result = await pool.query('SELECT * FROM fighters WHERE tier = $1', [tier]);

    let tiersMk = [
      "Bronze",
      "bronze",
      "Prata",
      "prata",
      "Ouro",
      "ouro",
      "Diamante",
      "diamante"
    ];

    if (!tiersMk.includes(tier)) {
      return res.status(422).send({ mensagem: 'Coloque uma classe de lutador válida' });
    }

      res.json({
        lutadoresComEssasClasses: result.rows
      })
  } catch (error) {
    console.log({ erro: error });
    res.status(500).send({ mensagem: `Erro ao tentar encontrar o Lutador` });
  }
});

app.get('/fighters/classes/:classes', async (req, res) => {
  try {
    const { classes } = req.params;

    const result = await pool.query('SELECT * FROM fighters WHERE classes = $1', [classes]);

 let classesMk = [
      "Deus Ancestral",
      "Artista Marcial",
      "Exoterra",
      "nômade",
      "Submundo",
      "Operações Especiais"
    ];

    if (!classesMk.includes(classes)) {
      return res.status(422).send({ mensagem: 'Coloque um grupo de lutador válido' });
    }

      res.json({
        quantidadeDeGrupos: result.rowCount,
        lutadoresDessesGrupos: result.rows
      })
  } catch (error) {
    console.log({ erro: error });
    res.status(500).send({ mensagem: `Erro ao tentar encontrar o Lutador` });
  }
});

app.get('/fights', async (req, res) => {
  try {
    const fights = await pool.query('SELECT * FROM fights');
    res.json({
      total: fights.rowCount,
      lutas: fights.rows
    });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao tentar obter todas as lutas registradas', error: error });
  }
});

app.get('/fights/:fighterIdI/:fighterIdII', async (req, res) => {
  try {
    const { fighterIdI, fighterIdII } = req.params;

    const fighterWinner = await calculateFighterWinner(fighterIdI, fighterIdII);

    await pool.query('INSERT INTO fights (fighterIdI, fighterIdII, winnerId) VALUES ($1, $2, $3)', [fighterIdI, fighterIdII, fighterWinner]);

    const result = await pool.query('SELECT * FROM fighters WHERE id = $1', [fighterWinner]);
    res.json({
       ganhador: result.rows[0],
        menesagem: `Batalha registrada no sistema` 
      });
    console.log(result);

  } catch (error) {
    res.status(500).send({ message: 'Erro ao tentar realizar a luta', error: error });
    console.error(error);
  }
});

app.get('/fights/fighters', async (req, res) => {
  try {
    const  result = await pool.query('SELECT fights.id, fighterIdI, fighterIdII, winnerId, fighters.name as winner_name, fighters.health as winner_health, fighters.damage as winner_damage, fighters.level as winner_level, fighters.fusion as winner_fusion FROM fights INNER JOIN fighters ON fights.winnerId = fighters.id');
    console.log(result);
    res.json({
      total: result.rowCount,
      batalhas: result.rows
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao tentar obter o histórico de batalhas', erro: error });
  }
});

app.get('/', async (req, res) => {
  res.status(200).send({ mensagem: 'SERVER BY RNCHX ONN 👻.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 👻`);
});