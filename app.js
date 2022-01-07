const express = require('express')
const app = express()
const dotenv = require('dotenv')
//seteo de variables de entorno
dotenv.config({path: '.env'})

//llamada al router
app.get('/', require('./router/router'))

//carpeta publica
app.use(express.static('public'))

// motor de plantillas
app.set('view engine','ejs')


app.listen(process.env.PORT, ()=>{
    console.log('SERVIDOR INICIADO EN: https://localhost:'+process.env.PORT)
})