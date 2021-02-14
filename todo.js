var TodoApp = angular.module('TodoApp', ['ngStorage']);

TodoApp.controller('TodoCtrl', function($scope, $localStorage) {

    var currentEdited = false, //current edited Task
        currentEditedIndex = null; //current edited Task index in $scope.todos
    $scope.priority = '2'; // default priority for creating task  = "Medium"
    $scope.dueDate = new Date(); // default date = "Today"

    //load user local storage
    if ($localStorage.todos) {
        //change format for dueDate field
        angular.forEach($localStorage.todos, function(value, key) {
            value.dueDate = new Date(value.dueDate);
        });
        $scope.todos = $localStorage.todos;
        $scope.predicate = $localStorage.predicate;
        $scope.reverse = $localStorage.reverse;
    } else {
        //default state for example
        $scope.todos = [{
            summary: 'a task',
            dueDate: new Date('2021-12-01'),
            priority: '3',
            done: true
        }, {
            summary: 'b task',
            dueDate: new Date('2021-11-02'),
            priority: '2',
            done: false
        }, {
            summary: 'z task',
            dueDate: new Date('2021-10-03'),
            priority: '1',
            done: false
        }];
        $scope.predicate = 'summary'; //defaul sort field
        $scope.reverse = true; //sorting direction
    }

    $scope.order = function(predicate) {
        //sorting ToDos. predicate : summary, priority, dueDate
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
        $scope.saveToLocalStorage();
    };

    $scope.addTodo = function() {
        if ($scope.todoSummary === '' || $scope.todoSummary === undefined) return;
        $scope.todos.push({
            summary: $scope.todoSummary,
            priority: $scope.priority,
            dueDate: $scope.dueDate,
            done: false
        });
        //default state for new task
        $scope.todoSummary = '';
        $scope.priority = '2';
        $scope.dueDate = new Date();
        //save
        $scope.saveToLocalStorage();
    };

    $scope.remaining = function() {
        //Remaining TODO count
        var count = 0;
        angular.forEach($scope.todos, function(todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };

    $scope.archive = function() {
        //Remove DONE tasks from page and data
        $scope.endEditMode();
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function(todo) {
            if (!todo.done) $scope.todos.push(todo);
        });
        $scope.saveToLocalStorage();
    };

    $scope.edit = function($event) {
        if (this.todo.done) return;
        //hide previous edited item
        $scope.endEditMode();
        //show current clicked item for editing and put currently edited item to variable
        currentEditedIndex = $scope.todos.indexOf(this.todo);
        currentEdited = $event.currentTarget.parentElement;
        currentEdited.classList.add('editItem');
    };

    $scope.editSubmit = function($event) {
        this.todo.summary = $event.currentTarget.querySelector('input').value;
        $scope.endEditMode();
        $scope.saveToLocalStorage();
    };

    $scope.removeTask = function() {
        //by clicking Remove icon
        $scope.endEditMode();
        $scope.todos.splice($scope.todos.indexOf(this.todo), 1);
        $scope.saveToLocalStorage();
    };

    $scope.saveToLocalStorage = function() {
        $localStorage.todos = $scope.todos;
        $localStorage.predicate = $scope.predicate;
        $localStorage.reverse = $scope.reverse;
    };

    $scope.endEditMode = function() {
        if (currentEdited) {
            //delete changes from value
            currentEdited.querySelector('.editForm input').value = $scope.todos[currentEditedIndex].summary;
            //hide editMode
            currentEdited.classList.remove('editItem');
            currentEdited = false;
        }

    };

});
