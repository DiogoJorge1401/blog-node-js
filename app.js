// Carregando Módulos
const express = require("express");
const handlebars = require("express-handlebars");
const bodyparser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require('./models/postagem')
const usuario = require("./routes/usuario");
const passport = require("passport")
require('./config/auth')(passport)
const db = require('./config/db')

//Configurações

// Sessão
app.use(
  session({
    secret: "cursonode",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize())
app.use(passport.session())


app.use(flash());
//Midlleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error=req.flash("error")
  res.locals.user= req.user || null
  next();
});

//Body Parser
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

//HandleBars
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect(db.mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB conectado");
  })
  .catch((error) => {
    console.log("Erro ao se conectar: ", error);
  });

//Public
app.use(express.static(path.join(__dirname, "public")));

//Navegação Usuario
app.get('/',admin);
app.get('/404',admin)
app.get("/admin/categorias", admin);
app.get("/admin/categorias/add", admin);
app.post("/admin/categorias/nova", admin);
app.get("/admin/categorias/editar/:id", admin);
app.post("/admin/categorias/edit", admin);
app.post("/admin/categorias/remover", admin);
app.get('/categorias',admin)
app.get('/categorias/:slug',admin)

app.get('/postagens',admin)
app.get('/postagens/add',admin)
app.post('/postagens/nova',admin)
app.get('/admin/postagens/edit/:id',admin)
app.post('/postagens/edit',admin)
app.post('/postagens/deletar',admin)
app.get('/postagens/:slug',admin)
//////////////////////////////////////////////

app.get('/registro',usuario)
app.post('/verificacao',usuario)
app.get('/login',usuario)
app.post('/usuarios/login',usuario)
app.get('/deslogar',usuario)

//Outros
const PORT = process.env.PORT ||3000;
app.listen(PORT, () => {
  console.log("Server ON");
});
