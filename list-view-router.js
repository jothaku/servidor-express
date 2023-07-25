// list-view-router.js
const express = require("express");
const router = express.Router();

// Middleware para gestionar los parámetros
const validateParamsMiddleware = (req, res, next) => {
  const { id } = req.params;

  // Verificar si el parámetro es válido (en este caso, que sea un número entero positivo)
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Parámetro no válido." });
  }

  next(); // Pasar al siguiente middleware o enrutador
};

module.exports = (tasks) => {
  router.get("/completed", (req, res) => {
    const completedTasks = tasks.filter((task) => task.completed);
    res.json(completedTasks);
  });

  // Ruta GET para listar tareas incompletas
  router.get("/incomplete", (req, res) => {
    const incompleteTasks = tasks.filter((task) => !task.completed);
    res.json(incompleteTasks);
  });

  // Ruta GET para ver una tarea específica por ID
  router.get("/:id", validateParamsMiddleware, (req, res) => {
    const { id } = req.params;
    const task = tasks.find((task) => task.id === parseInt(id));

    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: "No se encontró la tarea especificada." });
    }
  });

  return router;
};
