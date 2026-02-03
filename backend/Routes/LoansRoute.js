import express from "express";

const router = express.Router();

/*
Example statuses mapping:
New   -> new
Old   -> old
BP    -> bp
PTP   -> ptp
Done  -> done
*/

router.get("/:status", async (req, res) => {
  try {
    const { status } = req.params;

    const [loans] = await req.db.query(
      `SELECT 
        id,
        loan_id,
        client_name,
        phone,
        amount,
        balance,
        status,
        created_at
      FROM loans
      WHERE status = ?
      ORDER BY created_at DESC`,
      [status.toLowerCase()]
    );

    res.json({
      success: true,
      loans
    });

  } catch (err) {
    console.error("Loans fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch loans"
    });
  }
});

export default router;