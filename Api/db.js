const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017"; // Cambia esta URL por la de tu servidor MongoDB si es diferente

const dbName = "prueba"; // Cambia "miBaseDeDatos" por el nombre de tu base de datos

const connectToDatabase = async () => {
  try {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);
    console.log("Conexión exitosa a la base de datos");
    return db;
  } catch (error) {
    console.error("Error al conectarse a la base de datos:", error);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
