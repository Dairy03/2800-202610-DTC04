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
      return res.status(404).send("User not found");
    }
    res.send(`Authenticated as ${user.username} (id: ${user._id})`);
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).send("Server error during me");
  }
}

export { unregister, login, logout, me };
