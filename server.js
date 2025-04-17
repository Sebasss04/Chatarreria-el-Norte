const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const basicAuth = require('express-basic-auth');

app.use('/admin.html', basicAuth({
    users: { '62029291': '62029291' },
    challenge: true,
    unauthorizedResponse: 'Acceso denegado'
}));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Configuración de Multer (para subir imágenes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Ruta para obtener materiales
app.get('/api/materiales', (req, res) => {
  const data = JSON.parse(fs.readFileSync('database.json'));
  res.json(data);
});

// Ruta para agregar nuevo material
app.post('/api/materiales', upload.single('imagen'), (req, res) => {
  const data = JSON.parse(fs.readFileSync('database.json'));
  const nuevo = {
    id: Date.now(),
    nombre: req.body.nombre,
    info: req.body.info,
    precio: req.body.precio,
    estado: req.body.estado,
    imagen: '/uploads/' + req.file.filename
  };
  data.push(nuevo);
  fs.writeFileSync('database.json', JSON.stringify(data, null, 2));
  res.json({ mensaje: 'Material agregado', material: nuevo });
});

function cargarMateriales() {
  return JSON.parse(fs.readFileSync('database.json'));
}

function guardarMateriales(data) {
  fs.writeFileSync('database.json', JSON.stringify(data, null, 2));
}


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const nodemailer = require('nodemailer');

// Marcar como vendido
app.put('/api/materiales/:id/vender', (req, res) => {
  const id = Number(req.params.id); // <--- CAMBIO AQUÍ
  const materiales = cargarMateriales();
  const index = materiales.findIndex(m => m.id === id); // Comparar como número
  if (index !== -1) {
    materiales[index].estado = "Vendido";
    guardarMateriales(materiales);
    res.sendStatus(200);
  } else {
    res.status(404).send('Material no encontrado');
  }
});

// Eliminar material
app.delete('/api/materiales/:id', (req, res) => {
  const id = Number(req.params.id); // <--- CAMBIO AQUÍ
  let materiales = cargarMateriales();
  materiales = materiales.filter(m => m.id !== id); // Comparar como número
  guardarMateriales(materiales);
  res.sendStatus(200);
});
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});



