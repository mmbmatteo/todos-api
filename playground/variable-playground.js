var person = {
	name: "Andrew",
	age: 21
};

function updatePerson (obj) {
	obj.age = 24; 
}

updatePerson(person);
console.log(person);

var grades = [15, 88];

function addGrade (arr) {
	arr.push(100);
	debugger;
	console.log('arr.push(100)\n' + arr);
	console.log('grades\n' + grades);
}

addGrade(grades);

function addGrade2 (arr) {
	arr = [12, 33, 100];
	console.log('New Values\n' + arr);
	console.log('grades\n' + grades);
}

addGrade2(grades);