require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username !== process.env.USERNAME) {
    return res.status(401).json({ message: "Invalid username" });
  }

  if (password !== process.env.PASSWORD) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return res.status(200).json({ token });
};
