const authController = {
  // Tela para cadastro do usuário
  register: (req, res) => {
    return res.render("register", {
      title: "Cadastro",
    });
  },
  // Processamento do cadastro do usuário
  create: (req, res) => {},
  // Tela para realizar login
  login: (req, res) => {
    return res.render("login", {
      title: "Login",
    });
  },
  // Processamento do login
  auth: (req, res) => {},
  // Processamento do deslogar
  logout: (req, res) => {},
};

module.exports = authController;
