const express = require("express");
const app = express();
const listViewRouter = require("./list-view-router.js");
const listEditRouter = require("./list-edit-router.js");

app.use(express.json());

let tasks = [];
let taskIdCounter = 1;

// Agregar los routers a las rutas principales
app.use("/edit", listEditRouter(tasks, taskIdCounter));
app.use("/view", listViewRouter(tasks));

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor en funcionamiento en el puerto 3000.");
});
