import express from "express";

const router = express.Router();

router.get("/new", async (req, res) => {
  try {
    const [loans] = await req.db.query(
      `SELECT 
        id,
        loan_number,
        customer_id,
        amount,
        total_balance,
        payment_status,
        days_overdue,
        created_at
      FROM loans
      WHERE status = 'approved'
      ORDER BY created_at DESC
      LIMIT 7`
    );

    res.json({ success: true, loans });
  } catch (err) {
    console.error("Loans fetch error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
