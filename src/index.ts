// Import necessary classes and types
import { Project, IProject, ProjectStatus, UserRole } from "./classes/Project.ts";
import { ProjectsManager } from "./classes/ProjectsManager.ts";

// Function to toggle modal visibility
function toggleModal(id: string, show: boolean) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    modal ? (show ? modal.showModal() : modal.close()) : console.warn("Modal id not found", id);
};

// Initialize project manager with the projects list UI
const projectsListUI = document.getElementById("projects-list") as HTMLElement;
const projectsManager = new ProjectsManager(projectsListUI);

// Add event listener to new project button
const newProjectBtn = document.getElementById("new-proyect-btn");
newProjectBtn?.addEventListener("click", () => toggleModal("new-project-modal", true));

// Add event listener to delete project button
const exportProjectsBtn = document.getElementById("export-projects-btn");
exportProjectsBtn?.addEventListener("click", () => projectsManager.exportToJSON());

// Add event listener to delete project button
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

// Get cancel new project button and form elements
const projectForm = document.getElementById("new-project-form") as HTMLFormElement;

// Get cancel new project button and add event listener
const cancelNewProjectBtn = document.getElementById("cancel-new-project-btn");
cancelNewProjectBtn?.addEventListener("click", () => {
    projectForm.reset();
    toggleModal("new-project-modal", false);
});

// Get edit project form
const editProjectForm = document.getElementById("edit-project-form") as HTMLFormElement;

// Get cancel edit button and add event listener
const cancelEditProjectBtn = document.getElementById("cancel-edit-project-btn");
cancelEditProjectBtn?.addEventListener("click", () => {
    editProjectForm.reset();
    toggleModal("edit-project-modal", false);
})

// Get alert message
const alertMessage = document.getElementById("alert-message") as HTMLParagraphElement;
// Get alert button
const alertButton = document.getElementById("alert-modal-btn");
// Add event listener to alert button
alertButton?.addEventListener("click", () => toggleModal("alert-modal", false));

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