import React, { useState, useRef } from "react";
import { Todo, ITodo } from '../classes/Todo';
import { updateDocument } from "../firebase/index";
import { AlertModal } from "./AlertModal";

interface Props {
  todo: Todo,
  handleOnCloseEditToDoModal: () => void,
  onTodoUpdated: (updatedTodo: Todo) => void
}

export function TodoEditModal(props: Props) {

  const { todo, handleOnCloseEditToDoModal, onTodoUpdated } = props
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // State to store the selected values
  const [selectedTitle, setSelectedTitle] = useState(todo.title);
  const [selectedDescription, setSelectedDescription] = useState(todo.description);
  const [selectedFinishDate, setSelectedFinishDate] = useState(todo.finishDate);
  const [selectedCompleted, setSelectedCompleted] = useState(todo.completed);  

  // Function to handle form submission
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset alert message before validation
    setAlertMessage(null);

    // Get form data and finish date
    const editTodoForm = formRef.current;
    if (!editTodoForm) return;

    const editFormData = new FormData(editTodoForm);
    let finishDateString = editFormData.get("new-todo-finish-date") as string;
    let finishDate = new Date(finishDateString);

    // Check if finish date is valid
    if (isNaN(finishDate.getTime())) {
      // If not valid, set a default date
      finishDate = new Date();
      finishDate.setDate(finishDate.getDate() + 30);
    } else {
      // If the date is in the past, throw an error
      if (finishDate.getTime() < Date.now()) {
        setAlertMessage("Finish date cannot be in the past");
        return;
      }
    }

    // Get the form data and create a new todo
    const udpdatedTodoData: ITodo = {
      id: todo.id as string,
      projectId: todo.projectId as string,
      title: editFormData.get("new-todo-title") as string,
      description: editFormData.get("new-todo-description") as string,
      completed: editFormData.get("new-todo-completed") !== null,
      finishDate: finishDate
    }

    try {
      await updateDocument<Partial<ITodo>>("/todos", todo.id, udpdatedTodoData);
      onTodoUpdated(new Todo(udpdatedTodoData));
      formRef.current?.reset();
      handleOnCloseEditToDoModal();
    } catch (error) {
      console.error("Error updating todo: ", error);
      setAlertMessage("Error updating todo");
    }
  }

  return (
    <>
      <dialog id="edit-todo-modal" open>
        <form onSubmit={onFormSubmit} ref={formRef} id="edit-todo-form">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4>Todo Edit</h4>
            {/* Button to delete the project */}
            <button
              style={{ backgroundColor: "red" }}
            >
              Delete To-Do
            </button>
          </div>
          <div className="form-field-container">
            <label htmlFor="edit-todo-title">Title</label>
            <input 
              id="edit-todo-title" 
              name="new-todo-title" 
              type="text"
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
              />
          </div>
          <div className="form-field-container">
            <label htmlFor="edit-todo-description">Description</label>
            <textarea 
              id="edit-todo-description" 
              name="new-todo-description" 
              defaultValue={""}
              value={selectedDescription}
              onChange={(e) => setSelectedDescription(e.target.value)}
              />
          </div>
          <div className="form-field-container">
            <label htmlFor="edit-todo-finish-date">Date</label>
            <input 
              id="edit-todo-finish-date" 
              name="new-todo-finish-date" 
              type="date"
              value={
                selectedFinishDate && !isNaN(selectedFinishDate.getTime())
                  ? selectedFinishDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => setSelectedFinishDate(new Date(e.target.value))}
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
            />
          </div>
          <div style={{ display: "flex", margin: "10px 0px 10px auto", columnGap: 10 }}>
            <button
              onClick={handleOnCloseEditToDoModal}
              type="button"
              id="cancel-edit-todo-btn"
              style={{ backgroundColor: "transparent" }}
            >
              Close
            </button>
            <button type="submit" id="edit-todo-submit-btn" className="btn-secondary">
              <p style={{ width: "100%" }}>Accept</p>
            </button>
          </div>
        </form>
      </dialog>
      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
    </>
  )
}