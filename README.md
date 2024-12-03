# Bingo backend 

## Description

- **Infraestructure :** Api working with a nodeJs server, postgres data base runing in local, cookies injection, midelwares and jwt tokens for authorization. 
- **Code Architecture :** code workflow follows the mvc pattern, using the domain layout for db manipulation and models, application for view and controllers, auth and midelware logic.

## App Init
please create the db. [PgAdmin](https://www.pgadmin.org/) is recomended for this.
### Instalation
```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run dev
```
you can open [localhost:3000](http://localhost:3000) for test if the server is up
### Db model
![image](https://github.com/user-attachments/assets/aa7222fa-6d0c-4cec-9a1b-e2b1c6ba892c)
[https://dbdiagram.io/d/6746439de9daa85acacfcf38](https://dbdiagram.io/d/Bingo-674bacf6e9daa85aca3d8cc1)

