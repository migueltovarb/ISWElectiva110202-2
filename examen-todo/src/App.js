import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

// Estilos usando styled-components
const Container = styled.div`
  padding: 40px;
  max-width: 600px;
  margin: auto;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
`;

const Input = styled.input`
  padding: 10px;
  width: 70%;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 15px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;

  &:hover {
    background-color: #0056b3;
  }
`;

const TodoList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
`;

const TodoItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9f9f9;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 4px;
`;

const TodoText = styled.span`
  flex: 1;
  cursor: pointer;
  text-decoration: ${({ completed }) => (completed ? "line-through" : "none")};
  color: ${({ completed }) => (completed ? "#888" : "#000")};
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  border: none;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;

  &:hover {
    background-color: #a71d2a;
  }
`;

function App() {
  const [todos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  const fetchTodos = async () => {
    const res = await axios.get("http://127.0.0.1:8000/tasks/");
    setTodos(res.data);
  };

  const createTodo = async () => {
    await axios.post("http://127.0.0.1:8000/tasks/", {
      title: newTitle,
      description: "",
      completed: false,
    });
    setNewTitle("");
    fetchTodos();
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/tasks/${id}/`, {
        completed: !completed,
      });
      fetchTodos();
    } catch (err) {
      console.error("Error al actualizar tarea:", err.response?.data);
      alert("No se pudo actualizar la tarea.");
    }
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/tasks/${id}/`);
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <Container>
      <Title>ToDo List</Title>
      <Input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Nueva tarea"
      />
      <Button onClick={createTodo}>Agregar</Button>
      <TodoList>
        {todos.map((todo) => (
          <TodoItem key={todo.id}>
            <TodoText
              completed={todo.completed}
              onClick={() => toggleComplete(todo.id, todo.completed)}
            >
              {todo.title}
            </TodoText>
            <DeleteButton onClick={() => deleteTodo(todo.id)}>X</DeleteButton>
          </TodoItem>
        ))}
      </TodoList>
    </Container>
  );
}

export default App;
