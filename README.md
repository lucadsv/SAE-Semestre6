# SAE Semestre 6 — Refonte Express + MongoDB

## Objectif
Refonte complète du projet ClusterLab en Node.js / Express / MongoDB avec EJS, simulation des modules de calcul et intégration du jeu du Juste Prix.

## Stack
- Node.js
- Express
- EJS (templating)
- MongoDB / Mongoose
- Sessions Express

## Lancer le projet
```bash
npm install
npm start

## Installer MongoDB Shell
https://www.mongodb.com/try/download/terraform-provider

Télécharger le zip MongoDB Shell
Une fois dézipé, il suffit de l'ajouter au PATH : 
$env:Path += ";C:\Users\22300413\Downloads\mongosh-2.7.0-win32-x64\bin"

Vérifier que mongosh est reconnu :
mongosh --version

Tester la connexion dans le terminal Windows : 
mongosh "mongodb://<username>:<mdp>@192.168.24.1:27017/<db_name>"