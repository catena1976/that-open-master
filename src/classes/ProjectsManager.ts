import { IProject, Project } from "./Project.ts"
import { ITodo, Todo } from "./Todo.ts"

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

export class ProjectsManager {

    list: Project[] = []

    onProjectCreated = (project: Project) => { }
    onProjectDeleted = (id: string) => { }
    onProjectUpdated = (project: Project) => { }

    onTodoAdded = (todo: Todo) => { }
    onTodoDeleted = (id: string) => { }
    onTodoUpdated = (todo: Todo) => { }

    totalCost: number = 0
    private selectedProjectId: string | null = null

    getSelectedProject(): string | null {
        return this.selectedProjectId
    }

    selectProject(project: Project): void {
        this.selectedProjectId = project.id;
        // console.log("Selected project: ", this.selectedProjectId);
    }

    getProjectById(id: string | null | undefined): Project | undefined {

        if (!id) return undefined;

        const project = this.list.find((project) => project.id === id);

        return project;

    }

    getProjectByName(name: string) {
        const project = this.list.find((project) => {
            return project.name === name
        })
        return project
    }

    getTodoById(id: string) {
        const project = this.list.find((project) => {
            return project.id === this.selectedProjectId
        })
        if (!project) return console.warn("Project not found")
        const todo = project.todosList.find((todo) => {
            return todo.id === id
        })
        // console.log("Todo found: ", todo)
        return todo
    }

    filterProjects(value: string) {
        const filteredProjects = this.list.filter((project) => {
            return project.name.includes(value)
        })
        return filteredProjects
    }

    newProject(data: IProject, id?: string ) {

        // Check if name lenght is greater than 5
        if (data.name.length < 5) {
            toggleModal("alert-modal", true)
            alertMessage.innerHTML = "Project name must be at least 5 characters long";
        }

        // Check if project with the same id already exists
        let existingProjectIndex = this.getProjectById(data.id);
        if (existingProjectIndex) {
            // If the project exists, update it
            this.editProject(new Project(data, id));
        } else {

            // Check if project name is already in use
            const projectsName = this.list.map((project) => { return project.name }) // Get all project names
            const nameInUse = projectsName.includes(data.name)
            if (nameInUse) {
                toggleModal("alert-modal", true)
                alertMessage.innerHTML = `A project with the name "${data.name}" already exists`;
                // throw new Error(`A project with the name "${data.name}" already exists`)
                return
            }

            const project = new Project(data)

            this.list.push(project)
            this.onProjectCreated(project)
            // this.getTotalCost()
            // console.log("New project created", this);
            // console.log("Projects list: ", this.list)
            return project;
        }
    }

    editProject(updatedProject: Project) {
        const projectIndex = this.list.findIndex((updatedProject) => {
            return updatedProject.id === this.selectedProjectId;
        });

        if (projectIndex !== -1) {
            // Update the existing project
            this.list[projectIndex].name = updatedProject.name;
            this.list[projectIndex].description = updatedProject.description;
            this.list[projectIndex].status = updatedProject.status;
            this.list[projectIndex].userRole = updatedProject.userRole;
            this.list[projectIndex].finishDate = updatedProject.finishDate;
            this.list[projectIndex].cost = updatedProject.cost;
            this.list[projectIndex].progress = updatedProject.progress;

            this.onProjectUpdated(updatedProject)

        } else {
            console.error(`Project with id ${updatedProject.id} not found.`);
        }
        console.log("Project edited: ", updatedProject)
        console.log("Projects list updated: ", this.list)
        // this.setTodosList(updatedProject)
    }

    deleteProject(id: string) {
        const project = this.getProjectById(id)
        if (!project) return console.warn("Project not found")

        const remaining = this.list.filter((project) => { return project.id !== id })
        this.list = remaining
        this.onProjectDeleted(id)
    }

    exportToJSON(filename: string = "projects") {
        const json = JSON.stringify(this.list, null, 2)
        const blob = new Blob([json], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }

    importFromJSON() {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'application/json'
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            const json = reader.result
            if (!json) { return }
            const projects: IProject[] = JSON.parse(json as string)
            for (const project of projects) {
                try {
                    this.newProject(project)
                } catch (error) {

                }
            }
        })
        input.addEventListener('change', () => {
            const filesList = input.files
            if (!filesList) { return }
            reader.readAsText(filesList[0])
        })
        input.click()
    }

    getTotalCost() {
        this.totalCost = this.list.reduce((total, project) => total + project.cost, 0)

        console.log("Total cost: ", this.totalCost, "$")
    }
}