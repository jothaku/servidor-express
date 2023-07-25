// server.js
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const listViewRouter = require("./list-view-router.js");
const listEditRouter = require("./list-edit-router.js");

// Middleware para procesar el cuerpo de las solicitudes en formato JSON
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
const registeredUsers = [];

// Ruta para registrar usuarios
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Por favor, proporciona un username y un password." });
  }

  // Verificar si el usuario ya está registrado
  const existingUser = registeredUsers.find(
    (user) => user.username === username
  );

  if (existingUser) {
    return res.status(400).json({
      error: "El username ya está registrado. Por favor, elige otro.",
    });
  }

  // Agregar el nuevo usuario al array de usuarios registrados
  const newUser = { username, password };
  registeredUsers.push(newUser);

  res.json({ message: "Usuario registrado exitosamente." });
});

// Ruta para realizar el login y obtener el token JWT
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Busca el usuario en el array de usuarios registrados
  const user = registeredUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  // Genera el token JWT utilizando el secreto configurado en las variables de entorno
  const token = jwt.sign({ username }, process.env.JWT_SECRET);

  res.json({ token });
});

// Ruta protegida: Acceso a ruta protegida
app.get("/ruta-protegida", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  // Verifica y decodifica el token utilizando el secreto configurado en las variables de entorno
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }

    // El token es válido, se puede acceder a la ruta protegida
    res.json({ message: "Acceso permitido a la ruta protegida" });
  });
});

// Agregar los routers a las rutas principales
app.use("/edit", listEditRouter(tasks, taskIdCounter));
app.use("/view", listViewRouter(tasks));

// Agregar la ruta para obtener todas las tareas
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Iniciar el servidor
app.listen(3004, () => {
  console.log("Servidor en funcionamiento en el puerto 3002.");
});
