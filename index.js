const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const conn = require('./db/conn')
const Cliente = require('./models/Cliente')
const Produto = require('./models/Produto')
const bcrypt = require('bcrypt')


const port = 3000
const hostname = 'localhost'

let log = false
let usuario = ''
let adm = false

/* ---------------- express --------------------- */
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static('public'))
/* ---------------- handlebars ------------------ */
app.set('view engine', 'handlebars')
app.engine('handlebars', handlebars.engine())
/* ---------------------------------------------- */

// ============== Acesso do Cliente ============= //

app.post('/perfil', async(req,res)=>{
    const nome = req.body.usuario
    const senha = req.body.senha
    const msg = 'Informações Atualizadas'
    const msgB = 'Erro ao atualizar'
    const pesq = await Cliente.findOne({raw:true, where:{usuario:usuario}})
    console.log(pesq)
    
    if((pesq != null)&&(nome != '')&&(senha != '')){
        bcrypt.hash(senha, 10, async (err,hash)=>{
            if(err){
                console.error('Erro ao criar o hash da senha'+err)
                res.render('perfil', {log, usuario, adm, msgB})
                return
            }
            try{
                const dados ={
                    usuario:nome,
                    senha:hash
                }
                console.log(dados)
                await Cliente.update(dados, {where:{usuario:usuario}})
    
                const pesq = await Cliente.findOne({ raw: true, where:{ usuario:nome, senha: hash}})
                console.log(pesq)
                log = true
                usuario = nome
    
    
                res.render('perfil', {log, usuario, adm, msg})
            }catch(error){
                console.error('Erro ao criar a senha',error)
                res.render('perfil', {log, usuario, adm, msgB})
            }
        })
    }else{
        res.render('perfil', {log, usuario, adm, msgB})
    }
})

app.get('/perfil', (req,res)=>{
    res.render('perfil', {log, usuario, adm})
})

app.post('/cadastro', async(req,res)=>{
    const usuario = req.body.usuario
    const email = req.body.email
    const telefone = req.body.telefone
    const cpf = req.body.cpf
    const senha = req.body.senha
    const tipo = 'cliente'

    bcrypt.hash(senha, 10, async (err,hash)=>{
        if(err){
            console.error(`Erro ao criar o hash da senha ${err}`)
            res.render('home', {log, usuario, adm})
            return
        }try{
            await Cliente.create({usuario: usuario, email: email, telefone: telefone,cpf:cpf, senha: hash, tipo:tipo})
            log = true
            const pesq = await Cliente.findOne({raw:true,where:{usuario:usuario,senha:hash}})
            console.log(pesq)
            res.render('home', {log, usuario, adm})
        }catch(err){
            console.error(`Erro da senha ${err}`)
            res.render('home', {log, usuario, adm})
        }
    })
})

app.get('/cadastro', (req,res)=>{
    res.render('cadastro', {log, usuario, adm})
})
app.get('/carrinho', (req,res)=>{
    res.render('carrinho', {log, usuario, adm})
})

app.get('/produtos', async(req,res)=>{
    const dados = await Produto.findAll({raw:true})
    res.render('produtos', {log, usuario, adm, dados})
})

// ====================== Acesso Gerente ======================
app.post('/apagarProduto', async(req,res)=>{
    const id = req.body.id
    const msg = 'Dados Apagados'
    const msgB = 'Erro ao apagar'
    const pesq = await Produto.findOne({raw:true, where:{id:id}})
    if(pesq != null){
        await Produto.destroy({where:{id:id}})
        res.render('apagarProduto', {log, usuario, adm, msg})
    }else{
        res.render('apagarProduto', {log, usuario, adm, msgB})
    }
})

app.post('/consultaProduto', async (req, res)=>{
    const nome_viagem = req.body.nome
    console.log(nome_viagem)
    const valor = await Produto.findAll({raw:true, where: {nome:nome_viagem}})
    console.log(valor)
    res.render('editarProduto',{log, usuario, adm, valor} )
})

app.get('/apagarProduto', (req,res)=>{
    res.render('apagarProduto', {log, usuario, adm})
})

app.post('/editarProduto', async (req,res)=>{
    const id = req.body.id
    const nome = req.body.nome
    const tempo = req.body.tempo
    const quantidade_estoque = Number(req.body.quantidade_estoque)
    const preco = Number(req.body.preco)
    const descricao = req.body.descricao
   
    const pesq = await Produto.findOne({raw:true, where: {id:id}})
    const dados = {
        nome:nome,
        tempo:tempo,
        quantidade_estoque:quantidade_estoque,
        preco:preco,
        descricao:descricao
    }
    const msg = 'Dados Alterados'
    const msgB = 'Erro'
    console.log(dados)
    if(pesq != null){
        await Produto.update(dados, {where:{id:id}})
        res.render('editarProduto', {log, usuario, adm, msg})
    }else{
        res.render('editarProduto', {log, usuario, adm, msgB})
    }
})

app.get('/editarProduto', (req,res)=>{
    res.render('editarProduto', {log, usuario, adm})
})

app.get('/listarCliente', async (req,res)=>{
    const dados = await Cliente.findAll({raw:true})
    console.log(dados)
    res.render('listarCliente', {log, usuario, adm, dados})
})

app.get('/listarProduto', async (req,res)=>{
    const dados = await Produto.findAll({raw:true})
    console.log(dados)
    res.render('listarProduto', {log, usuario, adm, valores:dados})
})

app.post('/cadastrarProduto', async (req,res)=>{
    const nome = req.body.nome
    const tempo = req.body.tempo
    const quantidade_estoque = Number(req.body.quantidade_estoque)
    const preco = Number(req.body.preco)
    const descricao = req.body.descricao
    console.log(nome, tempo, quantidade_estoque, preco, descricao)
    await Produto.create({nome:nome, tempo:tempo, quantidade_estoque:quantidade_estoque, preco:preco, descricao:descricao})
    let msg = 'Dados Cadastrados'
    res.render('cadastrarProduto', {log, usuario, adm, msg})
})

app.get('/cadastrarProduto', (req,res)=>{
    res.render('cadastrarProduto', {log, usuario, adm})
})

app.get('/gerenciador', (req,res)=>{
    res.render('gerenciador', {log, usuario, adm})    
})

// ===================== Compra/Carrinho ========================
app.post('/comprar', async(req,res)=>{
    const dados_carrinho = req.body
    console.log(dados_carrinho)

    const atualiza_promise = []
    for (const item of dados_carrinho){
        const produto = await Produto.findByPk(item.cod_prod, {raw:true})
        console.log(produto)
        if(!produto || produto.quantidadeEstoque < item.qtde){
            return res.status(400).json({message:"Produto não Disponível" + produto.quantidadeEstoque})
        }
        const atualiza_promessas = await Produto.update(
            {quantidadeEstoque: produto.quantidadeEstoque - item.qtde},
            {where:{id: item.cod_prod}}
        )
        atualiza_promise.push(atualiza_promessas)
    }
    try{
        await Promise.all(atualiza_promise)
        res.status(200).json({message:"Compra Realizada!"})
    }catch(error){
        console.error('Erro ao atualizar os dados '+ error)
        res.status(500).json({message: "Erro ao processar a compra"})
    }
})

// ====================== Login/Logout =======================
app.post('/login', async (req,res)=>{
    const email = req.body.email
    const senha = req.body.senha
    console.log(email,senha)
    const pesq = await Cliente.findOne({raw:true, where:{email:email}})
    console.log(pesq)
    let msg = 'Usuário não Cadastrado'
    if(pesq == null){
        res.render('login', {msg})
        
    }else{
        // comparando a senha com o uso de hash
        bcrypt.compare(senha, pesq.senha, (err,resultado)=>{
           if(err){
                console.error('Erro ao comparar a senha',err)
                res.render('home', {log, usuario, adm})
           }else if(resultado){
            console.log('Cliente existente')
            if(pesq.tipo === 'admin'){
                log = true
                usuario = pesq.usuario
                adm = true
                console.log(adm)
                res.render('gerenciador', {log, usuario, adm})        
            }else if(pesq.tipo === 'cliente'){
                log = true
                usuario = pesq.usuario
                adm = false
                console.log(usuario)
                res.render('home', {log, usuario, adm})
           }
           }else{
            console.log('senha incorreta')
            res.render('home', {log, usuario, adm})
           }
        })
    }
})

app.get('/login', (req,res)=>{
    log = false
    usuario = ''
    res.render('login', {log, usuario, adm})
})

app.get('/logout', (req,res)=>{
    log = false
    usuario = ''
    res.render('home', {log, usuario, adm})
})

// ==================== Rota Padrão ========================
app.get('/', (req,res)=>{
    res.render('home', {log, usuario, adm})
})
/* ------------------------------------------------- */
conn.sync().then(()=>{
    app.listen(port,hostname, ()=>{
        console.log(`Servidor Rodando em ${hostname}:${port}`)
    })
}).catch((error)=>{
    console.error('Erro de conexão com o banco de dados!'+error)
})
