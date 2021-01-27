// Carrega as dependências
const express = require('express');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

// Conecta ao banco de dados
const uri = 'mongodb://localhost:27017/sistema'
const options = { 
    useUnifiedTopology: true,
    useNewUrlParser: true
}

mongoose.connect(uri, options)

// Cria o esquema do documento
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    }
}, {collection: 'usuarios'});

var Usuarios = mongoose.model('usuarios', usuarioSchema);

// Cria as rotas
var router = express.Router();

router.get('/usuarios', verifyJWT, function(req, res){
    Usuarios.find({}, function (err, docs){
        res.json(docs)
    })
})

router.get('/usuarios/:nome', function(req, res){
    var nome = req.params.nome;
    Usuarios.find({"nome": nome, "senha": "flofis"}, function (err, docs){
        res.json(docs)
    })
})


// Instancia o Express
app = express();

// Configura o Express
app.set('porta', 3000);
app.use(bodyParser.json());
app.use('/', router);

// JWT
const secretKey = 'minhaFraseSecreta!';

router.post('/login', (req, res, next) => {
    Usuarios.find(
        {
            "nome": req.body.nome, 
            "senha" : req.body.senha
        }, (err, data) => {
            if (data.length === 0) {
                return res.status(401).send(req.body.nome + " => " + req.body.senha);
            } else {
                const id = 1;
                const token = jwt.sign({ id }, secretKey, { expiresIn: 300});
                return res.json({auth: true, token: token});
            }
    })
});

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send('unauthorized 2');

    jwt.verify(token, secretKey, function(err, decoded) {
        if (err) res.status(401).send("unauthorized 3");
        req.userId = decoded.id;
        next();
    });
};

// Teste
router.get('/teste', (req, res, next) => {
    Usuarios.find({}, (err, data) => {
        res.send(data);
    })
})

// Ativa o listener
app.listen(app.get('porta'), () => 
    console.log(`Escutando na porta ${app.get('porta')}`)
)