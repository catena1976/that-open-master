import * as React from 'react';

interface Props {
    handleOnCloseNewToDoModal: () => void,
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function TodoNewModal (props: Props) {
    const { handleOnCloseNewToDoModal, onSubmit } = props

    return (
       <dialog id="new-todo-modal" open>
        <form onSubmit={onSubmit} id="new-todo-form">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>New Todo</h4>
          </div>
          <div className="form-field-container">
            <label htmlFor="new-todo-title">Title</label>
            <input id="new-todo-title" name="new-todo-title" type="text" />
          </div>
          <div className="form-field-container">
            <label htmlFor="new-todo-description">Description</label>
            <textarea id="new-todo-description" name="new-todo-description" defaultValue={""} />
          </div>
          <div className="form-field-container">
            <label htmlFor="new-todo-finish-date">Date</label>
            <input id="new-todo-finish-date" name="new-todo-finish-date" type="date" />
          </div>
          <div className="form-field-container">
            <label style={{ justifyContent: "center" }} htmlFor="new-todo-completed">
              Completed
            </label>
            <input
              className="material-symbols-rounded"
              id="new-todo-completed"
              name="new-todo-completed"
              type="checkbox"
            />
          </div>
          <div style={{ display: "flex", margin: "10px 0px 10px auto", columnGap: 10 }}>
            <button
              onClick={handleOnCloseNewToDoModal}
              type="button"
              id="cancel-new-todo-btn"
              style={{ backgroundColor: "transparent" }}
            >
              Close
            </button>
            <button type="submit" id="new-todo-submit-btn" className="btn-secondary">
            <p style={{ width: "100%" }}>Accept</p>
            </button>
          </div>
        </form>
      </dialog>
    )
}