require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB Connection Failed:", err));

const sensorSchema = new mongoose.Schema({
    sensor1: Number,
    sensor2: Number,
    sensor3: Number,
    sensor4: Number,
    sensor5: Number,
    timestamp: { type: Date, default: Date.now }
});

const SensorData = mongoose.model("SensorData", sensorSchema);

// Route to receive data from ESP32
app.post("/update-sensor-data", async (req, res) => {
    try {
        const newData = new SensorData(req.body);
        await newData.save();
        res.status(201).json({ message: "Data saved successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save data" });
    }
});

// Route for frontend to get the latest data
app.get("/get-sensor-data", async (req, res) => {
    try {
        const latestData = await SensorData.find().sort({ timestamp: -1 }).limit(1);
        res.json(latestData[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
