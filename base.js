const STORAGE_KEY_TODOS = 'todo_app_todos';
const STORAGE_KEY_GOAL = 'todo_app_goal';

let app = new Vue({
    data: {
        newTodo: '',
        todos: [],
        newGoal: '',
        prioGoals: [],
        errors: {
            todos: '',
            prioGoals: '',
        },
        hours: {
            1: null,
            2: null,
            3: null,
            4: null,
            5: null,
            6: null,
            7: null,
            8: null,
            9: null,
            10: null,
        },
        tab: 'todo'
    },
    mounted: function() {
      this.$nextTick(function () {
          // Code that will run only after the entire view has been re-rendered - because $nextTick is used!

          // Get the Todos from the localstorage
          let todos = JSON.parse(localStorage.getItem(STORAGE_KEY_TODOS) || '[]');
          todos.forEach(function (todo, index) {
              todo.id = index;
          });
          this.todos = todos;

          //Get the proGoals from the localStorage
          let prioGoals = JSON.parse(localStorage.getItem(STORAGE_KEY_GOAL) || '[]');
          prioGoals.forEach(function (goal, index) {
              goal.id = index;
          });
          this.prioGoals = prioGoals;

          for( let i = 1; i <= 10; i++) {
              this.hours[i] = JSON.parse( localStorage.getItem('todo_app_hours_' + i) || null);
          }
      })
    },
    watch: {
        // Watch if the todos change to persists to localstorage
        todos: {
            handler: function (todos) {
                this.saveTodosToLocalStorage(todos)
            },
            deep: true
        },
        prioGoals: {
            handler: function (goals) {
                this.saveGoalsToLocalStorage(goals)
            },
            deep: true
        },
        hours: {
            handler: function (hours) {
                this.saveHoursToLocalStorage(hours)
            },
            deep: true
        }
    },
    computed: {
        date: function() {
            let currentDate = new Date();

            return currentDate.getDate() + ' - ' + currentDate.getMonth() + ' - ' + currentDate.getFullYear();
        }
    },
    methods: {
        addTodo: function () {
            if(this.todos.length >= 5){
                this.errors.todos = 'You can only add 5 main todos, delete a todo to add a new todo';
                return
            }
            let value = this.newTodo;
            this.todos.push({
                value: value,
                done: false
            });
            this.newTodo = '';
        },
        removeTodo: function(todo) {
            this.todos.splice(this.todos.indexOf(todo), 1);
        },
        addGoal: function () {
            if(this.prioGoals.length >= 3){
                this.errors.prioGoals = 'You can only add 3 main goals, delete a goal to add a new goal';
                return
            }
            let value = this.newGoal;
            this.prioGoals.push({
                value: value,
                done: false
            });
            this.newGoal = '';
        },
        removeGoal: function(prioGoal) {
            this.prioGoals.splice(this.prioGoals.indexOf(prioGoal), 1);
        },
        addHourTodo: function(hour, value){
            this.hours[hour] = {
                value: value,
                done: false
            };
        },
        removeHourTodo: function(hour){
            this.hours[hour] = null;
        },
        saveTodosToLocalStorage: function (todos) {
            localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
        },
        saveGoalsToLocalStorage: function (goals) {
            localStorage.setItem(STORAGE_KEY_GOAL, JSON.stringify(goals));
        },
        saveHoursToLocalStorage: function (hours) {
            for( let i = 1; i <= 10; i++) {
                localStorage.setItem('todo_app_hours_' + i, JSON.stringify(hours[i]))
            }
        }
    }
});




app.$mount('#app');