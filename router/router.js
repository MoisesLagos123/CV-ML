const express = require('express')
const router = express.Router();
const session = require('express-session')
const nodemailer = require ('nodemailer')




//Vista principal
router.get('/', (req,res)=>{
    res.render('index')
})


//vista al proyecto N1
router.get('/gestionactividades', (req,res)=>{
    res.render('proyectos/gestionactividades')
})


router.post('/contact', async (req, res)=>{
    const {name, email, subject, message} = req.body

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth:{
            user: 'portafolio.moises.lagos.f@gmail.com',
            pass: 'obmvlgnddbyabrkd',
        },
        tls:{
            rejectUnauthorized: false
        }
    })
    await transporter.sendMail({
        from:  'portafolio.moises.lagos.f@gmail.com',
        to: 'moises.lagos.f@gmail.com',
        subject: 'Formulario de contacto CV-ML',
        text: 'hello world'
    })
    res.send('recibido')
})
module.exports = router