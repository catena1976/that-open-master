import React, { useState, useEffect } from "react";
import { Project } from "../classes/Project";
import { Todo, ITodo } from '../classes/Todo';
import { ToDosList } from './ToDosList';
import { TodoDetailsModal } from './TodoDetailsModal';
import { TodoEditModal } from './TodoEditModal';
import { TodoNewModal } from './TodoNewModal';
import * as Firestore from 'firebase/firestore'
import { getCollection, deleteDocument, getDocument } from "../firebase/index";
import { SearchBoxToDo } from "./SearchBoxToDo";

interface Props {
    project: Project,
}

// Get the Firestore collection reference for todos collection
const todosCollection = getCollection<ITodo>("/todos") as Firestore.CollectionReference<ITodo>

export function ToDos(props: Props) {
    const [todos, setTodos] = useState<Todo[]>(props.project.todosList);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(props.project.getSelectedTodo());
    console.log("Selected Todo:", selectedTodo);

    const [isModalTodoDetailsOpen, setIsModalTodoDetailsOpen] = useState(false);
    const [isModalTodoEditOpen, setIsModalToDoEditOpen] = useState(false);
    const [isModalToDoNewOpen, setIsModalToDoNewOpen] = useState(false);

    // Set the onTodoAdded handler
    useEffect(() => {
        props.project.onTodoAdded = () => {
        setTodos([...props.project.todosList]);

        // Asing the onTodoDeleted handler
        props.project.onTodoDeleted = async (id: string) => {
            // Delete the todo from Firestore
            await deleteDocument("/todos", id)
        // Update the state
        setTodos([...props.project.todosList])
        }

        setSelectedTodo(props.project.getSelectedTodo());
        };
    // If you have onTodoDeleted and onTodoUpdated, set them here as well
     }, [props.project, props.project.getSelectedTodo()]);

    // Fetch todos for the project from Firestore when the component mounts
    useEffect(() => {
        const fetchTodos = async () => {
        // Optionally clear existing todosList
        props.project.todosList = [];
          await getFirestoreTodos(props.project.id);
          // Update the todos state after fetching
          setTodos([...props.project.todosList]);
        };
        fetchTodos();
      }, [props.project.id]);

    // Get docs from the todos collection matching the project ID
    const getFirestoreTodos = async (projectId: string): Promise<Todo[]> => {
        const querySnapshot = await Firestore.getDocs(Firestore.query(todosCollection, Firestore.where("projectId", "==", projectId)));
        const todos: Todo[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Create a todo object with the correct finsihDate type
            const todo: ITodo = {
                ...data,
                finishDate: (data.finishDate as unknown as Firestore.Timestamp).toDate(),
                id: doc.id
            }
            try {
                // Add the todo to the project
                props.project.addTodo(todo, doc.id);
            } catch (error) {
                // Log the error
                console.error("Error adding todo to project: ", error);
            }
            // Add the new todo to the project
        });
        return todos;
    }

    const handleOnClickDetails = (selectedTodo: Todo | null): void => {
        if (selectedTodo) {
            props.project.selectTodo(selectedTodo);
            setSelectedTodo(selectedTodo);
        }
        setIsModalTodoDetailsOpen(true);
    }

    const handleOnEditTodoClick = (selectedTodo: Todo | null): void => {
        if (selectedTodo) {
            props.project.selectTodo(selectedTodo);
            setSelectedTodo(selectedTodo);
        }
        setIsModalTodoDetailsOpen(false);
        setIsModalToDoEditOpen(true);
    }

    const handleOnCloseDetailsModal = () => {
        setIsModalTodoDetailsOpen(false);
    }

    const handleOnCloseEditToDoModal = () => {
        setIsModalToDoEditOpen(false);
        setIsModalTodoDetailsOpen(true);
    }

    const handleOnCloseNewToDoModal = () => {
        setIsModalToDoNewOpen(false);
    }

    const HandleOnNewTodoClick = () => {
        setIsModalToDoNewOpen(true);
    }

    // Handle form submission for creating a new todo
    const handleOnNewTodoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("1: New todo form submitted")
        // Get new todo form element
        const todoForm = document.getElementById("new-todo-form")
        if (!(todoForm && todoForm instanceof HTMLFormElement)) { return }
        // Get form data and parse finish date
        const formData = new FormData(todoForm)
        console.log("2: Form data entries: ", Array.from(formData.entries()));
        let finishDateString = formData.get("new-todo-finish-date") as string
        console.log("2.0: Finish date string: ", finishDateString);
        let finishDate = new Date(finishDateString)
        console.log("2.1: Finish date: ", finishDate);

        // Check if finish date is valid
        if (isNaN(finishDate.getTime())) {
            // Set a default finish date 30 days from now
            finishDate = new Date()
            finishDate.setDate(finishDate.getDate() + 30)
        } else {
            // If the date is in the past, throw an error
            if (finishDate.getTime() < Date.now()) {
                alert("Finish date cannot be in the past")
                return
            }

            // Create a new todo object
            const todoData: ITodo = {
                id: null,
                projectId: props.project.id,
                title: formData.get("new-todo-title") as string,
                description: formData.get("new-todo-description") as string,
                finishDate: finishDate,
                completed: formData.get("new-todo-completed") !== null
            }
            console.log("3: New todo data: ", todoData)

            try {
                // Add the new todo to Firestore
                const docRef = Firestore.addDoc(todosCollection, todoData)
                console.log("3: New todo added to Firestore: ", docRef)
                // Add the new todo to the project
                const todo = props.project.addTodo(todoData)
                console.log("4: New todo added: ", todo)
                // Reset the form
                todoForm.reset()
                // Close the modal
                setIsModalToDoNewOpen(false)
            } catch (error) {
                console.error("Error adding new todo: ", error)
            }
        }
    }
    
    // Handle form submission for deleting a todo
    const handleOnTodoDeletion = async (todo: Todo) => {
        console.log('handleOnTodoDeletion called in ToDos.tsx');
        console.log('Deleting todo: ', todo);
        // Delete the todo from the project
        props.project.deleteTodo(todo.id)
        // Update the state
        setTodos([...props.project.todosList])

        // Close any open modals if necessary
        setIsModalTodoDetailsOpen(false);
        setIsModalToDoEditOpen(false);
    }
    
    // Handle form submission for updating a todo
    const handleOnTodoUpdated = (updatedTodo: Todo) => {
        // Update the todo in the project
        props.project.addTodo(updatedTodo)
    }

    // Filter projects based on search input
    const handleOnToDotSearch = (value: string) => {
        setTodos(props.project.filterTodos(value))
    }
    return (
        <>
            {/* Todo Details Modal */}
            {isModalTodoDetailsOpen && selectedTodo && (
                <TodoDetailsModal 
                    todo={selectedTodo} 
                    handleOnCloseDetailsModal={() => handleOnCloseDetailsModal()} 
                    handleOnEditTodoClick={handleOnEditTodoClick} 
                    handleOnTodoDeletion={handleOnTodoDeletion}
                />
            )}
            {/* Modal for edit a To-Do item */}
            {isModalTodoEditOpen && selectedTodo && (
                <TodoEditModal 
                    todo={selectedTodo} 
                    handleOnCloseEditToDoModal={() => handleOnCloseEditToDoModal()} 
                    onTodoUpdated={handleOnTodoUpdated}
                    handleOnTodoDeletion={handleOnTodoDeletion}
                />
            )}
            {/* Modal for edit a To-Do item */}
            {isModalToDoNewOpen && (
                <TodoNewModal onSubmit={handleOnNewTodoSubmit} handleOnCloseNewToDoModal={() => handleOnCloseNewToDoModal()} />
            )}
            <div className="dashboard-card" style={{ flexGrow: 1 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "20px 30px",
                        justifyContent: "space-between",
                    }}
                >
                    <h4>To-Do</h4>
                    <div
                        style={{
                            display: "flex",
                            columnGap: 20,
                            justifyContent: "end",
                            alignItems: "center",
                        }}
                    >
                        {/* Search box for To-Do items */}
                        {/* <SearchBoxToDo handleOnToDotSearch={(value) => handleOnToDotSearch(value)} /> */}
                        <div style={{ display: "flex", alignItems: "center", columnGap: 10 }}>
                            <span className="material-symbols-rounded">search</span>
                            <input
                                type="text"
                                placeholder="Search To-Do by name"
                                style={{ width: "100%" }}
                            />
                        </div>
                        {/* Button to add a new To-Do item */}
                        <span onClick={HandleOnNewTodoClick} id="add-todo-btn" className="material-symbols-rounded">
                            add
                        </span>
                    </div>
                </div>
                {/* List of To-Do items */}
                <ToDosList project={props.project} todos={todos} selectedTodo={selectedTodo} handleOnClickDetails={handleOnClickDetails} />
            </div>
        </>
    )
}