const { addNewHome } = require("../services/addHome.service");

const addHome = async (req, res, next) => {
  try {
    await addNewHome(req.body);
    res.redirect("/listings?added=true");
  } catch (error) {
    next(error);
  }
};

module.exports = { addHome };
