
import React, { useState } from "react";
import * as Router from 'react-router-dom'
import * as Firestore from 'firebase/firestore'
import { getCollection } from '../firebase/index'
import { IProject, Project, ProjectStatus, UserRole } from '../classes/Project'
import { ProjectsManager } from '../classes/ProjectsManager'
import { ProjectCard } from '../react-components/ProjectCard'
import { AlertModal } from './AlertModal'
import { SearchBox } from './SearchBox'

interface Props {
    projectsManager: ProjectsManager
}

// Get the Firestore collection reference for projects
const projectsCollection = getCollection<IProject>("/projects") as Firestore.CollectionReference<IProject>

export function ProjectsPage(props: Props) {

    // State for handling alert messages
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    // State to store the list of projects
    const [projects, setProjects] = useState<Project[]>(props.projectsManager.list)
    
    // Update projects state when a project is created, deleted, or updated
    props.projectsManager.onProjectCreated = () => {setProjects([...props.projectsManager.list])}
    props.projectsManager.onProjectDeleted = () => {setProjects([...props.projectsManager.list])}
    props.projectsManager.onProjectUpdated = () => {setProjects([...props.projectsManager.list])}

    // Function to fetch projects from Firestore once the component mounts
    const getFirestoreProjects = async () => {
        const firebaseProjects = await Firestore.getDocs(projectsCollection)
        for (const doc of firebaseProjects.docs) {
            const data = doc.data()
            // Create a project object with the correct finishDate type
            const project: IProject = {
                ...data,
                finishDate: (data.finishDate as unknown as Firestore.Timestamp).toDate() // Convert Firestore Timestamp to Date object as unknown type to avoid TypeScript error as Firestore.Timestamp is not assignable to Date type 
            }
            try {
                // Add the new project to the ProjectsManager
                props.projectsManager.newProject(project, doc.id)
            } catch (error) {
                // Handle project update if necessary
                // Update the project
            }
        }     
    }
    // Fetch projects from Firestore when the component mounts
    React.useEffect(() => {
        getFirestoreProjects()
    }, [])

    // Generate project cards for rendering
    const projectCards = projects.map((project) => {
        return (
            <Router.Link key={project.id} to={`/project/${project.id}`}>
                <ProjectCard key={project.id} project={project} />
            </Router.Link>
    )
    })

    // Open the 'New Project' modal
    const onNewProjectClick = () => {
        const modal = document.getElementById("new-project-modal") as HTMLDialogElement;
        modal ? modal.showModal() : console.warn("Edit modal id not found");
    }

    // Handle form submission for creating a new project
    const onFormSubmit = (e: React.FormEvent) => {
        // Get new project form element
        const projectForm = document.getElementById("new-project-form");
        if (!(projectForm && projectForm instanceof HTMLFormElement)) {return}

        e.preventDefault();

        // Get form data and parse finish date
        const formData = new FormData(projectForm);
        let finishDateString = formData.get("finishDate") as string;
        let finishDate = new Date(finishDateString);

        // Check if finish date is valid
        if (isNaN(finishDate.getTime())) {
            // Set a default date 30 days from now if invalid
            finishDate = new Date();
            finishDate.setDate(finishDate.getDate() + 30);
            } else {
                // If the date is in the past, throw an error
                if (finishDate.getTime() < Date.now()) {
                    const modal = document.getElementById("alert-modal") as HTMLDialogElement;
                    modal ? modal.showModal() : console.warn("Modal id not found");
                    modal.innerHTML = "Please, select a future date.";
                    return;
                }
            }

        // Create project data object
        const projectData: IProject = {
            id: null,
            iconColor: null,
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            status: formData.get("status") as ProjectStatus,
            userRole: formData.get("userRole") as UserRole,
            finishDate: finishDate
        }

        try {
            // Add the new project to Firestore
            Firestore.addDoc(projectsCollection, projectData)
            // Add the new project to the ProjectsManager
            const project = props.projectsManager.newProject(projectData);
            console.log("New project created: ", project)
            // Reset form and close modal
            projectForm.reset();
            const modal = document.getElementById("new-project-modal") as HTMLDialogElement;
            modal ? modal.close() : console.warn("Modal id not found");
        } catch (err) {
            // Show error message in the alert modal
            const modal = document.getElementById("alert-modal") as HTMLDialogElement;
            modal ? modal.showModal() : console.warn("Modal id not found");
            modal.innerHTML = err.message;
        }
    }

    // Export projects to a JSON file
    const onExportProject = () => {
        props.projectsManager.exportToJSON()
    }

    // Import projects from a JSON file
    const onImportProject = () => {
        props.projectsManager.importFromJSON()
    }

    // Filter projects based on search input
    const handleOnProjectSearch = (value: string) => {
        setProjects(props.projectsManager.filterProjects(value))
    }

    return (
            <div className="page" id="projects-page" style={{ display: "flex" }}>
                {/* New Project Modal */}
                <dialog id="new-project-modal">
                    <form onSubmit={(e) => {onFormSubmit(e)}} id="new-project-form">
                        <h2>New Project</h2>
                        <div className="input-list">
                            <div className="form-field-container">
                                <label>
                                    <span className="material-symbols-rounded">apartment</span>Name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="What's the name of your project?"
                                />
                                <p
                                    style={{
                                        color: "gray",
                                        fontSize: "var(--font-sm)",
                                        marginTop: 5,
                                        fontStyle: "italic"
                                    }}
                                >
                                    TIP: Give it a short name
                                </p>
                            </div>
                            <div className="form-field-container">
                                <label>
                                    <span className="material-symbols-rounded">subject</span>Description
                                </label>
                                <textarea
                                    name="description"
                                    cols={30}
                                    rows={5}
                                    placeholder="Give your project a nice description! So people is jealous about it."
                                    defaultValue={""}
                                />
                            </div>
                            <div className="form-field-container">
                                <label>
                                    <span className="material-symbols-rounded">person</span>Role
                                </label>
                                <select name="userRole">
                                    <option>Archiect</option>
                                    <option>Engineer</option>
                                    <option>Developer</option>
                                </select>
                            </div>
                            <div className="form-field-container">
                                <label>
                                    <span className="material-symbols-rounded">
                                        not_listed_location
                                    </span>
                                    Status
                                </label>
                                <select name="status">
                                    <option>Pending</option>
                                    <option>Active</option>
                                    <option>Finished</option>
                                </select>
                            </div>
                            <div className="form-field-container">
                                <label htmlFor="finishDate">
                                    <span className="material-symbols-rounded">calendar_month</span>
                                    Finish Date
                                </label>
                                <input name="finishDate" type="date" />
                            </div>
                        </div>
                        <div
                            style={{ display: "flex", margin: "10px 0px 10px auto", columnGap: 10 }}
                        >
                            <button
                                type="button"
                                id="cancel-new-project-btn"
                                style={{ backgroundColor: "transparent" }}
                            >
                                Cancel
                            </button>
                            <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>
                                Accept
                            </button>
                        </div>
                    </form>
                </dialog>
                {/* Header with search box and action buttons */}
                <header>
                    <h2>Projects</h2>
                    <SearchBox handleOnProjectSearch={(value) => handleOnProjectSearch(value)} />
                    <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
                        <span
                            id="import-projects-btn"
                            className="material-symbols-rounded action-icon"
                            onClick={onImportProject}
                        >
                            file_upload
                        </span>
                        <span
                            id="export-projects-btn"
                            className="material-symbols-rounded action-icon"
                            onClick={onExportProject}
                        >
                            file_download
                        </span>
                        <button onClick={onNewProjectClick} id="new-proyect-btn">
                            <span className="material-symbols-rounded">add</span>New Project
                        </button>
                    </div>
                </header>
                {/* Render project cards or show alert if no projects */}
                {
                    projects.length > 0 ? <div id="projects-list">{ projectCards }</div> : <AlertModal message='No projects found to display' onClose={() => setAlertMessage(null)}/>
                }
            </div>
    )
}