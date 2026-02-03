import express from "express";
import bcrypt from "bcryptjs";   // 👈 IMPORTANT CHANGE

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const [rows] = await req.db.query(
      "SELECT id, email, password FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR FULL:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;