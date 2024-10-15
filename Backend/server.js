import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_PATH = './data/livros.json';

const readData = () => {
  const data = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(data || '[]');
};

const writeData = (data) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
};

app.get('/livros', (req, res) => {
  const livros = readData();
  res.json(livros);
});

app.get('/livros/:id', (req, res) => {
  const livros = readData();
  const livro = livros.find((l) => l.id === parseInt(req.params.id));
  if (!livro) {
    return res.status(404).json({ mensagem: 'Livro não encontrado' });
  }
  res.json(livro);
});

app.post('/livros', (req, res) => {
  const livros = readData();
  const newLivro = req.body;
  
  const existingLivro = livros.find((l) => l.id === newLivro.id);
  if (existingLivro) {
    return res.status(400).json({ mensagem: 'Livro com esse ID já existe' });
  }

  livros.push(newLivro);
  writeData(livros);
  res.status(201).json({ mensagem: 'Livro criado com sucesso!' });
});

app.put('/livros/:id', (req, res) => {
  const livros = readData();
  const livroIndex = livros.findIndex((l) => l.id === parseInt(req.params.id));
  if (livroIndex === -1) {
    return res.status(404).json({ mensagem: 'Livro não encontrado' });
  }

  livros[livroIndex] = { ...livros[livroIndex], ...req.body };
  writeData(livros);
  res.json({ mensagem: 'Livro atualizado com sucesso!' });
});

app.delete('/livros/:id', (req, res) => {
  const livros = readData();
  const newLivros = livros.filter((l) => l.id !== parseInt(req.params.id));

  if (livros.length === newLivros.length) {
    return res.status(404).json({ mensagem: 'Livro não encontrado' });
  }

  writeData(newLivros);
  res.json({ mensagem: 'Livro excluído com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
