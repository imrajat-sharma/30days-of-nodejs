exports.isAuth = (req, res, next) => {
    if (req.session && req.session.isAuth){
        next()
    } else {
        res.status(401).json({ message: "Unauthorized access!"})
    }
}