require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('req-body', function (req, res){
    if(req.method === "POST"){
      return JSON.stringify(req.body)
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))


app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ 
          error: 'The name or number is missing' 
        })
    }

    /*
    if(persons.find(person => person.name === body.name)){
        return response.status(400).json({ 
        error: 'Name must be unique' 
      })
    }

    const id = Math.floor(Math.random()*33333)
    const person = {
        id: id,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person);
    */

    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people <br/> ${new Date().toString()}`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 