import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  const fetchTodos = async () => {
    const res = await axios.get("http://localhost:8000/api/tasks/");
    setTodos(res.data);
  };

  const createTodo = async () => {
    await axios.post("http://localhost:8000/api/tasks/", {
      title: newTitle,
      description: "",
      completed: false,
    });
    setNewTitle("");
    fetchTodos();
  };

  const toggleComplete = async (id, completed) => {
    await axios.patch(`http://localhost:8000/api/tasks/${id}/`, {
      completed: !completed,
    });
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:8000/api/tasks/${id}/`);
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>ToDo List</h1>
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Nueva tarea"
      />
      <button onClick={createTodo}>Agregar</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              onClick={() => toggleComplete(todo.id, todo.completed)}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
