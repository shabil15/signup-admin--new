
const express = require('express')
const admin_route =express()
const config=require('../config/config')
const session = require('express-session')
const nocache= require('nocache')
admin_route.use(session({
  secret:config.sessionSecret,
  resave: true,
  saveUninitialized: true}))
admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin') 

const adminAuth= require('../middleware/adminAuth')

admin_route.use(express.json())
admin_route.use(express.urlencoded({extended:true}));
admin_route.use(nocache());




const adminController =require('../controllers/adminController') 

admin_route.get('/',adminAuth.isLogout,adminController.LoadLogin) 

admin_route.post('/',adminController.verifyLogin)

admin_route.get('/dashboard',adminAuth.isLogin,adminController.loadDashboard)   

admin_route.get('/logout',adminController.logout)

admin_route.get ('/new-user',adminAuth.isLogin,adminController.newUserLoad)

admin_route.post ('/new-user',adminAuth.isLogin,adminController.addUser)

admin_route.get('/edit-user',adminAuth.isLogin,adminController.editUser)
 
admin_route.post('/edit-user',adminController.updateUser)

admin_route.get('/delete-user',adminController.deleteUser)


// admin_route.get('*',(req,res)=>res.redirect('/admin/dashboard')) 
   
  
module.exports = admin_route  


 