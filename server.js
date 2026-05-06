const express = require("express");
const redis = require("redis");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du client Redis
const redisClient = redis.createClient({
  url: "redis://redis-server:6379",
});

// Middleware pour parser le JSON et les données de formulaire
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connexion à Redis
redisClient.connect().catch(console.error);

// Données en mémoire (simulation d'une base de données d'employés)
let employees = [
  {
    id: 1,
    name: "Jean Dupont",
    position: "Développeur",
    email: "jean@example.com",
  },
  {
    id: 2,
    name: "Marie Martin",
    position: "Designer",
    email: "marie@example.com",
  },
  {
    id: 3,
    name: "Pierre Bernard",
    position: "Manager",
    email: "pierre@example.com",
  },
];

// Compteur de visites global
let visitCounter = 0;

// Route racine - Page principale avec compteur
app.get("/", async (req, res) => {
  try {
    // Incrémenter le compteur dans Redis
    const visits = await redisClient.incr("visits");

    // Incrémenter le compteur local pour l'affichage
    visitCounter++;

    res.send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gestion des Employés - Docker App</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
          .counter { background: #fff; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .counter h2 { color: #667eea; margin-top: 0; }
          .employee-card { background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
          .employee-info h3 { margin: 0 0 10px 0; color: #333; }
          .employee-info p { margin: 5px 0; color: #666; }
          .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-left: 5px; }
          .btn-edit { background: #4CAF50; color: white; }
          .btn-delete { background: #f44336; color: white; }
          .btn-add { background: #2196F3; color: white; padding: 12px 24px; font-size: 16px; }
          .form-group { margin-bottom: 15px; }
          .form-group label { display: block; margin-bottom: 5px; font-weight: bold; }
          .form-group input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
          .modal { display: none; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }
          .modal-content { background: white; margin: 10% auto; padding: 30px; border-radius: 10px; width: 500px; }
          .close { color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer; }
          .close:hover { color: black; }
          .add-btn-container { margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏢 Gestion des Employés</h1>
          <p>Application Docker multi-conteneurs (Node.js + Redis)</p>
        </div>

        <div class="counter">
          <h2>📊 Statistiques</h2>
          <p><strong>Nombre de visites (Redis):</strong> ${visits}</p>
          <p><strong>Nombre de visites (Local):</strong> ${visitCounter}</p>
        </div>

        <div class="add-btn-container">
          <button class="btn btn-add" onclick="openModal()">➕ Ajouter un Employé</button>
        </div>

        <div id="employeesList">
          ${employees
            .map(
              (emp) => `
            <div class="employee-card" id="employee-${emp.id}">
              <div class="employee-info">
                <h3>${emp.name}</h3>
                <p>📧 ${emp.email}</p>
                <p>💼 ${emp.position}</p>
              </div>
              <div>
                <button class="btn btn-edit" onclick="editEmployee(${emp.id})">✏️ Modifier</button>
                <button class="btn btn-delete" onclick="deleteEmployee(${emp.id})">🗑️ Supprimer</button>
              </div>
            </div>
          `,
            )
            .join("")}
        </div>

        <!-- Modal pour Ajouter/Modifier -->
        <div id="employeeModal" class="modal">
          <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2 id="modalTitle">Ajouter un Employé</h2>
            <form id="employeeForm">
              <input type="hidden" id="employeeId">
              <div class="form-group">
                <label>Nom complet:</label>
                <input type="text" id="employeeName" required>
              </div>
              <div class="form-group">
                <label>Poste:</label>
                <input type="text" id="employeePosition" required>
              </div>
              <div class="form-group">
                <label>Email:</label>
                <input type="email" id="employeeEmail" required>
              </div>
              <button type="submit" class="btn btn-add">💾 Enregistrer</button>
            </form>
          </div>
        </div>

        <script>
          function openModal() {
            document.getElementById('modalTitle').textContent = 'Ajouter un Employé';
            document.getElementById('employeeForm').reset();
            document.getElementById('employeeId').value = '';
            document.getElementById('employeeModal').style.display = 'block';
          }

          function closeModal() {
            document.getElementById('employeeModal').style.display = 'none';
          }

          function editEmployee(id) {
            fetch('/api/employees/' + id)
              .then(res => res.json())
              .then(emp => {
                document.getElementById('modalTitle').textContent = 'Modifier un Employé';
                document.getElementById('employeeId').value = emp.id;
                document.getElementById('employeeName').value = emp.name;
                document.getElementById('employeePosition').value = emp.position;
                document.getElementById('employeeEmail').value = emp.email;
                document.getElementById('employeeModal').style.display = 'block';
              });
          }

          function deleteEmployee(id) {
            if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
              fetch('/api/employees/' + id, { method: 'DELETE' })
                .then(() => location.reload());
            }
          }

          document.getElementById('employeeForm').onsubmit = function(e) {
            e.preventDefault();
            const id = document.getElementById('employeeId').value;
            const data = {
              name: document.getElementById('employeeName').value,
              position: document.getElementById('employeePosition').value,
              email: document.getElementById('employeeEmail').value
            };

            const url = id ? '/api/employees/' + id : '/api/employees';
            const method = id ? 'PUT' : 'POST';

            fetch(url, {
              method: method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            }).then(() => {
              closeModal();
              location.reload();
            });
          };

          window.onclick = function(event) {
            const modal = document.getElementById('employeeModal');
            if (event.target == modal) {
              modal.style.display = 'none';
            }
          }
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("Erreur Redis:", err);
    res.status(500).send("Erreur de connexion à Redis");
  }
});

// API - Récupérer un employé
app.get("/api/employees/:id", (req, res) => {
  const employee = employees.find((e) => e.id === parseInt(req.params.id));
  if (!employee) return res.status(404).json({ error: "Employé non trouvé" });
  res.json(employee);
});

// API - Créer un employé
app.post("/api/employees", (req, res) => {
  const newId =
    employees.length > 0 ? Math.max(...employees.map((e) => e.id)) + 1 : 1;
  const newEmployee = {
    id: newId,
    name: req.body.name,
    position: req.body.position,
    email: req.body.email,
  };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// API - Modifier un employé
app.put("/api/employees/:id", (req, res) => {
  const index = employees.findIndex((e) => e.id === parseInt(req.params.id));
  if (index === -1)
    return res.status(404).json({ error: "Employé non trouvé" });

  employees[index] = {
    ...employees[index],
    name: req.body.name,
    position: req.body.position,
    email: req.body.email,
  };
  res.json(employees[index]);
});

// API - Supprimer un employé
app.delete("/api/employees/:id", (req, res) => {
  const index = employees.findIndex((e) => e.id === parseInt(req.params.id));
  if (index === -1)
    return res.status(404).json({ error: "Employé non trouvé" });

  employees.splice(index, 1);
  res.status(204).send();
});

// Gestion des erreurs Redis
redisClient.on("error", (err) => {
  console.error("Erreur Redis:", err);
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`🔗 Redis connecté sur redis-server:6379`);
});
