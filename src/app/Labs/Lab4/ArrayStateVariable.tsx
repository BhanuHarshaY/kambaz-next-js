import { useState } from "react";
import { useSelector } from "react-redux";
import { ListGroupItem, ListGroup } from "react-bootstrap";

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

export default function ArrayStateVariable() {
   const { todos } = useSelector((state: RootState) => state.todosReducer);

   const [array, setArray] = useState([1, 2, 3, 4, 5]);
   const addElement = () => {
     setArray([...array, Math.floor(Math.random() * 100)]);
   };
   const deleteElement = (index: number) => {
     setArray(array.filter((item, i) => i !== index));
   };

   return (
    <div id="wd-array-state-variables">
       <h2>Array State Variable</h2>
       <button
         style={{ backgroundColor: "green", color: "white" }}
         onClick={addElement}>
         Add Element
       </button>
       <ul>
        {array.map((item, index) => (
         <li key={index}>
           {item}
           <button
             style={{ backgroundColor: "red", color: "white", marginLeft: "5px" }}
             onClick={() => deleteElement(index)}>
             Delete
           </button>
         </li>
        ))}
       </ul>
       <hr/>
       <ListGroup>
          {todos.map((todo: Todo) => (
            <ListGroupItem key={todo.id}>
              {todo.title}
            </ListGroupItem>
          ))}
       </ListGroup>
       <hr />
    </div>
   );
}