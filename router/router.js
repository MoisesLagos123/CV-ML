const express = require('express')
const router = express.Router();
const session = require('express-session')


router.get('/', (req,res)=>{
    res.render('index')
})

router.get('/gestionactividades', (req,res)=>{
    res.render('proyectos/gestionactividades')
})

module.exports = router