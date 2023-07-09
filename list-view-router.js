const express = require("express");
const router = express.Router();

// Ruta GET para listar tareas completas
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

  return router;
};
