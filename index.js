//Biblioteca Express

const express = require("express");
const app = express();
app.use(express.json());

//Permissões
var cors = require('cors');
const bodyParser = require("body-parser");
app.use(cors());

//Porta
app.listen(process.env.PORT || 3000);

// Introdução
app.get('/',
    (req,res) => {
        res.send("Atividade 7 - Backend - Marcos Roberto")
    }
);

let myBooks = [ 
    {title: "Cristianismo Puro e Simples", author: "Clive Staples Lewis", originalYearOfPublication: 1952},
    {title: "Não Tenho Fé Suficiente Para Ser Ateu", author: "Norman L. Geisler and Frank Turek", originalYearOfPublication: 2004},
    {title: "Ciência e religião: Fundamentos para o diálogo", author: "Alister McGrath", originalYearOfPublication: 1999},
    {title: "A evolução e a queda: Implicações da ciência moderna para a teologia cristã", author:"James K. A. Smith and William T. Cavanaugh", originalYearOfPublication: 2017}
];

//Usando Get para obter o Array de Objects myBooks Completo
app.get('/books',
    (req,res) => {
        res.send(myBooks);
    }    
);
//Usando Get para obter as informações contidas no myBooks[id] com título, autor e publicação do livro
app.get('/books/:id',
    (req,res) => {
        const id = req.params.id - 1;
        const book = myBooks[id];
        if(!book){
            res.send("Livro não encontrado.");
        } else {
            res.send(myBooks[id]);
        }
    }
);
//Inserindo um livro com Post
app.post('/books',
    (req, res) => {
        console.log(req.body);
        myLivro = req.body;
        myBooks.push(myLivro);
        res.send("Livro inserido com sucesso.");
    }
);
//Alterando um livro com Put
app.put('/books/:id',
    (req, res) => {
        const id = req.params.id - 1;
        myLivro = req.body;
        myBooks[id] = myLivro;
        res.send("Livro atualizado com sucesso.");
    }
);
//Alterando um título específico com Put
app.put('/books/title/:id',
    (req, res) => {
        const id = req.params.id - 1;
        title = req.body.title;
        myBooks[id].title = title;
        res.send("Título alterado com sucesso.");
    }
);
//Deletando um livro com Delete
app.delete('/books/:id',
    (req,res) => {
        const id = req.params.id - 1;
        delete myBooks[id];
        res.send("Livro deletado com sucesso.");
    }
);
//Deletando um título específico com Delete
app.delete('/books/title/:id',
    (req,res) => {
        const id = req.params.id - 1;
        delete myBooks[id].title;
        res.send("Título deletado com sucesso");
    }
);

// Utilizando MongoDB

const mongodb = require('mongodb');
const password = process.env.PASSWORD|| "Senha não enviada";
console.log(password);

const connectionString = `mongodb+srv://admin:${password}@cluster0.xsnlh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

(async()=>{
    const client = await mongodb.MongoClient.connect(connectString, options);
    const db = client.db('myFirstDateBase');
    const myBooks = db.collection('myBooks');
    console.log(await myBooks.find({}).toArray());


    app.get('/database',
    async function(req, res){
    res.send(await myBooks.find({}).toArray());}
    );

    app.get('/database/:id',
        async function(req, res){
            const id = req.params.id;
            const myBooks = await myBooks.findOne(
                {_id: mongodb.ObjectID(id)}
            );
            console.log(myBooks);
            if(!myBooks){
                res.send("myBooks não encontrado");
            } else {
                res.send(myBooks);
            }
        }
    );

    app.post('/database',
        async (req, res) => {
            console.log(req.body);
            const myBook = req.body;

            delete myBook["_id"];

            myBooks.insertOne(myBook);
            res.send("Livro criado");
        }
    );

    app.put('/database/:id',
        async (req, res) =>{
            const id = req.params.id;
            const myBook = req.body;

            console.log(myBook);

            delete myBook["_id"];

            const num_myBooks = await myBooks.countDocuments({_id : mongodb.ObjectID(id)});
            
            if (num_myBooks !== 1) {
                res.send("Ocorreu um erro por conta do número de livros");
                return;
            }

            await myBooks.updateOne({_id : mongodb.ObjectID(id)},
            {$set : myBook}
            );

            res.send("Livro atualizado com sucesso.")
        }
    );

    app.delete('/database/:id',
        async (req, res) => {
            const id = req.params.id;

            await myBooks.deleteOne({_id : mongodb.ObjectID(id)});

            res.send("Livro removido com sucesso");
        }
    );
    
})();