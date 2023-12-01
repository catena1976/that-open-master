import { IProject, Project } from "./Project.ts"

export class ProjectsManager {

    list: Project[] = []
    ui: HTMLElement
    totalCost: number = 0

    constructor(container: HTMLElement) {
        this.ui = container
    }

    newProject(data: IProject) {
        const nameInUse = this.list.map((project) => project.name) // Get all project names
        if(nameInUse.includes(data.name)) throw new Error("There is already a project with that name!  Please, try again with a different name." )
        const project = new Project(data)

        project.ui.addEventListener('click', () => {
            const projectsPage = document.getElementById("projects-page") as HTMLDivElement
            const detailsPage = document.getElementById("project-details") as HTMLDivElement
            if(!(projectsPage && detailsPage)) return console.warn("Pages not found")
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
        })

        this.ui.append(project.ui)
        this.list.push(project)
        this.getTotalCost()
        return project;
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

    deleteProject(id: string) {
        const project = this.getProjectById(id)
        if(!project) return console.warn("Project not found")
        project.ui.remove()

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
        })

        input.addEventListener('change', () => {
            const filesList = input.files
            if(!filesList) return console.warn("No file selected")
            reader.readAsText(filesList[0])
        })
        input.click()
        
        console.log("Imported projects: ", this.list)
    }

    getTotalCost() {
        this.totalCost = this.list.reduce((total, project) => total + project.cost, 0)

        console.log("Total cost: ", this.totalCost, "$")
    }
}