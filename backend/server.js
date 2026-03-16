const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, "db.json");
const FRONTEND_PATH = path.join(__dirname, "..", "frontend", "dist");

app.use(express.json());
app.use(express.static(FRONTEND_PATH));

async function readDb() {
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function validateWatchPayload(payload) {
  const allowedStyles = ["dress", "sports", "casual", "luxury", "limited edition"];
  const allowedMovements = ["quartz", "automatic", "mechanical"];

  const errors = {};

  if (!payload.name || payload.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!payload.brand || payload.brand.trim().length < 2) {
    errors.brand = "Brand must be at least 2 characters.";
  }

  if (typeof payload.price !== "number" || Number.isNaN(payload.price) || payload.price <= 0) {
    errors.price = "Price must be a positive number.";
  }

  if (!allowedStyles.includes(payload.style)) {
    errors.style = "Invalid style.";
  }

  if (!allowedMovements.includes(payload.movement)) {
    errors.movement = "Invalid movement.";
  }

  if (!Number.isInteger(payload.stock) || payload.stock < 0) {
    errors.stock = "Stock must be a non-negative integer.";
  }

  if (!payload.imageUrl || typeof payload.imageUrl !== "string") {
    errors.imageUrl = "Image URL is required.";
  }

  if (!payload.description || payload.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "chronos-watches-api" });
});

app.get("/api/watches", async (_req, res) => {
  try {
    const db = await readDb();
    res.json(db.watches || []);
  } catch (error) {
    console.error("GET /api/watches failed:", error);
    res.status(500).json({ error: "Failed to load watches." });
  }
});

app.get("/api/watches/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = await readDb();
    const watch = (db.watches || []).find((item) => item.id === id);

    if (!watch) {
      return res.status(404).json({ error: "Watch not found." });
    }

    res.json(watch);
  } catch (error) {
    console.error("GET /api/watches/:id failed:", error);
    res.status(500).json({ error: "Failed to load watch." });
  }
});

app.post("/api/watches", async (req, res) => {
  try {
    const payload = {
      name: req.body.name?.trim(),
      brand: req.body.brand?.trim(),
      price: Number(req.body.price),
      style: req.body.style,
      movement: req.body.movement,
      stock: Number(req.body.stock),
      imageUrl: req.body.imageUrl?.trim(),
      description: req.body.description?.trim()
    };

    const validation = validateWatchPayload(payload);
    if (!validation.isValid) {
      return res.status(400).json({ error: "Validation failed.", details: validation.errors });
    }

    const db = await readDb();
    const watches = db.watches || [];
    const nextId = watches.length ? Math.max(...watches.map((w) => w.id)) + 1 : 1;

    const newWatch = {
      id: nextId,
      ...payload
    };

    watches.push(newWatch);
    db.watches = watches;
    await writeDb(db);

    res.status(201).json(newWatch);
  } catch (error) {
    console.error("POST /api/watches failed:", error);
    res.status(500).json({ error: "Failed to create watch." });
  }
});

app.put("/api/watches/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const payload = {
      name: req.body.name?.trim(),
      brand: req.body.brand?.trim(),
      price: Number(req.body.price),
      style: req.body.style,
      movement: req.body.movement,
      stock: Number(req.body.stock),
      imageUrl: req.body.imageUrl?.trim(),
      description: req.body.description?.trim()
    };

    const validation = validateWatchPayload(payload);
    if (!validation.isValid) {
      return res.status(400).json({ error: "Validation failed.", details: validation.errors });
    }

    const db = await readDb();
    const watches = db.watches || [];
    const index = watches.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Watch not found." });
    }

    watches[index] = { id, ...payload };
    db.watches = watches;
    await writeDb(db);

    res.json(watches[index]);
  } catch (error) {
    console.error("PUT /api/watches/:id failed:", error);
    res.status(500).json({ error: "Failed to update watch." });
  }
});

app.delete("/api/watches/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const db = await readDb();
    const watches = db.watches || [];
    const filtered = watches.filter((item) => item.id !== id);

    if (filtered.length === watches.length) {
      return res.status(404).json({ error: "Watch not found." });
    }

    db.watches = filtered;
    await writeDb(db);

    res.status(204).send();
  } catch (error) {
    console.error("DELETE /api/watches/:id failed:", error);
    res.status(500).json({ error: "Failed to delete watch." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(FRONTEND_PATH, "index.html"), (error) => {
    if (error) {
      res.status(500).send("Frontend build not found. Run `npm --prefix frontend run build`.");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Chronos Watches running at http://localhost:${PORT}`);
});