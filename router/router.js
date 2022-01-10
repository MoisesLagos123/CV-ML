const express = require('express')
const router = express.Router();
const session = require('express-session')



router.post('contact-form', (req, res)=>{

})

//Vista principal
router.get('/', (req,res)=>{
    res.render('index')
})


//vista al proyecto N1
router.get('/gestionactividades', (req,res)=>{
    res.render('proyectos/gestionactividades')
})



module.exports = router