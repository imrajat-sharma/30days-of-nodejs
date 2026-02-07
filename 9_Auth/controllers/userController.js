const welcomeMessage = (req, res) => {
  res.status(200).render("users", { title: "User Management", message: "Welcome to the User Management Page!", user: req.user });
};

module.exports = { welcomeMessage };
