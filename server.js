var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Meet mom for lunch',
	completed: false
}, {
	id: 2,
	description: 'Go to market',
	completed: false
}, {
	id: 3,
	description: 'Feed the cat',
	completed: true
}];

//GET /[root]
app.get('/', function (req, res) {
	res.send('Todo API Root');
});

//GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	
	//Iterate
	todos.forEach(function (todo) {
		if (todoId === todo.id) {
			res.json(todo);
			return;
		}
	});
	res.status(404).send();
});

app.listen(PORT, function (){
console.log('Express listening on port ' + 3000);
});

git diff test