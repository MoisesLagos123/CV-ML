const express = require('express')
const router = express.Router();
const session = require('express-session')

//Vista principal
router.get('/', (req,res)=>{
    res.render('index')
})

//Contacto
router.get('/contact', (req,res)=>{
    res.render('forms/contact')
})


//vista al proyecto N1
router.get('/gestionactividades', (req,res)=>{
    res.render('proyectos/gestionactividades')
})




module.exports = router