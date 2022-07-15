const fs = require("fs");
const path = require("path");

const authController = {
  // Tela para cadastro do usuário
  register: (req, res) => {
    return res.render("register", {
      title: "Cadastro",
      user: req.cookies.user,
      admin: req.cookies.admin,
    });
  },
  // Processamento do cadastro do usuário
  create: (req, res) => {
    const usersJson = fs.readFileSync(
      // Caminho do arquivo
      path.join(__dirname, "..", "data", "users.json"),
      // Formato de leitura
      "utf-8"
    );
    const users = JSON.parse(usersJson);

    const { nome, sobrenome, apelido, email, senha, confirmar_senha } =
      req.body;
    // VALIDAÇÕES
    // TODO: Verificiarem se o email existe
    // TODO: Verificiarem se a senha é maior que 8 caracters
    if (
      !nome ||
      !sobrenome ||
      !apelido ||
      !email ||
      !senha ||
      !confirmar_senha
    ) {
      return res.render("register", {
        title: "Cadastro",
        error: {
          message: "Preencha todos os campos",
        },
      });
    }
    if (senha !== confirmar_senha) {
      return res.render("register", {
        title: "Cadastro",
        error: {
          message: "Senhas não coincidem",
        },
      });
    }
    const newId = users[users.length - 1].id + 1;
    // Objeto com dados do novo usuário
    const newUser = {
      id: newId,
      nome,
      sobrenome,
      apelido,
      senha,
      email,
      admin: false,
      criadoEm: new Date(),
      modificadoEm: new Date(),
    };

    users.push(newUser);
    fs.writeFileSync(
      // Caminho e nome do arquivo que será criado/atualizado
      path.join(__dirname, "..", "data", "users.json"),
      // Conteúdo que será salvo no arquivo
      JSON.stringify(users)
    );
    res.redirect("/");
  },
  // Tela para realizar login
  login: (req, res) => {
    return res.render("login", {
      title: "Login",
      user: req.cookies.user,
      admin: req.cookies.admin,
    });
  },
  // Processamento do login
  auth: (req, res) => {
    res.clearCookie("user");
    res.clearCookie("admin");

    const usersJson = fs.readFileSync(
      path.join(__dirname, "..", "data", "users.json"),
      "utf-8"
    );

    const users = JSON.parse(usersJson);

    const { email, senha } = req.body;
    const userAuth = users.find((user) => {
      if (user.email === email) {
        if (user.senha === senha) {
          return true;
        }
      }
    });

    if (!userAuth) {
      return res.render("login", {
        title: "Login",
        error: {
          message: "Email ou senha inválido",
        },
      });
    }
    // Filtra as chaves que o objeto irá ter
    const user = JSON.parse(
      JSON.stringify(userAuth, ["id", "nome", "sobrenome", "apelido", "admin"])
    );
    req.session.email = userAuth.email;
    res.cookie("user", user);
    res.cookie("admin", user.admin);

    res.redirect("/");
  },
  // Processamento do deslogar
  logout: (req, res) => {
    req.session.destroy();
    res.clearCookie("user");
    res.clearCookie("admin");
    res.redirect("/");
  },
};

module.exports = authController;
