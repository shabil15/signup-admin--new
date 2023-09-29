
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
// const randomstring = require('randomstring')
// const config =require('../config/config')

const LoadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_admin === 0) {
          res.render("login", { message: "Email or password incorrect" });
        } else {
          req.session.admin_id = userData._id;
          res.redirect('/admin/dashboard')
        } 
      } else { 
        
        res.redirect("/login?message=Email or Password incorrect" );
      }
    } else {
      res.redirect("/login?message=Email or Password incorrect" );
    }
  } catch (error) {
    console.log(error.message);
  }
};




const loadDashboard = async (req,res)=>{
  try {
     var search =''
     if(req.query.search){
      search = req.query.search
     }
    const userData = await User.find({
      is_admin:0,
      $or:[
        {name:{$regex:'.*'+search+'.*',$options:'i'}},  
        {email:{$regex:'.*'+search+'.*',$options:'i'}},
        {mobile:{$regex:'.*'+search+'.*'}},
        
      
      ]
    })

  
    res.render('dashboard' ,{users:userData})
  } catch (error) {
    console.log(error.message);
  }
}



const newUserLoad = async (req,res)=>{
  try {
    res.render('new-user')
  } catch (error) {
    console.log(error.message);
  }
}

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const addUser = async (req,res)=>{
  try {
     const name= req.body.name;
     const email= req.body.email;
     const mobile= req.body.mobile;
    //  const password= randomstring.generate(8);
    const password = req.body.password;

    // const spassword = await securePassword(password)

    const user= new User({
      name:name,
      email:email,
      mobile:mobile,
      password: password,
      is_admin:0,
     });

     const userData =await user.save();

     if(userData){
      res.redirect('/admin/dashboard')
     }else{
      res.render('new-user',{message:"Something went wrong"})
     }
  } catch (error) {
    console.log(error.message);
  }
}


const editUser= async (req,res)=>{
  try {
    const id= req.query.id;
    const userData= await User.findById({_id:id})
    if(userData){
      res.render('edit-user',{user:userData});

    }else{
      res.redirect('/admin/dashboard')
    }
    
  } catch (error) {
    console.log(error.message);
  }
}


const updateUser = async (req,res)=>{
  try {
    const userData= await User.findByIdAndUpdate(
      {_id:req.body.id},
      {
        $set:{
      name:req.body.name,
      email:req.body.email, 
      mobile:req.body.mobile 
    }})

    res.redirect("/admin/dashboard")
  } catch (error) {
    console.log(error.message); 
  }  
} 


const deleteUser = async (req,res)=>{
  try {
    
    const id = req.query.id;
    await User.deleteOne({_id:id})
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.log(error.message);
  }
}

const logout = async (req,res)=>{
  try {
   
    req.session.destroy((err)=>{
      if(err) {
        console.log(error.message);
      }else{
        res.redirect('/admin')
      }
    });
  } catch (error) {
    console.log(error.message);
  } 
}
 
module.exports = {
  LoadLogin,
  verifyLogin,
  loadDashboard,
  logout,
  newUserLoad,
  addUser,
  editUser,
  updateUser,
  deleteUser
};