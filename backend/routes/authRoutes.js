import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const JWT_SECRET = "supersecretkey";

/* ===============================
   REGISTER USER
================================= */
router.post("/register", async (req, res) => {
  try {
    console.log("🔥 Register request received");
    console.log("📦 Request body:", req.body);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      console.log("❌ Missing fields");
      return res.status(400).json({
        error: "All fields (name, email, password, role) are required"
      });
    }

    if (!["admin", "staff"].includes(role)) {
      console.log("❌ Invalid role:", role);
      return res.status(400).json({
        error: "Role must be either 'admin' or 'staff'"
      });
    }

    console.log("🔎 Checking if email exists...");
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log("❌ Email already exists");
      return res.status(400).json({
        error: "Email already exists"
      });
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("💾 Inserting user into database...");
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, role]
    );

    console.log("✅ User registered successfully:", result.rows[0]);

    res.json(result.rows[0]);

  } catch (err) {
    console.error("🚨 Register error:", err);
    res.status(500).json({
      error: err.message
    });
  }
});

/* ===============================
   LOGIN USER
================================= */
router.post("/login", async (req, res) => {
  try {
    console.log("🔥 Login request received");
    console.log("📦 Request body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    console.log("🔎 Checking if user exists...");
    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      console.log("❌ Invalid email");
      return res.status(400).json({
        error: "Invalid email"
      });
    }

    console.log("🔐 Comparing password...");
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!validPassword) {
      console.log("❌ Invalid password");
      return res.status(400).json({
        error: "Invalid password"
      });
    }

    console.log("🎟 Generating JWT token...");
    const token = jwt.sign(
      {
        id: user.rows[0].id,
        role: user.rows[0].role
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    console.log("✅ Login successful");

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        role: user.rows[0].role
      }
    });

  } catch (err) {
    console.error("🚨 Login error:", err);
    res.status(500).json({
      error: err.message
    });
  }
});

export default router;