import React from "react";
import { useDispatch } from "react-redux";
import { deleteTodo, setTodo } from "./todosReducer";
import { ListGroupItem, Button } from "react-bootstrap";

interface Todo {
  id: string | number;
  title: string;
}

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const dispatch = useDispatch();

  return (
    <ListGroupItem className="d-flex align-items-center justify-content-between">
      <span>{todo.title}</span>
      <div className="d-flex gap-2">
        <Button
          style={{ backgroundColor: "blue", borderColor: "blue" }}
          onClick={() => dispatch(setTodo(todo))}
          id="wd-set-todo-click"
        >
          Edit
        </Button>
        <Button
          style={{ backgroundColor: "red", borderColor: "red" }}
          onClick={() => dispatch(deleteTodo(todo.id))}
          id="wd-delete-todo-click"
        >
          Delete
        </Button>
      </div>
    </ListGroupItem>
  );
}