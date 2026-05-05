import User from "../models/user.js";

async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }
    if (password.length < 8) {
      return res.status(400).send("Password must be at least 8 characters");
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).send("Username already registered");
    }

    const user = await User.create({ username: username, password });
    req.session.userId = user._id;

    res.status(201).send(`Registered and logged in as ${user.username}`);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Server error during registration");
  }
}

async function unregister(req, res) {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    await user.deleteOne();

    await req.session.destroy((err) => {
      if (err) console.error("Session destroy error:", err);
      res.clearCookie("connect.sid");
      res.send(`Account deleted successfully (id: ${user._id})`);
    });
  } catch (err) {
    console.error("Unregister error:", err);
    res.status(500).send("Server error during unregistration");
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send("Invalid username or password");
    }

    req.session.regenerate((err) => {
      if (err) {
        console.error("Session regenerate error:", err);
        return res.status(500).send("Server error during login");
      }
      req.session.userId = user._id;
      res.send(`Logged in as ${user.username}`);
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error during login");
  }
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Server error during logout");
    }
    res.clearCookie("connect.sid");
    res.send("Logged out");
  });
}

async function me(req, res) {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(`Authenticated as ${user.username} (id: ${user._id})`);
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).send("Server error during me");
  }
}

export { register, unregister, login, logout, me };
