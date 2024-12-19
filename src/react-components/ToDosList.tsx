import React, { useState, useEffect } from "react";
import { Project } from "../classes/Project";
import { Todo } from '../classes/Todo';
import { ToDoCard } from './ToDoCard';

interface Props {
    project: Project,
    handleOnClickDetails: (todo: Todo) => void,
    todos: Todo[]
}

export function ToDosList(props: Props) {

    const { project, handleOnClickDetails } = props;
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(project.getSelectedTodo());
    console.log(selectedTodo);

    const todosCards = props.todos.map((todo) => {
        return (
            <ToDoCard key={todo.id} todo={todo} handleOnClickDetails={handleOnClickDetails} />
        )
    })

    return (
        <div
            id="todos-list"
            style={{
                display: "flex",
                flexDirection: "column",
                rowGap: 20,
                padding: "10px 30px",
            }}
        >
            {/* ToDo Item*/}
            {todosCards}
        </div>

    )
}