import User from "../models/user.js";

async function registerCustomer(req, res) {
  try {
    const { fName, lName, username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({
        success: false,
        message: "Username and password are required",
      });
    }
    if (password.length < 8) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res
        .status(409)
        .send({ success: false, message: "Username already registered" });
    }

    await User.create({ fName, lName, username, email, password });

    res.status(201).send({
      success: true,
      message: `Registration successful`,
    });
  } catch (err) {
    console.error("Register error:", err);
    res
      .status(500)
      .send({ success: false, message: "Server error during registration" });
  }
}

export { registerCustomer };
