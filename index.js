const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const conn = require('./db/conn')
const Usuario = require('./models/Usuario')

const port = 3000
const hostname = 'localhost'

let user = ``
let tipo_user = ``
let cliente = false
let gerenciador = false

// ==================== express ====================
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
// ==================== handlebars =================
app.set('view engine', 'handlebars')
app.engine('handlebars', handlebars.engine())
// =================================================
app.post('/register', async (req,res)=>{
    const nome = req.body.nome
    const email = req.body.email
    const telefone = req.body.telefone
    const cpf = req.body.cpf
    const senha = req.body.senha
    const tipo = req.body.tipo
    
    await Usuario.create({nome:nome, email:email, telefone:telefone, cpf:cpf, senha:senha, tipo:tipo})
    let msg = 'Dados Cadastrados'
    res.render('login', {cliente, gerenciador, user, tipo_user})
})
// =================================================
app.post('/login', async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha

    const pesq_login = await Usuario.findOne({raw:true,where:{email:email,senha:senha}})

    if(pesq_login == null){
        user = pesq_login.nome
        tipo_user = pesq_login.tipo
        res.render('login', {cliente, gerenciador, user, tipo_user})
    }else if(email == pesq_login.email && senha == pesq_login.senha && pesq_login.tipo == 'gerente' || pesq_login.tipo == 'Gerente'){
        cliente = false
        gerenciador = true
        user = pesq_login.nome
        tipo_user = pesq_login.tipo
        res.render('gerenciador', {cliente, gerenciador, user, tipo_user})        
    }else if(email == pesq_login.email && senha == pesq_login.senha && pesq_login.tipo == 'cliente' || pesq_login.tipo == 'Cliente'){
        cliente = true
        gerenciador = false
        user = pesq_login.nome
        tipo_user = pesq_login.tipo
        res.render('home', {cliente, gerenciador, user, tipo_user})
    }else{
        user = pesq_login.nome
        tipo_user = pesq_login.tipo
        res.render('home', {cliente, gerenciador, user, tipo_user})
    }
})
// ============= renderizando ======================
app.get('/planetas',(req,res)=>{
    res.render('planetas',{cliente, gerenciador, user, tipo_user})
})
app.get('/logout',(req,res)=>{
    cliente = false
    gerenciador = false
    res.render('home',{cliente, gerenciador, user, tipo_user})
})
app.get('/excluir_viagem',(req,res)=>{
    res.render('excluir_viagem',{cliente, gerenciador, user, tipo_user})
})
app.get('/gerenciador',(req,res)=>{
    res.render('gerenciador',{cliente, gerenciador, user, tipo_user})
})
app.get('/carrinho',(req,res)=>{
    res.render('carrinho',{cliente, gerenciador, user, tipo_user})
})
app.get('/listar_viagem',(req,res)=>{
    res.render('listar_viagem',{cliente, gerenciador, user, tipo_user})
})
app.get('/cadastrar_viagem',(req,res)=>{
    res.render('cadastrar_viagem',{cliente, gerenciador, user, tipo_user})
})
app.get('/editar_viagem',(req,res)=>{
    res.render('editar_viagem',{cliente, gerenciador, user, tipo_user})
})
app.get('/register',(req,res)=>{
    res.render('register',{cliente, gerenciador, user, tipo_user})
})
app.get('/login',(req,res)=>{
    res.render('login',{cliente, gerenciador, user, tipo_user})
})
app.get('/',(req,res)=>{
    res.render('home',{cliente, gerenciador, user, tipo_user})
})
// =================================================
conn.sync().then(()=>{
    app.listen(port,hostname,()=>{
        console.log(`Servidor ${hostname} rodando no ${port}`)
    })
}).catch((err)=>{
    console.log(`Não foi possível rodar o servidor devido ao erro ${err}`)
})