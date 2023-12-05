import { IProject, Project } from "./Project.ts"

export class ProjectsManager {

    list: Project[] = []
    ui: HTMLElement
    totalCost: number = 0
    private selectedProjectId: string | null = null

    constructor(container: HTMLElement) {
        this.ui = container
        const project = this.newProject({
            name: "Default Project",
            description: "This is just a default app project",
            status: "active",
            userRole: "architect",
            finishDate: new Date()
        })
        // project.ui.click()
    }

    newProject(data: IProject) {

        // Check if name lenght is greater than 5
        if(data.name.length < 5 ) throw new Error("Project name must be at least 5 characters long")

        // Check if project name is already in use
        const nameInUse = this.list.map((project) => project.name) // Get all project names
        if(nameInUse.includes(data.name)) throw new Error("There is already a project with that name!  Please, try again with a different name." )
        const project = new Project(data)

        project.ui?.addEventListener('click', () => {
            this.setDetailsPage(project)
            const projectsPage = document.getElementById("projects-page") as HTMLDivElement
            const detailsPage = document.getElementById("project-details") as HTMLDivElement
            if(!(projectsPage && detailsPage)) return console.warn("Pages not found")
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
        })
        if (project.ui) {
            this.ui.append(project.ui);
        }
        this.list.push(project)
        this.getTotalCost()
        console.log("New project created", this);
        console.log("Projects list: ", this.list)
        return project;
    }

    private setDetailsPage(project: Project) {
        const detailsPage = document.getElementById("project-details") as HTMLDivElement
        if(!detailsPage) return console.warn("Page not found")
        const name = detailsPage.querySelector("[data-project-info='name']")
        if(name) name.textContent = project.name
        const description = detailsPage.querySelector("[data-project-info='description']")
        if(description) description.textContent = project.description
        const cardName = detailsPage.querySelector("[data-project-info='cardName']")
        if(cardName) cardName.textContent = project.name
        const cardDescription = detailsPage.querySelector("[data-project-info='cardDescription']")
        if(cardDescription) cardDescription.textContent = project.description
        const status = detailsPage.querySelector("[data-project-info='status']")
        if(status) status.textContent = project.status
        const userRole = detailsPage.querySelector("[data-project-info='userRole']")
        if(userRole) userRole.textContent = project.userRole
        const finishDate = detailsPage.querySelector("[data-project-info='finishDate']")
        if(finishDate) {
            let dateString = project.finishDate
            let dateObj = new Date(dateString)
            finishDate.textContent = dateObj.toDateString() 
        }
        const cost = detailsPage.querySelector("[data-project-info='cost']")
        if(cost) cost.textContent = `$${project.cost}`
        const progress = detailsPage.querySelector("[data-project-info='progress']") as HTMLDivElement
        if(progress) {
            progress.textContent = `${project.progress * 100}%`
            progress.style.width = `${project.progress * 100}%`;
        }
        this.selectProject(project)
    }

    getSelectedProject(): string | null {
        return this.selectedProjectId
    }

    selectProject(project: Project) : void {
        this.selectedProjectId = project.id;
        console.log("Selected project: ", this.selectedProjectId);
    }

    getProjectById(id: string) {
        const project = this.list.find( (project) => {
            return project.id === id
        })
        return project
    }

    getProjectByName(name: string) {
        const project = this.list.find( (project) => {
            return project.name === name
        })
        return project
    }

    editProject(updatedProject: Project) {
        const projectIndex = this.list.findIndex((project) => {
            return project.id === this.selectedProjectId;
        });
    
        if (projectIndex !== -1) {
            updatedProject.setUI();
            
            // delete old project
            this.list.splice(projectIndex, 1);

            // updatet ui
            this.ui.innerHTML = "";
            for (const project of this.list) {
                if (project.ui) {
                    this.ui.append(project.ui);
                }
            }

            // create new project
            this.newProject(updatedProject);
            this.setDetailsPage(updatedProject);
  
        } else {
            console.error(`Project with id ${updatedProject.id} not found.`);
        }
        console.log("Project edited: ", updatedProject)
        console.log("Projects list: ", this.list)
    }

    deleteProject(id: string) {
        const project = this.getProjectById(id)
        if(!project) return console.warn("Project not found")
        project.ui?.remove()

        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
    }

    exportToJSON(filename: string = "projects"){
        const json = JSON.stringify(this.list, null, 2)
        const blob = new Blob([json], {type: "application/json"})
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
    }

    importFromJSON(){
        const input = document.createElement("input")
        input.type = 'file'
        input.accept = 'application/json'
        const reader = new FileReader()

        reader.addEventListener('load', () => {
            const json = reader.result
            if(!json) return console.warn("No file selected")
            const projects: IProject[] = JSON.parse(json as string)
            for (const projectData of projects) {
                try {
                    this.newProject(projectData)
                } catch (error) {
                    alert(error.message)
                }
            }
            console.log("Imported projects: ", this.list)
        })

        input.addEventListener('change', () => {
            const filesList = input.files
            if(!filesList) return console.warn("No file selected")
            reader.readAsText(filesList[0])
        })
        input.click()
    }

    getTotalCost() {
        this.totalCost = this.list.reduce((total, project) => total + project.cost, 0)

        console.log("Total cost: ", this.totalCost, "$")
    }
}