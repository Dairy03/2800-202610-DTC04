import User from "../models/user.js";

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

async function login(req, res) {
  try {
    const { email, password } = req.body;

    console.log("Email from request:", JSON.stringify(email));
    console.log("Password from request:", JSON.stringify(password));

    if (!email || !password) {
      return res.status(400).send({
        message: "Username and password are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .send({ message: "Invalid username or password", success: false });
    }

    req.session.regenerate((err) => {
      if (err) {
        console.error("Session regenerate error:", err);
        return res
          .status(500)
          .send({ message: "Server error during login", success: false });
      }
      req.session.userId = user._id;
      req.session.userType = user.userType;
      // if (rememberMe) {
      //   req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30;
      // } else {
      //   req.session.cookie.maxAge = null;
      // }
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30;
      const { password: _, ...userWithoutPassword } = user.toObject();
      res.status(201).send({
        success: true,
        message: "Successful login!",
        user: userWithoutPassword,
      });
    });
  } catch (err) {
    console.error("Login error:", err);
    res
      .status(500)
      .send({ message: "Server error during login", success: false });
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

async function me(req, res) {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send({ status: false, message: "User not found" });
    }
    res.send({
      status: true,
      message: `Authenticated as ${user.username} (id: ${user._id})`,
      user,
    });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).send({ status: false, message: "Server error during me" });
  }
}

async function updateUser(req, res) {
  try {
    const allowedFields = [
      "fName",
      "lName",
      "email",
      "tutorial_toggle",
      "totalSaved",
      "dealsClaimed",
      "totalClaimed",
      "pendingDeals",
      "wastePrevented",
    ];
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { $set: updates },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).send("Server error");
  }
}

export { unregister, login, logout, me, updateUser };
