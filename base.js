const STORAGE_KEY_TODOS = "todo_app_todos";
const STORAGE_KEY_GOAL = "todo_app_goal";

let app = new Vue({
  data: {
    form: {
      name: "",
      email: "",
      message: "",
    },
    newTodo: "",
    todos: [],
    newGoal: "",
    editedObj: "",
    prioGoals: [],
    errors: {
      todos: "",
      prioGoals: "",
    },
    hours: {
      1: {
        time: "08-09",
        value: "",
        done: false,
        edit: true,
      },
      2: {
        time: "09-10",
        value: "",
        done: false,
        edit: true,
      },
      3: {
        time: "10-11",
        value: "",
        done: false,
        edit: true,
      },
      4: {
        time: "11-12",
        value: "",
        done: false,
        edit: true,
      },
      5: {
        time: "12-13",
        value: "",
        done: false,
        edit: true,
      },
      6: {
        time: "13-14",
        value: "",
        done: false,
        edit: true,
      },
      7: {
        time: "14-15",
        value: "",
        done: false,
        edit: true,
      },
      8: {
        time: "15-16",
        value: "",
        done: false,
        edit: true,
      },
      9: {
        time: "16-17",
        value: "",
        done: false,
        edit: true,
      },
      10: {
        time: "17-18",
        value: "",
        done: false,
        edit: true,
      },
    },
    tab: "todo",
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the entire view has been re-rendered - because $nextTick is used!

      // Get the Todos from the localstorage
      let todos = JSON.parse(localStorage.getItem(STORAGE_KEY_TODOS) || "[]");
      todos.forEach(function (todo, index) {
        todo.id = index;
      });
      this.todos = todos;

      //Get the proGoals from the localStorage
      let prioGoals = JSON.parse(
        localStorage.getItem(STORAGE_KEY_GOAL) || "[]"
      );
      prioGoals.forEach(function (goal, index) {
        goal.id = index;
      });
      this.prioGoals = prioGoals;

      for (let i = 1; i <= 10; i++) {
        this.hours[i] = JSON.parse(
          localStorage.getItem("todo_app_hours_" + i) || []
        );
      }
    });
  },
  watch: {
    // Watch if the todos change to persists to localstorage
    todos: {
      handler: function (todos) {
        this.saveTodosToLocalStorage(todos);
      },
      deep: true,
    },
    prioGoals: {
      handler: function (goals) {
        this.saveGoalsToLocalStorage(goals);
      },
      deep: true,
    },
    hours: {
      handler: function (hours) {
        this.saveHoursToLocalStorage(hours);
      },
      deep: true,
    },
  },
  computed: {
    date: function () {
      let currentDate = new Date();
      let month = currentDate.getMonth() + 1;
      return (
        currentDate.getDate() +
        " - " +
        month +
        " - " +
        currentDate.getFullYear()
      );
    },
  },
  methods: {
    encode(data) {
      return Object.keys(data)
        .map(
          (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
        )
        .join("&");
    },
    handleSubmit() {
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: this.encode({ "form-name": "contact", ...this.form }),
      })
        .then(() => alert("Success!"))
        .catch((error) => alert(error));
    },
    addTodo: function () {
      //Alow only 5 todos each day
      // if(this.todos.length >= 5){
      //     this.errors.todos = 'You can only add 5 main todos, delete a todo to add a new todo';
      //     return
      // }
      if (this.newTodo) {
        let value = this.newTodo;
        this.todos.push({
          value: value,
          done: false,
          edit: false,
        });
        this.newTodo = "";
      }
    },
    removeTodo: function (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
    },
    addGoal: function () {
      if (this.prioGoals.length >= 3) {
        this.errors.prioGoals =
          "You can only add 3 main goals, delete a goal to add a new goal";
        return;
      }
      if (this.newGoal) {
        let value = this.newGoal;
        this.prioGoals.push({
          value: value,
          done: false,
          edit: false,
        });
        this.newGoal = "";
      }
    },
    removeGoal: function (prioGoal) {
      this.prioGoals.splice(this.prioGoals.indexOf(prioGoal), 1);
    },
    removeHourTodo: function (key) {
      this.hours[key].value = "";
    },
    saveTodosToLocalStorage: function (todos) {
      localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
    },
    saveGoalsToLocalStorage: function (goals) {
      localStorage.setItem(STORAGE_KEY_GOAL, JSON.stringify(goals));
    },
    saveHoursToLocalStorage: function (hours) {
      for (let i = 1; i <= 10; i++) {
        localStorage.setItem("todo_app_hours_" + i, JSON.stringify(hours[i]));
      }
    },
    edit: function (obj) {
      //If object is alrady done - its should not be possible to edit the object any more
      if (obj.done) {
        return;
      }
      obj.edit = true;
      this.beforeEditCasch = obj.value;
      this.editedObj = obj;
    },
    doneEdit: function (obj) {
      //if nothing is entered into the input field - we don't want to do anything (something has to be typed first)
      if (obj.value.length === 0) {
        return;
      }
      if (!this.editedObj) {
        obj.edit = false;
        return;
      }
      this.editedObj = "";
      obj.edit = false;

      if (!obj.value) {
        this.removeGoal(obj);
      }
    },
    cancelEdit: function (obj) {
      obj.edit = false;
      obj.value = this.beforeEditCasch;
    },
  },
  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  directives: {
    "goal-focus": function (el, binding) {
      if (binding.value) {
        el.focus();
      }
    },
  },
});

app.$mount("#app");
