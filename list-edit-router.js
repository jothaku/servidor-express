const express = require("express");
const router = express.Router();

//ruta para la creacion de tareas
module.exports = (tasks, taskIdCounter) => {
  router.post("/create", (req, res) => {
    const { names } = req.body;
    const id = taskIdCounter++;

    const task = {
      id,
      names,
      completed: false,
    };

    tasks.push(task);

    //respuesta al crear la tarea
    res.json({ message: "La tarea se añadió correctamente.", task });
  });

  //ruta para la eliminacion de tareas
  router.delete("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);

    //respuesta segun el resultado de la solicitud de eliminacion
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      res.json({ message: "Tarea eliminada ." });
    } else {
      res.status(404).json({ error: "No se encontró la tarea especificada." });
    }
  });

  //ruta para actualizar tareas
  router.put("/update/:id", (req, res) => {
    const id = parseInt(req.params.id);

    //mensajes de respuesta segun el comando especificado
    const task = tasks.find((task) => task.id === id);
    if (task) {
      task.completed = true;
      res.json({ message: "Tarea actualizada.", task });
    } else {
      res.status(404).json({ error: "No se encontró la tarea especificada." });
    }
  });

  return router;
};
