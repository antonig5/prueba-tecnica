const express = require("express");
const connectToDatabase = require("./db.js");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = 8080;

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());
app.use(cors());

// Endpoint de ejemplo para consultar datos desde la base de datos
app.get("/api/poyects", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("proyects");
    const usuarios = await collection.find({}).toArray();
    res.json(usuarios);
  } catch (error) {
    console.error("Error al consultar datos:", error);
    res.status(500).json({ message: "Error al consultar datos" });
  }
});

app.post("/api/poyects", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("proyects");

    const nuevoUsuario = req.body; // El cuerpo de la solicitud debe contener los datos del nuevo usuario

    const resultado = await collection.insertOne(nuevoUsuario);
    res.json({
      message: "Proyecto agregado correctamente",
      insertedId: resultado.insertedId,
    });
  } catch (error) {
    console.error("Error al agregar proyecto:", error);
    res.status(500).json({ message: "Error al agregar proyecto" });
  }
});

app.put("/api/poyects/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("proyects");

    const usuarioId = req.params.id;
    const nuevosDatos = req.body;

    const resultado = await collection.updateOne(
      { _id: new ObjectId(usuarioId) },
      { $set: nuevosDatos }
    );

    if (resultado.modifiedCount === 1) {
      res.json({ message: "proyecto actualizado correctamente" });
    } else {
      res.status(404).json({ message: "proyecto no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar proyecto:", error);
    res.status(500).json({ message: "Error al actualizar proyecto" });
  }
});

app.delete("/api/poyects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectToDatabase();
    const collection = db.collection("proyects");

    const resultado = await collection.deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 1) {
      res.json({ message: "proyecto eliminado correctamente" });
    } else {
      res.status(404).json({ message: "proyecto no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar proyecto:", error);
    res.status(500).json({ message: "Error al eliminar proyecto" });
  }
});
app.get("/api/poyects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectToDatabase();
    const collection = db.collection("proyects");

    const proyecto = await collection.findOne({ _id: new ObjectId(id) });

    if (!proyecto) {
      res.status(404).json({ message: "Proyecto no encontrado" });
      return;
    }

    res.json(proyecto);
  } catch (error) {
    console.error("Error al consultar datos:", error);
    res.status(500).json({ message: "Error al consultar datos" });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
