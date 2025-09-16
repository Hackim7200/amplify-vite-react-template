import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [newTodoContent, setNewTodoContent] = useState("");
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  async function createTodo() {
    if (!newTodoContent.trim()) return;

    try {
      await client.models.Todo.create({
        content: newTodoContent.trim(),
        isDone: false,
        date: new Date().toISOString(),
        breakdown: [],
      });
      setNewTodoContent("");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  }

  async function toggleTodo(id: string, currentStatus: boolean) {
    try {
      await client.models.Todo.update({
        id,
        isDone: !currentStatus,
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  }

  async function deleteTodo(id: string) {
    try {
      await client.models.Todo.delete({ id });
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>{user?.signInDetails?.loginId}'s Todo List</h1>
        <button onClick={signOut}>Sign out</button>
      </header>

      <div className="add-todo">
        <input
          type="text"
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          placeholder="Add new todo..."
          onKeyPress={(e) => e.key === "Enter" && createTodo()}
        />
        <button onClick={createTodo}>Add</button>
      </div>

      <div className="todos">
        {todos.length === 0 ? (
          <p>No todos yet. Add one above!</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className={`todo ${todo.isDone ? "completed" : ""}`}
            >
              <input
                type="checkbox"
                checked={todo.isDone}
                onChange={() => toggleTodo(todo.id, todo.isDone)}
              />
              <span>{todo.content}</span>
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          ))
        )}
      </div>

      <footer>
        {todos.filter((todo) => todo.isDone).length} of {todos.length} completed
      </footer>
    </div>
  );
}

export default App;
