const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const conn = require('./db/conn')
const Usuario = require('./models/Usuario')

const port = 3000
const hostname = 'localhost'

let user = ``
let tipo_user = ``
let log = false

// ==================== express ====================
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
// ==================== handlebars =================
app.set('view engine', 'handlebars')
app.engine('handlebars', handlebars.engine())
// =================================================
app.post('/login', async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha

    const pesq_login = await Usuario.findOne({raw:true,where:{email:email,senha:senha}})
    let msg = 'Usuário não Cadastrado'

    if(pesq_login == null){
        res.render('login', {msg})
    }else if(email == pesq_login.email && senha == pesq_login.senha && pesq_login.tipo === 'gerente'){
        log = true
        user = pesq_login.nome
        tipo_user = pesq_login.tipo
        res.render('gerenciador', {log, user, tipo_user})        
    }else if(email == pesq_login.email && senha == pesq_login.senha && pesq_login.tipo === 'cliente'){
        log = true
        user = pesq_login.user
        tipo_user = pesq_login.tipo
        res.render('home', {log, user, tipo_user})
    }else{
        res.render('home', {msg})
    }
})
// ============= renderizando ======================
app.get('/planetas',(req,res)=>{
    res.render('planetas',{log})
})
app.get('/logout',(req,res)=>{
    let log = false
    res.render('home',{log})
})
app.get('/excluir_viagem',(req,res)=>{
    res.render('excluir_viagem',{log})
})
app.get('/listar_viagem',(req,res)=>{
    res.render('listar_viagem',{log})
})
app.get('/cadastrar_viagem',(req,res)=>{
    res.render('cadastrar_viagem',{log})
})
app.get('/editar_viagem',(req,res)=>{
    res.render('editar_viagem',{log})
})
app.get('/register',(req,res)=>{
    res.render('register',{log})
})
app.get('/login',(req,res)=>{
    res.render('login',{log})
})
app.get('/',(req,res)=>{
    res.render('home',{log})
})
// =================================================
conn.sync().then(()=>{
    app.listen(port,hostname,()=>{
        console.log(`Servidor ${hostname} rodando no ${port}`)
    })
}).catch((err)=>{
    console.log(`Não foi possível rodar o servidor devido ao erro ${err}`)
})