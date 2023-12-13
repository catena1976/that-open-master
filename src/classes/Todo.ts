import { v4 as uuidv4 } from 'uuid'

export interface ITodo {
    projectId: string;
    title: string;
    description: string;
    finishDate: Date;
    completed: boolean;
}

export class Todo implements ITodo {

    // Properties to satisfy the interface
    projectId: string;
    title: string;
    description: string;
    finishDate: Date;
    completed: boolean;

    // Class properties
    id: string;

    constructor( data: ITodo ) {
        // Todo data definition
        for (const key in data) {
            this[key] = data[key]
        }

        this.id = uuidv4()
}
}
