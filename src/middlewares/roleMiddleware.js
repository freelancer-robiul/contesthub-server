// src/middlewares/roleMiddleware.js

/**
 * requireRole(...roles)
 * Example:
 *   router.post("/contests", protect, requireRole("creator"), handler)
 *   router.patch("/users/:id/role", protect, requireRole("admin"), handler)
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: you do not have permission to perform this action",
      });
    }

    next();
  };
};
