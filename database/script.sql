-- Criação da tabela dos desafiantes/lutadores do Mortal Kombat

CREATE TABLE fighters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  health INT NOT NULL,
  tier VARCHAR(50) NOT NULL,
  level INT NOT NULL,
  fusion VARCHAR(4),
  classes VARCHAR(100) NOT NULL,
  damage INT NOT NULL,
  abilityI VARCHAR(60) NOT NULL,
  abilityII VARCHAR(60) NOT NULL,
  abilityIII VARCHAR(60)
);

-- Criação da tabela das lutas do Mortal Kombat

CREATE TABLE fights (
id SERIAL PRIMARY KEY,
fighterIdI INT NOT NULL,
fighterIdII INT NOT NULL,
winnerId INT NOT NULL,
FOREIGN KEY (fighterIdI) REFERENCES fighters(id),
FOREIGN KEY (fighterIdII) REFERENCES fighters(id),
FOREIGN KEY (winnerId) REFERENCES fighters(id)
);

-- Insert dos desafiantes/lutadores no Mortal Kombat

INSERT INTO fighters (name, health, tier, level, fusion, classes, damage, abilityI, abilityII, abilityIII) VALUES 
('Oni', 42789, 'Bronze', 51, 'IX', 'Submundo', 24598, 'Chamuscado', 'Ligação', ''),
('Sauriano', 51741, 'Bronze', 60, 'VIII', 'Exoterra', 38926, 'Cusparada', 'Ataque com Garra', ''),
('Cassie Cage', 78934, 'Prata', 54, 'X', 'Operações Especiais', 38965, 'Chute Luminoso', 'Fogo de Cage', 'Chute Sofisticado'),
('Sonya Blade', 24322, 'Prata', 45, 'VI', 'Operações Especiais', 11923, 'Chute em Arco', 'Anel de Energia', 'Força em Alerta'),
('Scorpion Infernal', 102000, 'Ouro', 60, 'X', 'Artista Marcial / Submundo', 67883, 'lança', 'Ajuda do Assecla', 'Do Inferno'),
('Triborg Cyrax', 88345, 'Ouro', 53, 'X', 'Artista Marcial', 62976, 'Rede Avançada', 'Serra Circular', 'Iniciativa Cibernética'),
('Skarlet Assassina', 138020, 'Diamante', 60, 'X', 'Exoterra', 117529, 'Sifão Celular', 'Tentáculos', 'Prazer Sangrento'),
('Raiden Klássico', 145987, 'Diamante', 58, 'IX', 'Deus Ancestral / Operações Especiais', 112534, 'Investida do Trovão', 'Descarga Poderosa', 'Terapia de Choque'),
('Liu Kang MK11', 163784, 'Diamante', 50, 'VII', 'Artista Marcial', 135762, 'Chute Bicicleta', 'Conflito do Nunchaku', 'Chegada do Dragão'),
('Noob Saibot', 143739, 'Diamante', 59, 'X', 'Submundo', 147648, 'Pancada Telecinética', 'Investida Sombria', 'Juntos Novamente');