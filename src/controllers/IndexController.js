const indexController = {
  home: (req, res) => {
    console.log(req.session.email);
    return res.render("index", {
      title: "Home",
      user: req.cookies.user,
      admin: req.cookies.admin,
    });
  },
};

module.exports = indexController;
