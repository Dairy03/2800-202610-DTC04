function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).send("Unauthorized request");
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (roles.includes(req.session?.userType)) {
      return next();
    }
    res.status(403).send("Forbidden");
  };
}

export { requireAuth, requireRole };
