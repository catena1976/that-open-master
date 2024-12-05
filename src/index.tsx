// Import necessary classes and types
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { Sidebar } from "./react-components/Sidebar"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { OBJLoader} from "three/examples/jsm/loaders/OBJLoader"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader"
import { GUI} from "three/examples/jsm/libs/lil-gui.module.min"
import { Project, IProject, ProjectStatus, UserRole } from "./classes/Project.ts";
import { Todo, ITodo } from "./classes/Todo.ts";
import { ProjectsManager } from "./classes/ProjectsManager.ts";

const rootElement = document.getElementById("app") as HTMLDivElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
    <Sidebar />
)

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
            id: null,
            iconColor: null,
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            status: formData.get("status") as ProjectStatus,
            userRole: formData.get("userRole") as UserRole,
            finishDate: finishDate
        }

        try {
            projectsManager.newProject(projectData);
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
        const selectedProjectId = projectsManager.getSelectedProject();
        const selectedProject = projectsManager.getProjectById(selectedProjectId? selectedProjectId : "");

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
            id: null,
            name: formData.get("name") as string,
            iconColor: null,
            description: formData.get("description") as string,
            status: formData.get("status") as ProjectStatus,
            userRole: formData.get("userRole") as UserRole,
            finishDate: finishDate,        
        }
        // Create project data and add to manager
        const updatedProject = new Project(projectData)
        if (selectedProjectId) {
            updatedProject.id = selectedProjectId;
            updatedProject.todosList = selectedProject?.todosList? selectedProject.todosList : [];
        }
        
        try {
            const detailsPage = document.getElementById("project-details") as HTMLDivElement
            const projectsPage = document.getElementById("projects-page") as HTMLDivElement
            projectsManager.editProject(updatedProject);
            console.log("Updated project: ", updatedProject);
            // Reset form and close modal
            editProjectForm.reset();
            toggleModal("edit-project-modal", false);
            if(!(projectsPage && detailsPage)) return console.warn("Pages not found")
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
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

// ThreeJS simple viewer
const scene = new THREE.Scene();

const viewerContainer = document.getElementById("viewer-container") as HTMLElement;

const containerDimensions = viewerContainer.getBoundingClientRect();
const aspectRatio = containerDimensions.width / containerDimensions.height;
const camera = new THREE.PerspectiveCamera(75, aspectRatio);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
viewerContainer.appendChild(renderer.domElement);

function resizeViewer(){
    const containerDimensions = viewerContainer.getBoundingClientRect();
    renderer.setSize(containerDimensions.width, containerDimensions.height);
    const aspectRatio = containerDimensions.width / containerDimensions.height;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
}

window.addEventListener("resize", resizeViewer);

resizeViewer();

const boxGeonetry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial();
const cube = new THREE.Mesh(boxGeonetry, material);

const directionalLight = new THREE.DirectionalLight();
// directionalLight.intensity = 10;
const ambientLight = new THREE.AmbientLight();
ambientLight.intensity = 0.4;

scene.add(directionalLight, ambientLight);

const cameraControls = new OrbitControls(camera, viewerContainer);

function renderScene() {
    renderer.render(scene, camera);
    requestAnimationFrame(renderScene);
}

renderScene();

// World helpers
const axes = new THREE.AxesHelper();
const grid = new THREE.GridHelper();
grid.material.transparent = true;
grid.material.opacity = 0.4;
grid.material.color = new THREE.Color("#808080");

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);

scene.add(axes, grid, directionalLightHelper);

// GUI
const gui = new GUI();
const cubeControls = gui.addFolder("Cube");

cubeControls.add(cube.position, "x", -10, 10, 0.1);
cubeControls.add(cube.position, "y", -10, 10, 0.1);
cubeControls.add(cube.position, "z", -10, 10, 0.1);

cubeControls.add(cube, "visible");
cubeControls.addColor(cube.material, "color");

const lightControls = gui.addFolder("Light");

lightControls.add(directionalLight, "visible");
lightControls.add(directionalLight, "intensity", 0, 10, 0.1);
lightControls.add(directionalLight.position, "x", -10, 10, 0.1);
lightControls.add(directionalLight.position, "y", -10, 10, 0.1);
lightControls.add(directionalLight.position, "z", -10, 10, 0.1);
lightControls.addColor(directionalLight, "color");
lightControls.add(directionalLight.rotation, "x", -10, 10, 0.1);
lightControls.add(directionalLight.rotation, "z", -10, 10, 0.1);

const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();

mtlLoader.load("../assets/Gear/Gear1.mtl", (materials) => {
    console.log("MTL loaded: ", materials);
    materials.preload();
    objLoader.setMaterials(materials);
});

objLoader.load("../assets/Gear/Gear1.obj", (mesh) => {
    console.log("OBJ loaded: ", mesh);
    scene.add(mesh);
});

