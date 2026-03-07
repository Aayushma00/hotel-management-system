import express from "express";
import pool from "../config/db.js";

const router = express.Router();

/* GET all customers */
router.get("/", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT 
        id,
        first_name,
        last_name,
        email,
        phone,
        nationality,
        id_proof_number,
        created_at
      FROM customers
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Customer fetch error:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});
router.post("/", async (req, res) => {

  try {

    const {
      first_name,
      last_name,
      email,
      phone,
      nationality,
      id_proof_number
    } = req.body;

    const result = await pool.query(
      `INSERT INTO customers
      (first_name, last_name, email, phone, nationality, id_proof_number)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [first_name, last_name, email, phone, nationality, id_proof_number]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: "Failed to create customer" });

  }

});
export default router;