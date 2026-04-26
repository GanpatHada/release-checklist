require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const defaultSteps = {
  "Code Freeze": false,
  "QA Testing": false,
  "Security Review": false,
  "Backup Database": false,
  "Deploy Staging": false,
  "Smoke Test": false,
  "Production Deploy": false,
  "Monitor Logs": false,
};

function getStatus(steps) {
  const values = Object.values(steps);

  const completed = values.filter(Boolean).length;

  if (completed === 0) return "planned";
  if (completed === values.length) return "done";

  return "ongoing";
}

app.get("/", (req, res) => {
  res.send("Release Checklist API Running");
});

app.get("/api/releases", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM releases ORDER BY created_at DESC"
    );

    const releases = result.rows.map((release) => ({
      ...release,
      status: getStatus(release.steps),
    }));

    res.json(releases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/releases", async (req, res) => {
  try {
    const { name, date, additional_info } = req.body;

    if (!name || !date) {
      return res.status(400).json({
        error: "Name and date are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO releases (name, date, additional_info, steps)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, date, additional_info || "", JSON.stringify(defaultSteps)]
    );

    const release = result.rows[0];

    res.status(201).json({
      ...release,
      status: getStatus(release.steps),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/releases/:id/steps", async (req, res) => {
  try {
    const { id } = req.params;
    const { stepName, value } = req.body;

    const existing = await pool.query(
      "SELECT steps FROM releases WHERE id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        error: "Release not found",
      });
    }

    const steps = existing.rows[0].steps;

    steps[stepName] = value;

    const result = await pool.query(
      `
      UPDATE releases
      SET steps = $1
      WHERE id = $2
      RETURNING *
      `,
      [JSON.stringify(steps), id]
    );

    const release = result.rows[0];

    res.json({
      ...release,
      status: getStatus(release.steps),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/releases/:id/info", async (req, res) => {
  try {
    const { id } = req.params;
    const { additional_info } = req.body;

    const result = await pool.query(
      `
      UPDATE releases
      SET additional_info = $1
      WHERE id = $2
      RETURNING *
      `,
      [additional_info, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Release not found",
      });
    }

    const release = result.rows[0];

    res.json({
      ...release,
      status: getStatus(release.steps),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/releases/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM releases WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Release not found",
      });
    }

    res.json({
      message: "Release deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});