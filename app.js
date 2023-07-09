const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const listViewRouter = require("./list-view-router.js");
const listEditRouter = require("./list-edit-router.js");
const users = [
  { username: "Jonathan", password: "1234567" },
  { username: "Andres", password: "0011233" },
];

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

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Busca el usuario en el array
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  // Genera el token JWT utilizando el secreto configurado en las variables de entorno
  const token = jwt.sign({ username }, process.env.JWT_SECRET);

  res.json({ token });
});

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

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// Iniciar el servidor
app.listen(3002, () => {
  console.log("Servidor en funcionamiento en el puerto 3002.");
});
