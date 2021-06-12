const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/usuario");
const Usuario = mongoose.model("Usuario");
const bcryptjs = require("bcryptjs");
const passport = require("passport");


router.get("/registro", (req, res) => {
    res.render("usuarios/registro");
});

router.post("/verificacao", (req, res) => {
    let erro = [];

    if (req.body.senha.length < 8) {
        erro.push({ texto: "A senha deve ter no minímo 8 caracteres" });
    }
    if (req.body.senha !== req.body.senha2) {
        erro.push({ texto: "As senhas são diferentes, tente novamente" });
    }
    if (erro.length > 0) {
        res.render("usuarios/registro", { erro: erro });
    } else {
        Usuario
            .findOne({ email: req.body.email })
            .lean()
            .then((usuario) => {
                if (usuario) {
                    req.flash(
                        "error_msg",
                        "Ja existe uma conta com este e-mail no nosso sistema"
                    );
                    res.redirect("/registro");
                } else {
                    const novoUsuario = new Usuario({
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha,
                    });

                    bcryptjs.genSalt(10, (erro, salt) => {
                        bcryptjs.hash(novoUsuario.senha, salt, (erro, hash) => {
                            if (erro) {
                                req.flash(
                                    "error_msg",
                                    "Houve um erro durante o salvamento do usuario"
                                );
                                res.redirect("/");
                            }
                            novoUsuario.senha = hash


                            novoUsuario
                                .save()
                                .then(() => {
                                    req.flash("success_msg", 'Usuário criado com sucesso')
                                    res.redirect('/')
                                })
                                .catch(err => {
                                    req.flash(
                                        "error_msg",
                                        "Houve um erro ao criar o usuario, tente novamente"
                                    );
                                    res.redirect("/");
                                })
                        });
                    });
                }
            })
            .catch((err) => {
                req.flash("error_msg", "Houver um erro interno",err);
                res.redirect("/");
            });
    }
});

router.get('/login',(req,res)=>{
    res.render('usuarios/login')
})

router.post('/usuarios/login',(req,res,next)=>{

    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash:true
    })(req,res,next)


})

router.get('/deslogar',(req,res)=>{
    req.logout()
    req.flash('success_msg','Deslogado com sucesso!')
    res.redirect('/')
})

module.exports = router;
