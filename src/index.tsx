// Import necessary classes and types
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import * as Router from "react-router-dom"
import { ProjectsManager } from "./classes/ProjectsManager.ts"
import { Sidebar } from "./react-components/Sidebar"
import { ProjectsPage} from "./react-components/ProjectsPage.tsx"
import { ProjectDetailsPage } from "./react-components/ProjectDetailsPage.tsx"
import { Project, IProject, ProjectStatus, UserRole } from "./classes/Project.ts";
import { Todo, ITodo } from "./classes/Todo.ts";

const projectsManager = new ProjectsManager()

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
    <>
        <Router.BrowserRouter>
            <Sidebar />
            <Router.Routes>
                <Router.Route path="/" element={<ProjectsPage projectsManager={projectsManager} />} />
                <Router.Route path="/project/:id" element={<ProjectDetailsPage projectsManager={projectsManager} />} />
            </Router.Routes>
        </Router.BrowserRouter>
    </>
)

// Get add todo button and add event listener
// const addTodoBtn = document.getElementById("add-todo-btn");
// addTodoBtn?.addEventListener("click", () => toggleModal("new-todo-modal", true));

// Get cancel new todo button and add event listener
// const cancelNewTodoBtn = document.getElementById("cancel-new-todo-btn");
// cancelNewTodoBtn?.addEventListener("click", () => toggleModal("new-todo-modal", false));

// Get new todo form
// const newTodoForm = document.getElementById("new-todo-form") as HTMLFormElement;

// Add event listener to new todo form
// if (newTodoForm) {
//     newTodoForm.addEventListener("submit", (e) => {
//         e.preventDefault();

//         const selectedProjectId = projectsManager.getSelectedProject();
//         console.log("Selected project for todo: ", selectedProjectId);
//         if (!selectedProjectId) return console.warn("No project selected");
//         // Get form data
//         const formData = new FormData(newTodoForm);
//         let finishDateString = formData.get("todo-date") as string;
//         let finishDate = new Date(finishDateString);

//         // Check if finish date is valid
//         if (isNaN(finishDate.getTime())) {
//             // If not valid, set a default date
//             finishDate = new Date();
//             finishDate.setDate(finishDate.getDate() + 30);
//             } else {
//                 // If the date is in the past, throw an error
//                 if (finishDate.getTime() < Date.now()) {
//                     toggleModal("alert-modal", true)
//                     alertMessage.innerHTML = "Please, select a future date.";
//                     return;
//                 }
//             }
//         const todoData: ITodo = {
//             title: formData.get("todo-title") as string,
//             description: formData.get("todo-description") as string,
//             finishDate,
//             completed: formData.get("todo-completed") === "on" ? true : false,
//             projectId: selectedProjectId
//         }

//         // Create new todo and add to project
//         try {
//             projectsManager.newTodoToCurrentProject(todoData);
//             // Reset form and close modal
//             newTodoForm.reset();
//             toggleModal("new-todo-modal", false);
//             // TO DO:  Set the project details page

//         } catch (err) {
//             toggleModal("alert-modal", true)
//             alertMessage.innerHTML = err.message;
//         }
//     })
// }


// Get close todo details button and add event listener
// const closeTodoDetailsBtn = document.getElementById("close-todo-details-btn");
// closeTodoDetailsBtn?.addEventListener("click", () => toggleModal("todo-details-modal", false));



// Get edit todo button
// const editTodoBtn = document.getElementById("edit-todo-btn");
// Add event listener to edit todo button
// editTodoBtn?.addEventListener("click", (e) => {
//     e.preventDefault();
//     const selectedTodo = projectsManager.getSelectedTodo();
//     if (!selectedTodo) return console.warn("No todo selected");
//     console.log("Edit Btn > Selected todo for edit: ", selectedTodo);
  
//     toggleModal("todo-details-modal", false);
//     updateTodoForm(selectedTodo)
//     toggleModal("edit-todo-modal", true);
// })


// Get cancel edit todo button and add event listener
// const cancelEditTodoBtn = document.getElementById("cancel-edit-todo-btn");
// cancelEditTodoBtn?.addEventListener("click", () => {
//     editTodoForm.reset();
//     toggleModal("edit-todo-modal", false);
//     toggleModal("todo-details-modal", true);
// })

// Get edit todo form
// const editTodoForm = document.getElementById("edit-todo-form") as HTMLFormElement;

// Function to update the todo form with the selected todo's details
// function updateTodoForm(id: string | null) {
//     if (!id) return console.warn("No todo selected");
//     const todo = projectsManager.getTodoById(id);
//     console.log("function updateTodoForm > Todo to edit ", todo);

//     if (editTodoForm) {
//         const titleElement = document.getElementById("edit-todo-title") as HTMLInputElement;
//         const descriptionElement = document.getElementById("edit-todo-description") as HTMLInputElement;
//         const finishDateElement = document.getElementById("edit-todo-finish-date") as HTMLInputElement;
//         const completedElement = document.getElementById("edit-todo-completed") as HTMLInputElement;

//         if (todo) {        
//             if (titleElement) titleElement.value = todo.title;
//             if (descriptionElement) descriptionElement.value = todo.description;
//             if (finishDateElement) {
//                 const finishDate = new Date(todo.finishDate);
//                 if (!isNaN(finishDate.getTime())) {
//                     finishDateElement.value = finishDate.toISOString().split('T')[0];
//                 } else {
//                     console.error('Invalid finish date:', todo.finishDate);
//                 }
//             }
//             if (completedElement) completedElement.checked = todo.completed;
//         }
//     }
//     console.log("updateTodoForm: ", editTodoForm);
// }




// Add event listener to edit todo form
// if (editTodoForm) {
//     editTodoForm.addEventListener("submit", (e) => {
//         e.preventDefault();
//         console.log("Edit todo form from submit event: ", editTodoForm);
//         const selectedProject = projectsManager.getSelectedProject();
//         const selectedTodo = projectsManager.getSelectedTodo();

//         // Get form data and finish date
//         const formData = new FormData(editTodoForm);
//         console.log("Form data from submit event: ", formData);
//         let finishDateString = editTodoForm.elements['edit-todo-finish-date'].value;
//         let finishDate = new Date(finishDateString);
//         console.log("Finish date: ", finishDate);

//         // Check if finish date is valid
//         if (isNaN(finishDate.getTime())) {
//             // If not valid, set a default date
//             finishDate = new Date();
//             // finishDate.setDate(finishDate.getDate() + 30);
//         } else {
//             // If the date is in the past, throw an error
//             if (finishDate.getTime() < Date.now()) {
//                 // toggleModal("alert-modal", true)
//                 // alertMessage.innerHTML = "Please, select a future date.";
//                 // return;
//             }
//         }

//         const todoData: ITodo = {
//             projectId: selectedProject? selectedProject : "",
//             title: editTodoForm.elements['edit-todo-title'].value,
//             description: editTodoForm.elements['edit-todo-description'].value,
//             finishDate,
//             completed: editTodoForm.elements['edit-todo-completed'].checked,
//         }
//         // Create todo data and add to manager
//         const updatedTodo = new Todo(todoData)
//         updatedTodo.id = selectedTodo? selectedTodo : "";
//         console.log("Updated todo from submit event: ", updatedTodo);
//         // if (selectedTodo) updatedTodo.id = selectedTodo;
        
//         try {
//             projectsManager.editTodoInCurrentProject(updatedTodo);
//             // Reset form and close modal
//             editTodoForm.reset();
//             toggleModal("edit-todo-modal", false);
//             // toggleModal("todo-details-modal", true);
//             // projectsManager.setDetailsPage(selectedProject);
//         } catch (err) {
//             toggleModal("alert-modal", true)
//             alertMessage.innerHTML = err.message;
//         }
//     });
// }

