import express from "express";
import { connectDB } from "./db.js";
import { Card } from "./models/cards.js";

const app = express();

connectDB();

app.use(express.json());

//Crear una carta
app.post("/CreateCard", async (req, res) => {
    try {
        const { name, link, description } = req.body || {};

        // Validar campos obligatorios
        if (!name || !link) {
            return res.status(400).json({ message: "El nombre y el link son obligatorios." });
        }

        // Crear la carta en MongoDB
        const card = await Card.create({ name, link, description });

        // Responder con la carta creada
        res.status(201).json({
            message: "Carta creada exitosamente.",
            data: card
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear la carta." });
    }
});

//Actualizar una carta existente por su ID
app.put("/UpdateCard/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Actualizar la carta y devolver la versión nueva
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

//Eliminar una carta con su ID
app.delete("/Delete/:id", async (req, res) => {
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

//Obtener una carta por el ID
app.get("/GetCard/:id", async (req, res) => {
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

//Obtener todas las cartas
app.get("/GetAllCards", async (req, res) => {
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

//Iniciar servidor en el puerto 3000
app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});
