/**
 * Student Expense Tracker - Backend (MVP)
 * Express + Mongoose
 *
 * Required env:
 * - MONGODB_URI=...
 * - PORT=5000
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ---------- Basic middleware ----------
app.use(cors());
app.use(express.json()); // parses JSON request bodies

// ---------- Env validation ----------
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "[BOOT]  Missing MONGODB_URI in .env. Backend cannot connect to MongoDB.",
  );
  process.exit(1);
}

// ---------- Mongoose connection ----------
mongoose.set("strictQuery", true);

async function connectDB() {
  try {
    console.log("[DB] Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      // options are mostly optional in newer mongoose, but safe to keep minimal
    });
    console.log("[DB]  MongoDB connected.");
  } catch (err) {
    console.error("[DB]  MongoDB connection failed.");
    console.error("[DB] Error:", err.message);
    process.exit(1);
  }
}

// Connection event logging (useful for diagnosing production issues)
mongoose.connection.on("disconnected", () => {
  console.warn("[DB]  MongoDB disconnected.");
});

mongoose.connection.on("error", (err) => {
  console.error("[DB]  MongoDB runtime error:", err.message);
});

// ---------- Schemas ----------
/**
 * Expense schema matches your frontend structure:
 * {
 *   id, title, amount, category, date
 * }
 *
 * Note: We store "date" as Date type in MongoDB.
 * The frontend uses "YYYY-MM-DD". We convert it.
 */
const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
  },
  { timestamps: true },
);

const Expense = mongoose.model("Expense", expenseSchema);

/**
 * Settings schema for storing monthly budget (and optionally daily limit).
 * Single document strategy: one settings doc.
 */
const settingsSchema = new mongoose.Schema(
  {
    monthlyBudget: { type: Number, default: 20000, min: 0 },
    dailyLimit: { type: Number, default: 500, min: 0 },
  },
  { timestamps: true },
);

const Settings = mongoose.model("Settings", settingsSchema);

// Helper: ensure we always have exactly one settings doc
async function getOrCreateSettings() {
  let doc = await Settings.findOne();
  if (!doc) {
    console.log("[SETTINGS] No settings found; creating defaults...");
    doc = await Settings.create({ monthlyBudget: 20000, dailyLimit: 500 });
    console.log("[SETTINGS]  Default settings created.");
  }
  return doc;
}

// ---------- Health check ----------
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

// ---------- Expenses routes ----------

// GET all expenses (sorted newest first)
app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("[GET /api/expenses]  Failed:", err.message);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

// POST create expense
app.post("/api/expenses", async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    // Validation with clear logs
    if (!title || !String(title).trim()) {
      console.warn("[POST /api/expenses] ⚠️ Missing title");
      return res.status(400).json({ message: "Title is required" });
    }
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      console.warn("[POST /api/expenses] ⚠️ Invalid amount:", amount);
      return res.status(400).json({ message: "Amount must be > 0" });
    }
    if (!category || !String(category).trim()) {
      console.warn("[POST /api/expenses] ⚠️ Missing category");
      return res.status(400).json({ message: "Category is required" });
    }
    if (!date) {
      console.warn("[POST /api/expenses] ⚠️ Missing date");
      return res.status(400).json({ message: "Date is required" });
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      console.warn("[POST /api/expenses] ⚠️ Invalid date:", date);
      return res.status(400).json({ message: "Invalid date" });
    }

    const created = await Expense.create({
      title: String(title).trim(),
      amount: amt,
      category: String(category).trim(),
      date: parsedDate,
    });

    console.log("[POST /api/expenses]  Expense created:", created._id);
    res.status(201).json(created);
  } catch (err) {
    console.error("[POST /api/expenses]  Failed:", err.message);
    res.status(500).json({ message: "Failed to create expense" });
  }
});

// PUT update expense
app.put("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    const updates = {};

    if (title !== undefined) updates.title = String(title).trim();
    if (amount !== undefined) updates.amount = Number(amount);
    if (category !== undefined) updates.category = String(category).trim();
    if (date !== undefined) {
      const parsedDate = new Date(date);
      if (Number.isNaN(parsedDate.getTime())) {
        console.warn("[PUT /api/expenses/:id] ⚠️ Invalid date:", date);
        return res.status(400).json({ message: "Invalid date" });
      }
      updates.date = parsedDate;
    }

    const updated = await Expense.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      console.warn("[PUT /api/expenses/:id] ⚠️ Not found:", id);
      return res.status(404).json({ message: "Expense not found" });
    }

    console.log("[PUT /api/expenses/:id] Updated:", id);
    res.json(updated);
  } catch (err) {
    console.error("[PUT /api/expenses/:id] Failed:", err.message);
    res.status(500).json({ message: "Failed to update expense" });
  }
});

// DELETE expense
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Expense.findByIdAndDelete(id);
    if (!deleted) {
      console.warn("[DELETE /api/expenses/:id] ⚠️ Not found:", id);
      return res.status(404).json({ message: "Expense not found" });
    }

    console.log("[DELETE /api/expenses/:id] Deleted:", id);
    res.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/expenses/:id] Failed:", err.message);
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

// ---------- Budget/settings routes ----------

// GET current settings (monthlyBudget, dailyLimit)
app.get("/api/settings", async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    console.error("[GET /api/settings] Failed:", err.message);
    res.status(500).json({ message: "Failed to load settings" });
  }
});

// PUT update settings
app.put("/api/settings", async (req, res) => {
  try {
    const { monthlyBudget, dailyLimit } = req.body;

    const settings = await getOrCreateSettings();

    if (monthlyBudget !== undefined) {
      const mb = Number(monthlyBudget);
      if (!Number.isFinite(mb) || mb <= 0) {
        console.warn(
          "[PUT /api/settings] ⚠️ Invalid monthlyBudget:",
          monthlyBudget,
        );
        return res.status(400).json({ message: "monthlyBudget must be > 0" });
      }
      settings.monthlyBudget = mb;
    }

    if (dailyLimit !== undefined) {
      const dl = Number(dailyLimit);
      if (!Number.isFinite(dl) || dl <= 0) {
        console.warn("[PUT /api/settings] ⚠️ Invalid dailyLimit:", dailyLimit);
        return res.status(400).json({ message: "dailyLimit must be > 0" });
      }
      settings.dailyLimit = dl;
    }

    await settings.save();
    console.log("[PUT /api/settings] Settings updated.");
    res.json(settings);
  } catch (err) {
    console.error("[PUT /api/settings] Failed:", err.message);
    res.status(500).json({ message: "Failed to update settings" });
  }
});

// ---------- Start server ----------
async function start() {
  console.log("[BOOT] Starting backend...");
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[BOOT] ✅ Server running on port ${PORT}`);
    console.log(`[BOOT] Health check: http://localhost:${PORT}/api/health`);
  });
}

start().catch((err) => {
  console.error("[BOOT] ❌ Startup failed:", err.message);
  process.exit(1);
});