const express = require("express");
const app = express();
const listViewRouter = require("./list-view-router.js");
const listEditRouter = require("./list-edit-router.js");

app.use(express.json());

// Middleware para validar los métodos HTTP
const validateMethodMiddleware = (req, res, next) => {
  const validMethods = ["GET", "POST", "PUT", "DELETE"]; // Lista de métodos HTTP válidos

  if (!validMethods.includes(req.method)) {
    return res.status(405).json({ error: "Método HTTP no permitido." });
  }

  next(); // Pasar al siguiente middleware o enrutador
};

app.use(validateMethodMiddleware);

let tasks = [];
let taskIdCounter = 1;

// Agregar los routers a las rutas principales
app.use("/edit", listEditRouter(tasks, taskIdCounter));
app.use("/view", listViewRouter(tasks));

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Iniciar el servidor
app.listen(3006, () => {
  console.log("Servidor en funcionamiento en el puerto 3002.");
});
