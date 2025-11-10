<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
    <div class="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-md">
      <h1 class="text-3xl font-semibold text-center text-indigo-600 mb-6">
        Todo App
      </h1>

      <!-- Input Field -->
      <div class="flex gap-2 mb-4">
        <input
          v-model="newTodo"
          type="text"
          placeholder="Add a new task..."
          class="flex-1 border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          @keyup.enter="addTodo"
        />
        <button
          @click="addTodo"
          class="bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600 transition"
        >
          Add
        </button>
      </div>

      <!-- Todo List -->
      <ul v-if="todos.length" class="space-y-2">
        <li
          v-for="(todo, index) in todos"
          :key="index"
          class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:shadow-sm transition"
        >
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="todo.completed"
              class="w-5 h-5 text-indigo-500 rounded focus:ring-indigo-400"
            />
            <span
              v-if="!todo.editing"
              :class="{
                'line-through text-gray-400': todo.completed,
                'text-gray-800': !todo.completed
              }"
              @dblclick="editTodo(index)"
              class="cursor-pointer"
            >
              {{ todo.text }}
            </span>
            <input
              v-else
              v-model="todo.text"
              @blur="stopEditing(todo)"
              @keyup.enter="stopEditing(todo)"
              class="border rounded-lg p-1 text-gray-700 focus:ring-2 focus:ring-indigo-300"
              autofocus
            />
          </div>

          <button
            @click="removeTodo(index)"
            class="text-red-500 hover:text-red-700 transition"
            title="Delete todo"
          >
            ✕
          </button>
        </li>
      </ul>

      <!-- Empty State -->
      <p v-else class="text-gray-500 text-center mt-6">
        No todos yet. Start by adding one above!
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const newTodo = ref("");
const todos = ref([]);

// Load todos from localStorage when app starts
onMounted(() => {
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    todos.value = JSON.parse(storedTodos);
  }
});

// Watch todos and save changes to localStorage
watch(
  todos,
  (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  },
  { deep: true } // Watch nested properties like completed/editing
);

function addTodo() {
  const text = newTodo.value.trim();
  if (text) {
    todos.value.push({ text, completed: false, editing: false });
    newTodo.value = "";
  }
}

function removeTodo(index) {
  todos.value.splice(index, 1);
}

function editTodo(index) {
  todos.value[index].editing = true;
}

function stopEditing(todo) {
  todo.editing = false;
}
</script>

<style scoped>
/* Smooth fade effect when adding/removing todos */
li {
  transition: all 0.3s ease;
}
</style>
