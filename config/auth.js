const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

// Model de usuário
require("../models/usuario");
const Usuario = mongoose.model("Usuario");

module.exports = (passport) => {
  passport.use(
    new localStrategy({ usernameField: "email",passwordField:'senha'}, (email, senha, done) => {
        Usuario.findOne({email: email})
        .then((usuario)=>{
            if(!usuario){
                return done(null,false,{message:'Esta conta não existe'})
            }

            bcryptjs.compare(senha,usuario.senha,(erro,bater)=>{
                if(bater){
                    return done(null,usuario)
                }
                else{
                    return done(null,false,{message:'Senha incorreta'})
                }
            })
        })
    })
  );


  passport.serializeUser((usuario,done)=>{
    done(null,usuario.id)
  })

  passport.deserializeUser((id,done)=>{
      Usuario.findById(id,(err,usuario)=>{
          done(err,usuario)
      })
  })

};
