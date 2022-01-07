const express = require('express')
const app = express()
//llamada al router
app.get('/', require('./router'))
//carpeta publica
app.use(express.static('public'))
// motor de plantillas
app.set('view engine','ejs')
app.listen(3000, ()=>{
    console.log('SERVIDOR INICIADO EN: http://localhost:3000')
})