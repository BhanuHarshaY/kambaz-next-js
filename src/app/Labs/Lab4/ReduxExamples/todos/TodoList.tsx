import React from "react";
import { useSelector } from "react-redux";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import { ListGroup } from "react-bootstrap";

interface Todo {
  id: string | number;
  title: string;
}

interface TodosState {
  todos: Todo[];
}

interface RootState {
  todosReducer: TodosState;
}

export default function TodoList() {
  const { todos } = useSelector((state: RootState) => state.todosReducer);

  return (
    <div id="wd-todo-list-redux" className="p-3">
      <h2 className="mb-3">Todo List</h2>

      
      <div className="mb-3">
        <TodoForm />
      </div>

      
      <ListGroup>
        {todos.map((todo: Todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ListGroup>

      <hr />
    </div>
  );
}