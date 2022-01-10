const express = require('express')
const router = express.Router();
const session = require('express-session')
const nodemailer = require ('nodemailer')
const dotenv = require('dotenv')
dotenv.config({path: '.env'})


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
        host: process.env.HOST,
        port: process.env.PORT_CORREO,
        secure: true,
        auth:{
            user: process.env.USER,
            pass: process.env.PASS,
        },
        tls:{
            rejectUnauthorized: false
        }
    })
    await transporter.sendMail({
        from:  process.env.USER,
        to: process.env.DESTINATION,
        subject: email +' '+ subject,
        text: name+': '+message
    })

    console.log()

    res.send('Mensaje Enviado')
})
module.exports = router