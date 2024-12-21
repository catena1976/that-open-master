import * as React from 'react';
import { Project } from '../classes/Project';
import { Todo } from '../classes/Todo';

interface Props {
    todo: Todo,
    handleOnCloseDetailsModal: () => void,
    handleOnEditTodoClick: (selectedTodo: Todo | null) => void
    handleOnTodoDeletion: (todo: Todo) => void;
}

export function TodoDetailsModal (props: Props) {

    const { todo, handleOnCloseDetailsModal, handleOnEditTodoClick, handleOnTodoDeletion } = props

    return (
        <dialog id="details-todo-modal" open>
        <form>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Todo Details</h4>
            {/* Button to delete the project */}
            <button
              type="button"
              onClick={() => {
                console.log('Delete button clicked');
                handleOnTodoDeletion(todo)}}
              style={{ backgroundColor: "red" }}
            >
              Delete To-Do
            </button>
          </div>
          {/* Display todo details */}
          <div className="form-field-container">
            <label htmlFor="todo-details-title">Title</label>
            <input
              name="todo-details-title"
              type="text"
              readOnly
              value={todo.title}
            />
          </div>
          <div className="form-field-container">
            <label htmlFor="todo-details-description">Description</label>
            <textarea
              name="todo-details-description"
              readOnly
              value={todo.description}
            />
          </div>
          <div className="form-field-container">
            <label htmlFor="edit-todo-finish-date">Date</label>
            <input 
              id="edit-todo-finish-date" 
              name="new-todo-finish-date" 
              type="date" 
              value={todo.finishDate.toISOString().slice(0,10) }
              readOnly
              />
          </div>
          <div className="form-field-container">
            <label style={{ justifyContent: "center" }} htmlFor="edit-todo-completed">
              Completed
            </label>
            <input
              className="material-symbols-rounded"
              id="edit-todo-completed"
              name="new-todo-completed"
              type="checkbox"
              checked={todo.completed}
              readOnly
            />
          </div>
          {/* Other fields as necessary */}
          <div style={{ display: 'flex', margin: '10px 0px 10px auto', columnGap: 10, justifyContent: 'space-between' }}>
            <button type="button" onClick={handleOnCloseDetailsModal} style={{ backgroundColor: 'transparent' }}>
              Close
            </button>
            {/* Button to open the edit modal */}
            <button
                onClick={() => handleOnEditTodoClick(todo)}
                id="edit-project-btn"
                className="btn-secondary"
            >
                <p style={{ width: "100%" }}>Edit</p>
            </button>
            {/* Additional buttons if needed */}
          </div>
        </form>
      </dialog>
    )
}