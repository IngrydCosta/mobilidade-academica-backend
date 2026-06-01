import express from 'express';

const app = express()

const users = []

app.post('/CadastroUtilizador', (req, res) => {

    console.log(req)

  res.send('post está ok')
})

app.get('/CadastroUtilizador', (req, res) => {

    res.send('depois substituo essa frase')
})

app.listen(3000)