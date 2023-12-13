import { v4 as uuidv4 } from 'uuid'
import { Todo } from './Todo';

export type ProjectStatus = "pending" | "active" | "finished";
export type UserRole = "architect" | "engineer" | "developer";

export interface IProject {
    name: string;
    description: string;
    status: ProjectStatus;
    userRole: UserRole;
    finishDate: Date;
}

export class Project implements IProject {

    // Properties to satisfy the interface
    name: string;
    description: string;
    status: ProjectStatus;
    userRole: UserRole;
    finishDate: Date;

    // Class properties
    ui: HTMLDivElement | null = null;
    cost: number = 0;
    progress: number = 0.5;
    id: string = "";
    todosList: Todo[] = [];
    iconColor: string = "";

    constructor(data: Project) {

        // Project data definition
        for (const key in data) {
            this[key] = data[key]
        }
    
        (!data.id)? this.id = uuidv4() : this.id = data.id;
        this.iconColor = data.iconColor || this.generateRandomColor();

        // Create UI
        this.getProjectInitials()
        // this.generateRandomColor()
        this.setUI()
    };

    // Method to generate a random color
    generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        this.iconColor = color;
        return color;
    }

    // Method to get the initials of the project name
    getProjectInitials() {
        return this.name.split(' ').slice(0,2).map(word => word[0]).join('');
    }

    // Method to add a todo to the project
    addTodo(todo: Todo) {
        this.todosList.push(todo);
        console.log("Todo added: ", todo);
        console.log("Todos list: ", this.todosList);
    }

    // Get a todo by its id
    getTodoById(id: string) {
        return this.todosList.find(todo => todo.id === id);
    }

    // creates the UI for the project
    setUI() {
        // Project data UI
        if (this.ui && Object.keys(this.ui).length !== 0) return console.warn("UI already set");
        this.ui = document.createElement("div")
        this.ui.className = "project-card"
        const initials = this.getProjectInitials()
        const color = this.iconColor
        this.ui.innerHTML = `
        <div class="card-header">
            <p style="background-color: ${color}; padding: 10px; border-radius: 8px; aspect-ratio: 1; text-transform: uppercase;">${initials}</p>
            <div>
                <h5>${this.name}</h5>
                <p>${this.description}</p>
            </div>
        </div>
        <div class="card-content">
            <div class="card-property">
                <p style="color: #969696;">Status</p>
                <p>${this.status}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Role</p>
                <p>${this.userRole}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Cost</p>
                <p>$${this.cost}</p>
            </div>
            <div class="card-property">
                <p style="color: #969696;">Estimated Progress</p>
                <p>${this.progress * 100}%</p>
            </div>
        </div>
        `
    }
};