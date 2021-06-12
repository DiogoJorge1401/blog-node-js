const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/categoria");
const categoria = mongoose.model("Categorias");
require("../models/postagem");
const postagem = mongoose.model("Postagens");
const { eAdmin } = require("../helpers/eAdmin");
const { Usu } = require("../helpers/eAdmin");


router.get("/", (req, res) => {
  postagem
    .find()
    .lean()
    .populate("categoria")
    .sort({ data: "desc" })
    .then((postagem) => {
      res.render("admin/index", { postagem: postagem });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro interno");
      res.redirect("/404");
    });
});

router.get("/404", (req, res) => {
  res.send("Erro 404");
});
/***********************************************
 Categorias Inicio
*/
router.get("/admin/categorias", eAdmin, (req, res) => {
  categoria
    .find()
    .lean()
    .sort({ date: "asc" })
    .then((categorias) => {
      res.render("admin/categorias", { categorias: categorias });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar as categorias");
      res.redirect("/");
    });
});

router.get("/admin/categorias/add", eAdmin, (req, res) => {
  res.render("admin/addcategorias");
});
router.post("/admin/categorias/nova", eAdmin, (req, res) => {
  let erros = [];

  if (!req.body.nome || req.body.nome === "") {
    erros.push({ texto: "Nome inválido" });
  }
  if (!req.body.slug || req.body.slug === "") {
    erros.push({ texto: "Slug inválido" });
  }
  if (req.body.nome.length < 2) {
    erros.push({ texto: "Nome muito pequeno" });
  }
  if (erros.length > 0) {
    res.render("admin/addcategorias", { erros: erros });
  } else {
    const novaCategorias = {
      nome: req.body.nome,
      slug: req.body.slug,
    };
    new categoria(novaCategorias)
      .save()
      .then(() => {
        req.flash("success_msg", "Categoria criada com sucesso");
        res.redirect("/admin/categorias");
      })
      .catch((erro) => {
        req.flash("error_msg", "Erro ao criar categoria");
        res.redirect("/admin/categorias");
      });
  }
});

router.get("/admin/categorias/editar/:id", eAdmin, (req, res) => {
  categoria
    .findOne({ _id: req.params.id })
    .lean()
    .then((categoria) => {
      res.render("admin/editarcategorias", { categoria: categoria });
    })
    .catch((err) => {
      req.flash("error_msg", "Esta categoria não existe");
      res.redirect("/admin/categorias");
    });
});

router.post("/admin/categorias/edit", eAdmin, (req, res) => {
  categoria
    .findOne({ _id: req.body.id })
    .then((categoria) => {
      categoria.nome = req.body.nome;
      categoria.slug = req.body.slug;
      categoria
        .save()
        .then(() => {
          req.flash("success_msg", "Categoria edita com sucesso!");
          res.redirect("/admin/categorias");
        })
        .catch((err) => {
          req.flash("error_msg", "Houve um erro ao salvar a categoria");
          res.redirect("/admin/categorias");
        });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro");
      res.redirect("/admin/categorias");
    });
});

router.post("/admin/categorias/remover", eAdmin, (req, res) => {
  categoria
    .deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Categoria removida com sucesso!");
      res.redirect("/admin/categorias");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao remover a categoria");
      res.redirect("/admin/categorias");
    });
});

router.get("/categorias", Usu, (req, res) => {
  categoria
    .find()
    .lean()
    .then((categorias) => {
      res.render("categorias/index", { categorias: categorias });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar as categorias");
      res.redirect("/");
    });
});

router.get("/categorias/:slug", Usu, (req, res) => {
  categoria
    .findOne({ slug: req.params.slug })
    .lean()
    .then((categoria) => {
      if (categoria) {
        postagem
          .find({ categoria: categoria._id })
          .lean()
          .then((postagem) => {
            res.render("categorias/postagens", {
              postagem: postagem,
              categoria: categoria,
            });
          })
          .catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar os posts!");
            res.redirect("/");
          });
      } else {
        req.flash("error_msg", "Esta categoria nao existe");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash(
        "error_msg",
        "Houve um erro ao carregar a pagina desta categoria",
        err
      );
      res.redirect("/");
    });
});

/*
 Categorias Fim
************************************************/

/************************************************
 Postagens Inicio
*/
router.get("/postagens", eAdmin, (req, res) => {
  postagem
    .find()
    .lean()
    .populate("categoria")
    .sort({ data: "desc" })
    .then((postagens) => {
      res.render("admin/postagens", { postagens: postagens });
    })
    .catch((error) => {
      req.flash("error_msg", "Houve um erro ao listar as postagens");
      res.render("/postagens");
    });
});

router.get("/postagens/add", eAdmin, (req, res) => {
  categoria
    .find()
    .lean()
    .then((categoria) => {
      res.render("admin/addpostagem", { categoria: categoria });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar o formulário");
      res.redirect("/");
    });
});

router.post("/postagens/nova", eAdmin, (req, res) => {
  let erros = [];

  if (req.body.categoria == "0") {
    erros.push({ texto: "Categoria invalida registre uma categoria" });
  }
  if (erros.length > 0) {
    res.render("admin/addpostagem", { erros: erros });
  } else {
    const novaPostagem = {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      conteudo: req.body.conteudo,
      categoria: req.body.categoria,
      slug: req.body.slug,
    };

    new postagem(novaPostagem)
      .save()
      .then(() => {
        req.flash("success_msg", "Postagem criada com sucesso!");
        res.redirect("/postagens");
      })
      .catch((err) => {
        req.flash("error_msg", "Houve um erro ao salvar a postagem!");
        res.redirect("/postagens");
      });
  }
});

router.get("/admin/postagens/edit/:id", eAdmin, (req, res) => {
  postagem
    .findOne({ _id: req.params.id })
    .lean()
    .then((postagem) => {
      categoria
        .find()
        .lean()
        .then((categoria) => {
          res.render("admin/editpostagens", {
            categoria: categoria,
            postagem: postagem,
          });
        })
        .catch((err) => {
          req.flash("error_msg", "Houve um erro ao listar as categorias");
          res.redirect("/postagens");
        });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar o formulário", err);
      res.redirect("/postagens");
    });
});

router.post("/postagens/edit", eAdmin, (req, res) => {
  postagem
    .findOne({ _id: req.body.id })
    .then((postagem) => {
      postagem.titulo = req.body.titulo;
      postagem.slug = req.body.slug;
      postagem.descricao = req.body.descricao;
      postagem.conteudo = req.body.conteudo;
      postagem.categoria = req.body.categoria;
      postagem.data = new Date()

      postagem
        .save()
        .then(() => {
          req.flash("success_msg", "Postagem editada com sucesso!");
          res.redirect("/postagens");
        })
        .catch((err) => {
          req.flash("error_msg", "Erro interno", err);
          res.redirect("/postagens");
        });
    })
    .catch((err) => {
      console.log(err);
      req.flash("error_msg", "Houve um erro ao salvar a edição", err);
      res.redirect("/postagens");
    });
});

router.post("/postagens/deletar", eAdmin, (req, res) => {
  postagem
    .deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Postagem removida com sucesso!");
      res.redirect("/postagens");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao remover a postagem");
      res.redirect("/postagens");
    });
});

router.get("/postagens/:slug", Usu, (req, res) => {
  postagem
    .findOne({ slug: req.params.slug })
    .lean()
    .then((postagem) => {
      if (postagem) {
        res.render("postagem/index", { postagem: postagem });
      } else {
        req.flash("error_msg", "Esta postagem não existe");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "Erro interno");
      res.redirect("/");
    });
});

/*
 Postagens Fim
************************************************/
module.exports = router;
