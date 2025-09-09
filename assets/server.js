const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa o CORS

const app = express();

app.use(cors()); // Permite requisições de outras origens
app.use(bodyParser.json());

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados.');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM admins WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Erro na consulta ao banco:', err);
            res.status(500).json({ success: false, message: 'Erro no servidor.' });
        } else if (results.length > 0) {
            res.status(200).json({ success: true, message: 'Login bem-sucedido!' });
        } else {
            res.status(401).json({ success: false, message: 'Usuário ou senha incorretos.' });
        }
    });
});

// Rotas para produtos
app.post('/products', (req, res) => {
    const { name, price, description } = req.body;
    const query = 'INSERT INTO products (name, price, description) VALUES (?, ?, ?)';
    db.query(query, [name, price, description], (err) => {
        if (err) {
            res.status(500).json({ message: 'Erro ao adicionar produto.' });
        } else {
            res.status(200).json({ message: 'Produto adicionado com sucesso!' });
        }
    });
});

app.get('/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Erro ao buscar produtos.' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            res.status(500).json({ message: 'Erro ao excluir produto.' });
        } else {
            res.status(200).json({ message: 'Produto excluído com sucesso!' });
        }
    });
});

// Rotas para alunos
app.post('/students', (req, res) => {
    const { name, email } = req.body;
    const query = 'INSERT INTO students (name, email) VALUES (?, ?)';
    db.query(query, [name, email], (err) => {
        if (err) {
            res.status(500).json({ message: 'Erro ao adicionar aluno.' });
        } else {
            res.status(200).json({ message: 'Aluno adicionado com sucesso!' });
        }
    });
});

app.get('/students', (req, res) => {
    const query = 'SELECT * FROM students';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Erro ao buscar alunos.' });
        } else {
            res.status(200).json(results);
        }
    });
});

app.delete('/students/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM students WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            res.status(500).json({ message: 'Erro ao excluir aluno.' });
        } else {
            res.status(200).json({ message: 'Aluno excluído com sucesso!' });
        }
    });
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
