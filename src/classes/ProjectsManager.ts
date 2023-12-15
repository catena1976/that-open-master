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
    ui: HTMLElement
    totalCost: number = 0
    private selectedProjectId: string | null = null
    private selectedTodoId: string | null = null

    constructor(container: HTMLElement) {
        this.ui = container
        const project = this.newProject({
            name: "Default Project",
            id: "default-project-id",
            iconColor: "#686868",
            description: "This is just a default app project",
            status: "active",
            userRole: "architect",
            finishDate: new Date()
        })

        project?.addTodo(new Todo({
            projectId: project.id,
            title: "Default Todo",
            description: "This is just a default todo",
            finishDate: new Date(),
            completed: true
        }))

        this.setTodosList(project)
        project?.ui?.click()
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

    selectTodo(todo: Todo): void {
        this.selectedTodoId = todo.id;
        console.log("Selected todo: ", this.selectedTodoId);
    }

    getSelectedTodo(): string | null {
        return this.selectedTodoId
    }

    getTodoById(id: string) {
        const project = this.list.find( (project) => {
            return project.id === this.selectedProjectId
        })
        if(!project) return console.warn("Project not found")
        const todo = project.todosList.find( (todo) => {
            return todo.id === id
        })
        console.log("Todo found: ", todo)
        return todo
    }

    newProject(data: IProject) {

        // Check if name lenght is greater than 5
        if(data.name.length < 5 ) throw new Error("Project name must be at least 5 characters long")

        // Check if project with the same id already exists
        const existingProjectIndex = this.list.findIndex((project) => project.id === data.id);
        if (existingProjectIndex !== -1) {
            this.editProject(new Project(data))
            } else {

                // Check if project name is already in use
                const nameInUse = this.list.map((project) => project.name) // Get all project names
                if(nameInUse.includes(data.name))   {
                    toggleModal("alert-modal", true)
                    alertMessage.innerHTML = "There is already a project with that name!  Please, try again with a different name.";
                    return;
                }

                const project = new Project(data)

                // Add event listener to project ui
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

            // updatet ui
            this.list[projectIndex].setUI();

            // Add event listener to project ui
            this.list[projectIndex].ui?.addEventListener('click', () => {
                this.setDetailsPage(updatedProject)
                const projectsPage = document.getElementById("projects-page") as HTMLDivElement
                const detailsPage = document.getElementById("project-details") as HTMLDivElement
                if(!(projectsPage && detailsPage)) return console.warn("Pages not found")
                projectsPage.style.display = "none"
                detailsPage.style.display = "flex"
            })
            this.ui.innerHTML = "";
            for (const project of this.list) {
                if (project.ui) {
                    this.ui.append(project.ui);
                }
            }

            this.setDetailsPage(updatedProject);
  
        } else {
            console.error(`Project with id ${updatedProject.id} not found.`);
        }
        console.log("Project edited: ", updatedProject)
        console.log("Projects list: ", this.list)
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
        this.setTodosList(project)
    }

    private setTodosList(project?: Project) {
        console.log("setTodosList > Project: ", project)
        const todosList = document.getElementById("todos-list") as HTMLDivElement
        if(!todosList) return console.warn("List not found")
        todosList.innerHTML = ""
        if (project) {
            for (const todo of project.todosList) {
                const todoItem = document.createElement("div")
                todoItem.className = "todo-item"

                let dateObj = new Date(todo.finishDate)
                let formattedDate = dateObj.toDateString()

                let completedIcon = todo.completed ? 'check_box' : 'check_box_outline_blank';
                todo.completed? todoItem.style.backgroundColor = 'lightgreen' : todoItem.style.backgroundColor = 'coral'; 

                todoItem.innerHTML = `
                    <div style="display: flex; column-gap: 25; justify-content: space-between; align-items: center;">
                        <div style="display: flex; column-gap: 25px; align-items: center;">
                            <span class="material-symbols-rounded" style="padding: 10px; background-color: #686868; border-radius: 10px;">construction</span>
                            <p >${todo.title}</p>
                        </div>
                        <p style="white-space: nowrap; margin-left: 10px;">${formattedDate}</p>
                        <div class="material-symbols-rounded" style="padding: 15px;">${completedIcon}</div>
                        <!-- <div class="material-symbols-rounded" style="padding: 10px; background-color: #686868; border-radius: 10px;">check_box</div> -->
                    </div>
                `

                // add event listener to todo item
                todoItem.addEventListener('click', () => this.setTodoDetailsPage(todo))
                todosList.append(todoItem)
            }
        }
    }

    // Get cancel edit details todo button and add event listener
    // const cancelEditTodoButton = document.getElementById("cancel-edit-todo-details-button") as HTMLButtonElement

    // Method to edit a todo
    setTodoDetailsPage(data: Todo) {
        const projectSelected = this.getSelectedProject()
        if(!projectSelected) return console.warn("No project selected")
        const project = this.getProjectById(projectSelected)
        const todo = project?.getTodoById(data.id)
        console.log("setTodoDetailsPage > Todo to edit: ", todo)
        const todoDetails = document.getElementById("todo-details-modal") as HTMLDialogElement

        const todoDetailsForm = document.getElementById("todo-details-form") as HTMLFormElement
        if(todoDetailsForm) {
            const titleElement = todoDetailsForm.elements.namedItem("todo-details-title") as HTMLInputElement
            const descriptionElement = todoDetailsForm.elements.namedItem("todo-details-description") as HTMLInputElement
            const finishDateElement = todoDetailsForm.elements.namedItem("todo-details-finish-date") as HTMLInputElement
            const completedElement = todoDetailsForm.elements.namedItem("todo-details-completed") as HTMLInputElement

            if(todo) {
                if(titleElement) titleElement.value = todo.title
                if(descriptionElement) descriptionElement.value = todo.description
                if(finishDateElement) {
                    const finishDate = new Date(todo.finishDate);
                    if (!isNaN(finishDate.getTime())) {
                        finishDateElement.value = finishDate.toISOString().split('T')[0];
                    } else {
                        console.error('Invalid finish date:', todo.finishDate);
                    }
                }
                if(completedElement) completedElement.checked = todo.completed
                this.selectTodo(todo)
            }
        }
        todoDetails.showModal()
    }

    // Method to add a todo to the current project
    newTodoToCurrentProject(data: ITodo) {
        const currentProject = this.getProjectById(data.projectId);
        if (currentProject) {
        // Check if name lenght is greater than 5
            // if(data.title.length < 5 ) throw new Error("ToDo title must be at least 5 character")

            const todo = new Todo(data);
            currentProject.addTodo(todo);

            this.setDetailsPage(currentProject)
        } else {
            console.error(`Project with id ${this.selectedProjectId} not found.`);
        }
    }
    

    // Method to edit a todo
    editTodoInCurrentProject(updatedTodo: Todo) {
        // console.log("Todo to edit: ", updatedTodo);
        const currentProject = this.getProjectById(updatedTodo.projectId);
        // console.log("Current project: ", currentProject);
        if (currentProject) {
            const todo = currentProject.getTodoById(updatedTodo.id);
            // console.log("Todo to edit: ", todo);
            if (todo) {
                (todo.title !== updatedTodo.title)? todo.title = updatedTodo.title : todo.title = todo.title;
                (todo.description !== updatedTodo.description)? todo.description = updatedTodo.description : todo.description = todo.description;
                (todo.finishDate !== updatedTodo.finishDate)? todo.finishDate = updatedTodo.finishDate : todo.finishDate = todo.finishDate;
                (todo.completed !== updatedTodo.completed)? todo.completed = updatedTodo.completed : todo.completed = todo.completed;

                console.log("Todo edited: ", todo);
                console.log("Todos list: ", currentProject.todosList);

                this.setDetailsPage(currentProject)
            } else {
                console.error(`Todo with id ${updatedTodo.id} not found.`);
            }
        } else {
            console.error(`Project with id ${updatedTodo.projectId} not found.`);
        }
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
            const projects: Project[] = JSON.parse(json as string)
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