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

// Add event listener to Projects button
const projectsBtn = document.getElementById("projects-btn");
projectsBtn?.addEventListener("click", () => {
    const projectsPage = document.getElementById("projects-page") as HTMLDivElement;
    const detailsPage = document.getElementById("project-details") as HTMLDivElement;
    if (!(projectsPage && detailsPage)) return console.warn("Pages not found");
    detailsPage.style.display = "none";
    projectsPage.style.display = "flex";
});

// Get cancel button and form elements
const cancelNewProjectBtn = document.getElementById("cancel-new-project-btn");
const projectForm = document.getElementById("new-project-form") as HTMLFormElement;

// Add event listener to cancel button
cancelNewProjectBtn?.addEventListener("click", () => {
    projectForm.reset();
    toggleModal("new-project-modal", false);
});

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
        const finishDateString = formData.get("finishDate") as string;
        const finishDate = new Date(finishDateString);

        // Check if finish date is valid
        if (!isNaN(finishDate.getTime())) {
            // Create new project and add to manager
            const projectData: IProject = {
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                status: formData.get("status") as ProjectStatus,
                userRole: formData.get("userRole") as UserRole,
                finishDate: finishDate,
            };

            try {
                projectsManager.newProject(new Project(projectData));
                // Reset form and close modal
                projectForm.reset();
                toggleModal("new-project-modal", false);
            } catch (err) {
                toggleModal("alert-modal", true)
                alertMessage.innerHTML = err.message;
            }

        } else {
            console.error("Invalid date format for finishDate");
        }
    });

    const exportProjectsBtn = document.getElementById("export-projects-btn");
    exportProjectsBtn?.addEventListener("click", () => projectsManager.exportToJSON());

    const importProjectsBtn = document.getElementById("import-projects-btn");
    importProjectsBtn?.addEventListener("click", () => projectsManager.importFromJSON());
};