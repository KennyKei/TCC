 // Função de Login
 async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (result.success) {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('dashboardContainer').style.display = 'block';
    } else {
        alert('Usuário ou senha incorretos!');
    }
}

// Função de Navegação
async function navigate(page) {
    const content = document.getElementById('content');
    if (page === 'home') {
        content.innerHTML = '<h2>Bem-vindo ao Painel de Administração</h2><p>Use o menu para navegar pelas diferentes seções.</p>';
    } else if (page === 'alunos') {
        const alunos = await fetchData('/students');
        let html = '<h2>Gerenciar Alunos</h2>';
        alunos.forEach(aluno => {
            html += `<p>${aluno.name} - ${aluno.email} <button onclick="deleteData('/students/${aluno.id}')">Excluir</button></p>`;
        });
        html += `<button onclick="addStudent()">Adicionar Aluno</button>`;
        content.innerHTML = html;
    } else if (page === 'produtos') {
        const produtos = await fetchData('/products');
        let html = '<h2>Gerenciar Produtos</h2>';
        produtos.forEach(produto => {
            html += `<p>${produto.name} - R$${produto.price.toFixed(2)} <button onclick="deleteData('/products/${produto.id}')">Excluir</button></p>`;
        });
        html += `<button onclick="addProduct()">Adicionar Produto</button>`;
        content.innerHTML = html;
    }
}

// Função de Buscar Dados
async function fetchData(endpoint) {
    const response = await fetch(`http://localhost:3000${endpoint}`);
    return response.json();
}

// Função de Deletar Dados
async function deleteData(endpoint) {
    await fetch(`http://localhost:3000${endpoint}`, { method: 'DELETE' });
    navigate(endpoint.includes('students') ? 'alunos' : 'produtos');
}

// Função de Adicionar Aluno
async function addStudent() {
    const name = prompt('Digite o nome do aluno:');
    const email = prompt('Digite o email do aluno:');
    if (name && email) {
        await fetch('http://localhost:3000/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        navigate('alunos');
    }
}

// Função de Adicionar Produto
async function addProduct() {
    const name = prompt('Digite o nome do produto:');
    const price = parseFloat(prompt('Digite o preço do produto:'));
    if (name && !isNaN(price)) {
        await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price })
        });
        navigate('produtos');
    }
}