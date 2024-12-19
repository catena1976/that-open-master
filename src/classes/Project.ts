import { v4 as uuidv4 } from 'uuid'
import { Todo, ITodo } from './Todo';

export type ProjectStatus = "pending" | "active" | "finished";
export type UserRole = "architect" | "engineer" | "developer";

export interface IProject {
    id: string | null;
    iconColor: string | null;
    name: string;
    description: string;
    status: ProjectStatus;
    userRole: UserRole;
    finishDate: Date;
}

export class Project implements IProject {

    // Properties to satisfy the interface
    id: string = "";
    iconColor: string = "";
    name: string;
    description: string;
    status: ProjectStatus;
    userRole: UserRole;
    finishDate: Date;

    // Class properties
    cost: number = 0;
    progress: number = 0.5;
    todosList: Todo[] = [];

    private selectedTodo: Todo | null = null

    onTodoAdded = (todo: Todo) => { }
    onTodoDeleted = (id: string) => { }
    onTodoUpdated = (todo: Todo) => { }

    constructor(data: IProject, id = uuidv4()) {

        // Project data definition
        for (const key in data) {
            this[key] = data[key]
        }
    
        this.id = data.id || id || uuidv4();
        this.iconColor = data.iconColor || this.generateRandomColor();

        // Create UI
        this.getProjectInitials()
        // this.generateRandomColor()
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

    selectTodo(todo: Todo): void {
        this.selectedTodo = todo;
        // console.log("Selected todo: ", this.selectedTodoId);
    }

    getSelectedTodo(): Todo | null {
        return this.selectedTodo
    }

    // Method to add a todo to the project
    addTodo(data: ITodo, id?: string) {
        // check if title length is greater than 5
        if (!data.title || data.title.length < 5) {
            throw new Error("Todo name must be at least 5 characters long");
        }

        // check if todo with the same title already exists
        const existingTodoIndex = this.todosList.findIndex((todo) => todo.id === data.id)
        if (existingTodoIndex !== -1) {
            this.editTodo(new Todo(data));
        } else {

            const todo = new Todo(data, id);

            this.todosList.push(todo);
            this.selectTodo(todo)
            console.log("Todo added: ", todo);
            this.onTodoAdded(todo);
            console.log("Todos list: ", this.todosList);
            return todo;
        }
    }

    // Method to edit a todo
    editTodo(updatedTodo: Todo) {
        const todoIndex = this.todosList.findIndex((updatedTodo) => {
            return updatedTodo.id === this.selectedTodo?.id;
          });
        if (todoIndex !== -1) {
            // update the todo
            this.todosList[todoIndex].title = updatedTodo.title;
            this.todosList[todoIndex].description = updatedTodo.description;
            this.todosList[todoIndex].finishDate = updatedTodo.finishDate;
            this.todosList[todoIndex].completed = updatedTodo.completed;

            this.selectTodo(updatedTodo)
            this.onTodoUpdated(updatedTodo);
        } else {
            throw new Error("Todo not found");
        }
        console.log("Todo updated: ", updatedTodo);
        console.log("Todos list updated: ", this.todosList);
    }

    // Get a todo by its id
    getTodoById(id: string) {
        return this.todosList.find(todo => todo.id === id);
    }
};