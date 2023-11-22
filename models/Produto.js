const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Produto = db.define('produto',{
    nome: {
        type: DataTypes.STRING(75)
    },
    tempo : {
        type : DataTypes.STRING(16)
    },
    quantidade_estoque: {
        type: DataTypes.INTEGER
    },
    preco: {
        type: DataTypes.FLOAT
    },
    descricao: {
        type: DataTypes.TEXT
    }
},{
    createdAt: false,
    updatedAt: false
})

// Produto.sync({force:true})

module.exports = Produto