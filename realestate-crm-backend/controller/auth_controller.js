const Broker = require("../models/broker");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register Broker
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validate input
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if broker already exists
        const existingBroker = await Broker.findOne({ where: { email } });
        if (existingBroker) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new broker
        const newBroker = await Broker.create({ name, email, password_hash: hashedPassword, phone });

        res.status(201).json({
            success: true,
            message: "Registration successful",
            broker: { broker_id: newBroker.broker_id, name: newBroker.name, email: newBroker.email, phone: newBroker.phone }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Login Broker
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // Find broker by email
        const broker = await Broker.findOne({ where: { email } });
        if (!broker) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, broker.password_hash);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { broker_id: broker.broker_id, name: broker.name },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            broker: { broker_id: broker.broker_id, name: broker.name, email: broker.email, phone: broker.phone }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Get Broker Profile
exports.getBrokerProfile = async (req, res) => {
    try {
        const brokerId = req.user.broker_id;

        // Find broker by ID
        const broker = await Broker.findByPk(brokerId);
        if (!broker) {
            return res.status(404).json({ success: false, message: "Broker not found" });
        }

        res.json({
            success: true,
            broker: {
                broker_id: broker.broker_id,
                name: broker.name,
                email: broker.email,
                phone: broker.phone
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Update Broker Profile
exports.updateProfile = async (req, res) => {
    try {
        const brokerId = req.user.broker_id;
        const { name, email, phone } = req.body;

        // Find broker by ID
        const broker = await Broker.findByPk(brokerId);
        if (!broker) {
            return res.status(404).json({ success: false, message: "Broker not found" });
        }

        // Check if email is being changed and if it's already in use
        if (email !== broker.email) {
            const existingBroker = await Broker.findOne({ where: { email } });
            if (existingBroker) {
                return res.status(400).json({ success: false, message: "Email already in use" });
            }
        }

        // Update broker
        broker.name = name || broker.name;
        broker.email = email || broker.email;
        broker.phone = phone || broker.phone;

        await broker.save();

        res.json({
            success: true,
            message: "Profile updated successfully",
            broker: {
                broker_id: broker.broker_id,
                name: broker.name,
                email: broker.email,
                phone: broker.phone
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
