# Backend Node.js + Express - Commandes Linux

Ce document présente les commandes Linux les plus utiles pour créer un backend en Node.js + Express, installer les dépendances et préparer une base de données.

## 1. Préparer le projet backend

1. Se placer dans le dossier du projet :

```bash
cd /home/mon_pc/project/projet_perso/portefolio/portefolio_dev
```

2. Créer un dossier `backend` (optionnel) :

```bash
mkdir backend
cd backend
```

3. Initialiser le projet Node.js :

```bash
npm init -y
```

4. Installer Express et utilitaires :

```bash
npm install express dotenv
npm install --save-dev nodemon
```

> Si vous utilisez pnpm :

```bash
pnpm init -y
pnpm add express dotenv
pnpm add -D nodemon
```

5. Créer le fichier principal :

```bash
mkdir src
touch src/index.js
```

## 2. Installer le pilote de base de données

### PostgreSQL

```bash
npm install pg
```

### MySQL / MariaDB

```bash
npm install mysql2
```

### MongoDB

```bash
npm install mongodb mongoose
```

### SQLite

```bash
npm install sqlite3 knex
```

### Optionnel : ORM / Query builder

```bash
npm install prisma
npm install --save-dev prisma
npm install @prisma/client
```

## 3. Commandes pour créer une base PostgreSQL

1. Installer PostgreSQL (Debian/Ubuntu) :

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

2. Lancer le service :

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

3. Se connecter en tant qu'utilisateur `postgres` :

```bash
sudo -u postgres psql
```

4. Créer une base et un utilisateur :

```sql
CREATE DATABASE mon_projet_db;
CREATE USER mon_user WITH ENCRYPTED PASSWORD 'mon_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE mon_projet_db TO mon_user;
\q
```

5. Vérifier la connexion depuis Node.js :

```bash
psql -h localhost -U mon_user -d mon_projet_db
```

## 4. Commandes pour créer une base MySQL / MariaDB

1. Installer MySQL / MariaDB :

```bash
sudo apt update
sudo apt install mysql-server
```

2. Lancer le service :

```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

3. Sécuriser l'installation :

```bash
sudo mysql_secure_installation
```

4. Se connecter au shell MySQL :

```bash
sudo mysql -u root -p
```

5. Créer la base et l'utilisateur :

```sql
CREATE DATABASE mon_projet_db;
CREATE USER 'mon_user'@'localhost' IDENTIFIED BY 'mon_mot_de_passe';
GRANT ALL PRIVILEGES ON mon_projet_db.* TO 'mon_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 5. Commandes pour créer une base MongoDB

1. Installer MongoDB (Debian/Ubuntu) :

```bash
sudo apt update
sudo apt install -y mongodb
```

2. Lancer MongoDB :

```bash
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

3. Se connecter au shell MongoDB :

```bash
mongosh
```

4. Créer une base de données et un utilisateur :

```js
use mon_projet_db
db.createUser({
  user: 'mon_user',
  pwd: 'mon_mot_de_passe',
  roles: [{ role: 'readWrite', db: 'mon_projet_db' }]
})
```

## 6. Exemple de configuration `.env`

Créer un fichier `.env` à la racine du backend :

```bash
touch .env
```

Exemple de contenu :

```env
PORT=4000
DATABASE_URL=postgres://mon_user:mon_mot_de_passe@localhost:5432/mon_projet_db
```

Pour MySQL :

```env
DATABASE_URL=mysql://mon_user:mon_mot_de_passe@localhost:3306/mon_projet_db
```

Pour MongoDB :

```env
MONGODB_URI=mongodb://mon_user:mon_mot_de_passe@localhost:27017/mon_projet_db
```

## 7. Script de démarrage utile

Ajouter dans `package.json` :

```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js"
}
```

## 8. Démarrer le serveur

```bash
npm run dev
```

ou

```bash
npm start
```

## 9. Exemple rapide d'application Express

Créer `src/index.js` :

```js
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello Express + DB !')
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
```

## 10. Commandes Linux utiles pour le développement

- Vérifier la version de Node.js :

```bash
node -v
npm -v
pnpm -v
```

- Installer un paquet globalement (pas recommandé en production) :

```bash
npm install -g nodemon
```

- Lister les fichiers d'un dossier :

```bash
ls -la
```

- Vérifier si un port est utilisé :

```bash
sudo lsof -i :4000
```

- Afficher les logs de service (ex. PostgreSQL) :

```bash
sudo journalctl -u postgresql -f
```

---

Ce guide couvre les commandes de base pour créer un backend Node.js + Express et configurer une base de données PostgreSQL, MySQL ou MongoDB sur Linux. Adapte les noms de base, d'utilisateur et de mot de passe à ton projet.