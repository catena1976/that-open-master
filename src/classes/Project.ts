import { v4 as uuidv4 } from 'uuid'

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
    ui: HTMLDivElement;
    cost: number = 0;
    progress: number = 0.5;
    id: string;

    constructor(data: IProject) {

        // Project data definition
        for (const key in data) {
            this[key] = data[key]
        }
    
        this.id = uuidv4()

        this.setUI()

        console.log("New project created", this);
    };

    // creates the UI for the project
    setUI() {
        // Project data UI
        if (this.ui && Object.keys(this.ui).length !== 0) return console.warn("UI already set");
        this.ui = document.createElement("div")
        this.ui.className = "project-card"
        this.ui.innerHTML = `
        <div class="card-header">
            <p style="background-color: #ca8134; padding: 10px; border-radius: 8px; aspect-ratio: 1;">HC</p>
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