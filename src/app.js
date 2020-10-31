const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const newRepository = { 
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(newRepository);

  return response.status(201).json(newRepository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex<0){
    return response.status(400).json({error: "Repository not found."});
  }

  const { title, url, techs } = request.body;

  // if (!title || !url || !techs){
  //   return response.status(400).json(
  //     {error: "Some parameter is missing - 'title', 'url' and 'techs' are needed."}
  //   );
  // }

  // if (Object.keys(request.body).length>3){
  //   return response.status(400).json(
  //     {error: "Too much parameters - only 'title', 'url' and 'techs' are needed."}
  //   );
  // }

  const repositoryUpdated = {...repositories[repositoryIndex], title, url, techs};

  repositories[repositoryIndex] = repositoryUpdated;

  return response.json(repositoryUpdated);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex<0){
    return response.status(400).json({error: "Repository not found."});
  }

  repositories.splice(repositoryIndex,1);

  return response.status(204).send() 
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex<0){
    return response.status(400).json({error: "Repository not found."});
  }

  repositories[repositoryIndex].likes += 1;

  return response.json({likes: repositories[repositoryIndex].likes});

});

module.exports = app;
