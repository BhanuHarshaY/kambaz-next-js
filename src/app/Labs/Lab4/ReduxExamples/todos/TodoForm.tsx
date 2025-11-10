import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, updateTodo, setTodo } from "./todosReducer";
import { ListGroupItem, Button, FormControl } from "react-bootstrap";

interface Todo {
  id: string | number;
  title: string;
}

interface TodosState {
  todo: Todo;
}

interface RootState {
  todosReducer: TodosState;
}

export default function TodoForm() {
  const { todo } = useSelector((state: RootState) => state.todosReducer);
  const dispatch = useDispatch();

  return (
    <ListGroupItem className="d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-2 w-100">
         <FormControl
          value={todo.title || ""}
          onChange={(e) =>
            dispatch(setTodo({ ...todo, title: e.target.value }))
          }
          className="flex-grow-1"
        />
        <Button
          style={{ backgroundColor: "#f1c40f", borderColor: "#f1c40f" }}
          onClick={() => dispatch(updateTodo(todo))}
          id="wd-update-todo-click"
        >
          Update
        </Button>
        <Button
          style={{ backgroundColor: "green", borderColor: "green" }}
          onClick={() => dispatch(addTodo(todo))}
          id="wd-add-todo-click"
        >
          Add
        </Button>
      </div>
    </ListGroupItem>
  );
}