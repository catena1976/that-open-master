// Import necessary classes and types
import { Project, IProject, ProjectStatus, UserRole } from "./classes/Project.ts";
import { Todo, ITodo } from "./classes/Todo.ts";
import { ProjectsManager } from "./classes/ProjectsManager.ts";

// Function to toggle modal visibility
function toggleModal(id: string, show: boolean) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal ? (show ? modal.showModal() : modal.close()) : console.warn("Modal id not found", id);
};

// Get alert message
const alertMessage = document.getElementById("alert-message") as HTMLParagraphElement;
// Get alert button
const alertButton = document.getElementById("alert-modal-btn");
// Add event listener to alert button
alertButton?.addEventListener("click", () => toggleModal("alert-modal", false));

// Initialize project manager with the projects list UI
const projectsListUI = document.getElementById("projects-list") as HTMLElement;
const projectsManager = new ProjectsManager(projectsListUI);


// Add event listener to export project button
const exportProjectsBtn = document.getElementById("export-projects-btn");
exportProjectsBtn?.addEventListener("click", () => projectsManager.exportToJSON());

// Add event listener to import project button
const importProjectsBtn = document.getElementById("import-projects-btn");
importProjectsBtn?.addEventListener("click", () => projectsManager.importFromJSON());

// Add event listener to Projects button
const projectsBtn = document.getElementById("projects-btn");
projectsBtn?.addEventListener("click", () => {
    const projectsPage = document.getElementById("projects-page") as HTMLDivElement;
    const detailsPage = document.getElementById("project-details") as HTMLDivElement;
    if (!(projectsPage && detailsPage)) return console.warn("Pages not found");
    detailsPage.style.display = "none";
    projectsPage.style.display = "flex";
});

// Add event listener to new project button
const newProjectBtn = document.getElementById("new-proyect-btn");
newProjectBtn?.addEventListener("click", () => toggleModal("new-project-modal", true));

// Ge new project form element
const projectForm = document.getElementById("new-project-form") as HTMLFormElement;

// Get cancel new project button and add event listener
const cancelNewProjectBtn = document.getElementById("cancel-new-project-btn");
cancelNewProjectBtn?.addEventListener("click", () => {
    projectForm.reset();
    toggleModal("new-project-modal", false);
});

// Add event listeners to form if it exists
if (projectForm) {
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get form data and finish date
        const formData = new FormData(projectForm);
        let finishDateString = formData.get("finishDate") as string;
        let finishDate = new Date(finishDateString);

        // Check if finish date is valid
        if (isNaN(finishDate.getTime())) {
            // If not valid, set a default date
            finishDate = new Date();
            finishDate.setDate(finishDate.getDate() + 30);
            } else {
                // If the date is in the past, throw an error
                if (finishDate.getTime() < Date.now()) {
                    toggleModal("alert-modal", true)
                    alertMessage.innerHTML = "Please, select a future date.";
                    return;
                }
            }

        // Create new project and add to manager
        const projectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            status: formData.get("status") as ProjectStatus,
            userRole: formData.get("userRole") as UserRole,
            finishDate: finishDate
        }

        try {
            projectsManager.newProject( projectData);
            // Reset form and close modal
            projectForm.reset();
            toggleModal("new-project-modal", false);
        } catch (err) {
            toggleModal("alert-modal", true)
            alertMessage.innerHTML = err.message;
        }
    });
};

// Get the edit project button
const editProjectBtn = document.getElementById("edit-project-btn");

// Add event listener to the edit project button
editProjectBtn?.addEventListener("click", () => {
    const selectedProject = projectsManager.getSelectedProject();
    const projectsPage = document.getElementById("projects-page") as HTMLDivElement;
    const detailsPage = document.getElementById("project-details") as HTMLDivElement;
    if (!(projectsPage && detailsPage)) return console.warn("Pages not found");
    detailsPage.style.display = "none";
    projectsPage.style.display = "flex";
    updateEditForm(selectedProject);
    toggleModal("edit-project-modal", true);
});

// Get edit project form
const editProjectForm = document.getElementById("edit-project-form") as HTMLFormElement;

// Get cancel edit button and add event listener
const cancelEditProjectBtn = document.getElementById("cancel-edit-project-btn");
cancelEditProjectBtn?.addEventListener("click", () => {
    editProjectForm.reset();
    toggleModal("edit-project-modal", false);
})

// Function to update the edit form with the selected project's details
function updateEditForm(id: string | null) {
    if (!id) return console.warn("No project selected");
    const project = projectsManager.getProjectById(id);

    if (editProjectForm) {
        const nameElement = editProjectForm.elements.namedItem("name") as HTMLInputElement;
        const descriptionElement = editProjectForm.elements.namedItem("description") as HTMLInputElement;
        const statusElement = editProjectForm.elements.namedItem("status") as HTMLSelectElement;
        const userRoleElement = editProjectForm.elements.namedItem("userRole") as HTMLSelectElement;
        const finishDateElement = editProjectForm.elements.namedItem("finishDate") as HTMLInputElement;

        if (project) {        
            if (nameElement) nameElement.value = project.name;
            if (descriptionElement) descriptionElement.value = project.description;
            if (statusElement) statusElement.value = project.status;
            if (userRoleElement) userRoleElement.value = project.userRole;
            if (finishDateElement) {
                const finishDate = new Date(project.finishDate);
                if (!isNaN(finishDate.getTime())) {
                    finishDateElement.value = finishDate.toISOString().split('T')[0];
                } else {
                    console.error('Invalid finish date:', project.finishDate);
                }
            }
        }
    }
}

// Add event listeners to edit project form if it exists
if (editProjectForm) {
    editProjectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectedProject = projectsManager.getSelectedProject();

        // Get form data and finish date
        const formData = new FormData(editProjectForm);
        let finishDateString = formData.get("finishDate") as string;
        let finishDate = new Date(finishDateString);

        // Check if finish date is valid
        if (isNaN(finishDate.getTime())) {
            // If not valid, set a default date
            finishDate = new Date();
            finishDate.setDate(finishDate.getDate() + 30);
        } else {
            // If the date is in the past, throw an error
            if (finishDate.getTime() < Date.now()) {
                toggleModal("alert-modal", true)
                alertMessage.innerHTML = "Please, select a future date.";
                return;
            }
        }

        const projectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            status: formData.get("status") as ProjectStatus,
            userRole: formData.get("userRole") as UserRole,
            finishDate: finishDate,        
        }
        // Create project data and add to manager
        const updatedProject = new Project(projectData)
        if (selectedProject) updatedProject.id = selectedProject;
        
        try {
            projectsManager.editProject(updatedProject);
            // Reset form and close modal
            editProjectForm.reset();
            toggleModal("edit-project-modal", false);
        } catch (err) {
            toggleModal("alert-modal", true)
            alertMessage.innerHTML = err.message;
        }
    });
};


// Get add todo button and add event listener
const addTodoBtn = document.getElementById("add-todo-btn");
addTodoBtn?.addEventListener("click", () => toggleModal("new-todo-modal", true));

// Get cancel new todo button and add event listener
const cancelNewTodoBtn = document.getElementById("cancel-new-todo-btn");
cancelNewTodoBtn?.addEventListener("click", () => toggleModal("new-todo-modal", false));

// Get new todo form
const newTodoForm = document.getElementById("new-todo-form") as HTMLFormElement;

// Add event listener to new todo form
if (newTodoForm) {
    newTodoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const selectedProjectId = projectsManager.getSelectedProject();
        console.log("Selected project for todo: ", selectedProjectId);
        if (!selectedProjectId) return console.warn("No project selected");
        // Get form data
        const formData = new FormData(newTodoForm);
        let finishDateString = formData.get("todo-date") as string;
        let finishDate = new Date(finishDateString);

        // Check if finish date is valid
        if (isNaN(finishDate.getTime())) {
            // If not valid, set a default date
            finishDate = new Date();
            finishDate.setDate(finishDate.getDate() + 30);
            } else {
                // If the date is in the past, throw an error
                if (finishDate.getTime() < Date.now()) {
                    toggleModal("alert-modal", true)
                    alertMessage.innerHTML = "Please, select a future date.";
                    return;
                }
            }
        const todoData: ITodo = {
            title: formData.get("todo-title") as string,
            description: formData.get("todo-description") as string,
            finishDate,
            completed: formData.get("todo-completed") === "on" ? true : false,
            projectId: selectedProjectId
        }

        // Create new todo and add to project
        try {
            projectsManager.newTodoToCurrentProject(todoData);
            // Reset form and close modal
            newTodoForm.reset();
            toggleModal("new-todo-modal", false);
            // TO DO:  Set the project details page

        } catch (err) {
            toggleModal("alert-modal", true)
            alertMessage.innerHTML = err.message;
        }
    })
}


// Get close todo details button and add event listener
const closeTodoDetailsBtn = document.getElementById("close-todo-details-btn");
closeTodoDetailsBtn?.addEventListener("click", () => toggleModal("todo-details-modal", false));



// Get edit todo button
const editTodoBtn = document.getElementById("edit-todo-btn");
// Add event listener to edit todo button
editTodoBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    const selectedTodo = projectsManager.getSelectedTodo();
    if (!selectedTodo) return console.warn("No todo selected");
    console.log("Edit Btn > Selected todo for edit: ", selectedTodo);
  
    toggleModal("todo-details-modal", false);
    updateTodoForm(selectedTodo)
    toggleModal("edit-todo-modal", true);
})


// Get cancel edit todo button and add event listener
const cancelEditTodoBtn = document.getElementById("cancel-edit-todo-btn");
cancelEditTodoBtn?.addEventListener("click", () => {
    editTodoForm.reset();
    toggleModal("edit-todo-modal", false);
    toggleModal("todo-details-modal", true);
})

// Get edit todo form
const editTodoForm = document.getElementById("edit-todo-form") as HTMLFormElement;

// Function to update the todo form with the selected todo's details
function updateTodoForm(id: string | null) {
    if (!id) return console.warn("No todo selected");
    const todo = projectsManager.getTodoById(id);
    console.log("function updateTodoForm > Todo to edit ", todo);

    if (editTodoForm) {
        const titleElement = document.getElementById("edit-todo-title") as HTMLInputElement;
        const descriptionElement = document.getElementById("edit-todo-description") as HTMLInputElement;
        const finishDateElement = document.getElementById("edit-todo-finish-date") as HTMLInputElement;
        const completedElement = document.getElementById("edit-todo-completed") as HTMLInputElement;

        if (todo) {        
            if (titleElement) titleElement.value = todo.title;
            if (descriptionElement) descriptionElement.value = todo.description;
            if (finishDateElement) {
                const finishDate = new Date(todo.finishDate);
                if (!isNaN(finishDate.getTime())) {
                    finishDateElement.value = finishDate.toISOString().split('T')[0];
                } else {
                    console.error('Invalid finish date:', todo.finishDate);
                }
            }
            if (completedElement) completedElement.checked = todo.completed;
        }
    }
    console.log("updateTodoForm: ", editTodoForm);
}




// Add event listener to edit todo form
if (editTodoForm) {
    editTodoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Edit todo form from submit event: ", editTodoForm);
        const selectedProject = projectsManager.getSelectedProject();
        const selectedTodo = projectsManager.getSelectedTodo();

        // Get form data and finish date
        const formData = new FormData(editTodoForm);
        console.log("Form data from submit event: ", formData);
        let finishDateString = editTodoForm.elements['edit-todo-finish-date'].value;
        let finishDate = new Date(finishDateString);
        console.log("Finish date: ", finishDate);

        // Check if finish date is valid
        if (isNaN(finishDate.getTime())) {
            // If not valid, set a default date
            finishDate = new Date();
            // finishDate.setDate(finishDate.getDate() + 30);
        } else {
            // If the date is in the past, throw an error
            if (finishDate.getTime() < Date.now()) {
                // toggleModal("alert-modal", true)
                // alertMessage.innerHTML = "Please, select a future date.";
                // return;
            }
        }

        const todoData: ITodo = {
            projectId: selectedProject? selectedProject : "",
            title: editTodoForm.elements['edit-todo-title'].value,
            description: editTodoForm.elements['edit-todo-description'].value,
            finishDate,
            completed: editTodoForm.elements['edit-todo-completed'].checked,
        }
        // Create todo data and add to manager
        const updatedTodo = new Todo(todoData)
        updatedTodo.id = selectedTodo? selectedTodo : "";
        console.log("Updated todo from submit event: ", updatedTodo);
        // if (selectedTodo) updatedTodo.id = selectedTodo;
        
        try {
            projectsManager.editTodoInCurrentProject(updatedTodo);
            // Reset form and close modal
            editTodoForm.reset();
            toggleModal("edit-todo-modal", false);
            // toggleModal("todo-details-modal", true);
            // projectsManager.setDetailsPage(selectedProject);
        } catch (err) {
            toggleModal("alert-modal", true)
            alertMessage.innerHTML = err.message;
        }
    });
}

