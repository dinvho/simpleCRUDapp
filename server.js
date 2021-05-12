const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2021
require('dotenv').config()

let db,
    dbConnecttionStr = process.env.DB_STRING,
    dbName = 'todo'

MongoClient.connect(dbConnecttionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(error => console.log(error))

    app.set('view engine', 'ejs')
    app.use(express.static('public'))
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    
    app.get('/', async (req, res)=> {
        const todoItems = await db.collection('todos').find().toArray()
        const itemsLeft = await db.collection('todos').countDocuments({
            completed: false
        })
        res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
    })

    app.post('/createTodo', (req, res)=>{
        db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
        .then(result=> {
            console.log('Todo +1')
            res.redirect('/')
        })
    })

    app.delete('/deleteTodo', (req, res)=> {
        db.collection('todos').deleteOne({'todo': req.body.rainbowUnicorn})
        .then(result => {
            console.log('Deleted Todo')
            res.json('Deleted It')
        })
        .catch(err=> console.log(err))
    })

    app.put('/markComplete', (req,res)=> {
        db.collection('todos').updateOne({'todo': req.body.rainbowUnicorn}, {
            $set: {
                completed: true
            }
        })
        .then(result => {
            console.log('Marked Complete')
            res.json('Marked Complete')
        })
    })

    app.put('/undo', (req,res)=> {
        db.collection('todos').updateOne({'todo': req.body.rainbowUnicorn}, {
            $set: {
                completed: false
            }
        })
        .then(result => {
            console.log('Marked Complete')
            res.json('Marked Complete')
        })
    })

app.listen( process.env.PORT || PORT, ()=> {
    console.log('Server is running, better go catch it!')
})

