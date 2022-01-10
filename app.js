const express = require('express')
const app = express()
const dotenv = require('dotenv')


//configurar node para que procese los datos de formularios
app.use(express.urlencoded({extended:true}))
app.use(express.json())

//seteo de variables de entorno
dotenv.config({path: '.env'})

//llamada al router
app.use('/', require('./router/router'))

//carpeta publica
app.use(express.static('public'))

// motor de plantillas
app.set('view engine','ejs')

       



app.listen(process.env.PORT, ()=>{
    console.log('SERVIDOR INICIADO EN: https://localhost:'+process.env.PORT)
})