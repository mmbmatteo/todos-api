var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
app.use(bodyParser.json());

//GET /[root]
app.get('/', function (req, res) {
	res.send('Todo API Root');
});

//GET /todos?completed=true&q=keyword
app.get('/todos', function (req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && (queryParams.completed === 'false')) {
		filteredTodos = _.where(filteredTodos, {completed: false});
	} else if (queryParams.hasOwnProperty('completed') && (queryParams.completed === 'true')) {
		filteredTodos = _.where(filteredTodos, {completed: true});
	}

	if (queryParams.hasOwnProperty('q') && (queryParams.q.trim().length > 0)) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}	
	res.json(filteredTodos);
});

//GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	//var matchedToDo = _.findWhere(todos,  {id: todoId});
	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}).catch(function (e) {
		res.status(500).send();
	});
});

//POST /todos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	
	db.todo.create (body).then(function (todo) {
		res.json(todo.toJSON());
	}).catch(function (e) {
		res.status(400).json(e);
	});
});

//DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedToDo = _.findWhere(todos,  {id: todoId});

	if (matchedToDo) {
		todos = _.without(todos, matchedToDo);
		res.json(matchedToDo);
	} else {
		res.status(404).json({"error": "not todo found with that id"});
	}
});

//PUT /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedToDo = _.findWhere(todos,  {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedToDo) {
		return res.status(404).json({"error": "not todo found with that id"});
	}

	//Validate 'completed' property
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else  if (body.hasOwnProperty('completed')){
		return res.status(400).json({"error":"completed field is not a boolean"})
	}

	//Validate 'description' property
	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description.trim();
	} else  if (body.hasOwnProperty('description')){
		return res.status(400).json({"error":"description field is either not a string or empty"})
	}

	_.extend(matchedToDo, validAttributes);
	res.json(matchedToDo);
});

//LISTEN
db.sequelize.sync().then(function () {
	app.listen(PORT, function (){
		console.log('Express listening on port ' + PORT);
	});
});