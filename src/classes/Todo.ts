import { v4 as uuidv4 } from 'uuid'

export interface ITodo {

    id: string | null;
    projectId: string | null;
    title: string | null;
    description: string | null;
    finishDate: Date | null;
    completed: boolean | null;
}

export class Todo implements ITodo {

    // Properties to satisfy the interface
    id: string;
    projectId: string;
    title: string;
    description: string;
    finishDate: Date;
    completed: boolean;

    constructor( data: ITodo, id = uuidv4()) {
        // Todo data definition
        for (const key in data) {
            this[key] = data[key]
        }

        this.id = data.id || id || uuidv4();
}
}
