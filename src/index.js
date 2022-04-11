const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
      const {username} = request.headers
      const user = users.find(acc=> acc.username===username)

      if(!user){

        return response.status(404).json({
          error: 'Mensagem do erro'
        })
      }

      request.user = user
   
      return next()
}

app.post('/users', (request, response) => {
      const {name , username} = request.body
      const accExist = users.find(acc => acc.username === username)
      
      
      if(accExist){
        return response.status(400).json({
          error: 'Mensagem do erro'
        })
      }



      const acc = {
        id:uuidv4(),
        name,
        username,
        todos:[]
      }
      users.push(acc)
      return response.status(201).json(acc)


});

app.get('/todos', checksExistsUserAccount, (request, response) => {
    const {user} = request
    if(!user){
      return response.status(400).json({
        error: 'Mensagem do erro'
      })
    }
    return  response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
      const {title, deadline} = request.body;
      const {user} = request;
      const todo = {
        id:uuidv4(),
        title,
        done:false,
        deadline:new Date(deadline),
        created_at: new Date()
      }
      user.todos.push(todo);
      return response.status(201).json(todo)

 });

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
        const {user} = request;
        const {id} = request.params;
       
        const {title, deadline} = request.body;
        const acc = user.todos.find(acc => acc.id === id);
        
        if(!acc){
          return response.status(404).json({
            error: 'Mensagem do erro'
          })
        }
        
        acc.title = title,
        acc.deadline = new Date(deadline);
         return response.json(acc)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
    const {user} = request;
    const {id} = request.params;
    const acc = user.todos.find(acc => acc.id === id);
      if(!acc){
        return response.status(404).json({
          error: 'Mensagem do erro'
        })
      }
      acc.done =true
      return response.json(acc)
    });

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
    const {user} = request
    const {id} = request.params;
    const acc = user.todos.findIndex(acc => acc.id ===id )
    if(acc===-1){
      return response.status(404).json({
        error: 'Mensagem do erro'
      })
    }
    user.todos.splice(acc,1)
    return response.status(204).json()
});

module.exports = app;