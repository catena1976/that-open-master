import * as React from 'react';
import { Todo } from '../classes/Todo';

interface Props {

    todo: Todo,

    handleOnClickDetails: (todo: Todo) => void;

}

export function ToDoCard(props: Props) {

const { todo, handleOnClickDetails } = props;

return (
    <div onClick={(e) => handleOnClickDetails(todo)} className="todo-item">
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}
        >
            <div style={{ display: "flex", columnGap: 15, alignItems: "center" }}>
                {/* Icon for the To-Do item */}
                <span
                    className="material-icons-round"
                    style={{ padding: 10, backgroundColor: "#686868", borderRadius: 10 }}
                >
                    construction
                </span>
                {/* To-Do item description */}
                <p>{todo.description}</p>
            </div>
            {/* To-Do item date */}
            <p style={{ textWrap: "nowrap", marginLeft: 10 }}>{todo.finishDate.toDateString()}</p>
        </div>
    </div>
)
}