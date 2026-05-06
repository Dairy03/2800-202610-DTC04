import Business from "../models/business.js";

async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }
    if (password.length < 8) {
      return res.status(400).send("Password must be at least 8 characters");
    }

    const exists = await Business.findOne({ username });
    if (exists) {
      return res.status(409).send("Username already registered");
    }

    const user = await Business.create({ username, password });
    req.session.userId = user._id;
    req.session.userType = user.role;

    res.status(201).send(`Registered and logged in as ${user.username}`);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Server error during registration");
  }
}

export { register };
