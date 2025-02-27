const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let sensorData = {}; // Store the latest sensor data

// Route to receive sensor data from ESP32
app.post("/update-sensor-data", (req, res) => {
    sensorData = req.body;
    console.log("Received data:", sensorData);
    res.status(200).json({ message: "Data received successfully!" });
});

// Route to fetch sensor data for the frontend
app.get("/get-sensor-data", (req, res) => {
    res.json(sensorData);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
