const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "secret";
const auth = async (req, res, next) => {
    if(!req.cookies){
        return res.redirect('/login')
    }
  //use the token from cookies
  const token = req.cookies.token;

  //if there is no token, return an error
  if (!token) {
    return res.redirect("/login");
  }
  //verify the token
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect("/login");
  }
};

module.exports = auth;
