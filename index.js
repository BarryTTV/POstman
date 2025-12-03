import express from "express";
import { connectDB } from "./db.js";
import { Card } from "./models/cards.js";
import cors from "cors";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Crear una carta
app.post("/createCard", async (req, res) => {
    try {
        const { name, link, description } = req.body || {};

        if (!name || !link) {
            return res.status(400).json({ message: "El nombre y el link son obligatorios." });
        }

        const card = await Card.create({ name, link, description });

        res.status(201).json({
            message: "Carta creada exitosamente.",
            data: card
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear la carta." });
    }
});

// Actualizar una carta (PATCH) 
app.patch("/updateCard/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const updatedCard = await Card.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedCard) {
            return res.status(404).json({ message: "Carta no encontrada." });
        }

        res.status(200).json({
            message: "Carta actualizada correctamente.",
            data: updatedCard
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la carta." });
    }
});

// Eliminar una carta
app.delete("/deleteCard/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCard = await Card.findByIdAndDelete(id);

        if (!deletedCard) {
            return res.status(404).json({ message: "Carta no encontrada." });
        }

        res.status(200).json({
            message: "Carta eliminada correctamente.",
            data: deletedCard
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar la carta." });
    }
});

// Obtener una carta por ID
app.get("/getCard/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const card = await Card.findById(id);

        if (!card) {
            return res.status(404).json({ message: "Carta no encontrada." });
        }

        res.status(200).json({
            message: "Carta encontrada.",
            data: card
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener la carta." });
    }
});

// Obtener todas las cartas
app.get("/getAllCards", async (req, res) => {
    try {
        const cards = await Card.find();

        res.status(200).json({
            message: "Lista de todas las cartas",
            total: cards.length,
            data: cards
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las cartas." });
    }
});

app.get("/endpoints", (req, res) => {

    const message = `
Endpoints disponibles:

Cards:
- POST   https://postman-fqen.onrender.com/createCard
- GET    https://postman-fqen.onrender.com/getAllCards
- GET    https://postman-fqen.onrender.com/getCard/:id
- PATCH  https://postman-fqen.onrender.com/updateCard/:id
- DELETE https://postman-fqen.onrender.com/deleteCard/:id

Este endpoint:
- GET    https://postman-fqen.onrender.com/endpoints
`;

    res.status(200).send(message);
});

// Puerto
app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});
