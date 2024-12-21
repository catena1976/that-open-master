import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProjectsManager } from "../classes/ProjectsManager";
import { Project } from "../classes/Project";
import { ProjectDetails } from "./ProjectDetails";
import { AlertModal } from './AlertModal';
import { EditProjectDetailsModal } from "./EditProjectDetailsModal";
import { deleteDocument, getDocument } from "../firebase/index";
import { Timestamp } from "firebase/firestore";

interface Props {
  projectsManager: ProjectsManager;
}

// Component to display the details of a specific project
export function ProjectDetailsPage(props: Props) {

  const { projectsManager } = props;

  // Get the project ID from the route parameters
  const { id } = useParams<{ id: string }>();
  console.log("Project ID from route params:", id);
  // If no project ID is provided, display an alert
  if (!id) {
    return <AlertModal message="Project ID is needed to see this page" onClose={() => setAlertMessage(null)} />;
  }

  // State to store the project data
  const [project, setProject] = useState<Project | null>(null);

  // State to control the visibility of the edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for alert messages
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Fetch the project data when the component mounts or when the ID changes
  // useEffect(() => {
  //   const loadProject = async () => {
  //     if (!id) {
  //       setAlertMessage("Project ID is needed to see this page.");
  //       return;
  //     }
  //     // Check if the project is already in ProjectsManager
  //     let proj = projectsManager.getProjectById(id);
  //     console.log("Project from ProjectsManager:", proj);

  //     // If not found, attempt to fetch it from Firestore
  //     if (!proj) {
  //       // Fetch project from Firestore if not in ProjectsManager
  //       try {
  //         console.log("Loading project from Firestore:", id);
  //         const projectData = await getDocument<Project>("/projects", id);
  //         if (!projectData) {
  //           setAlertMessage(`The project with ID ${id} wasn't found.`);
  //           return;
  //         }
  //         // Add this new project to ProjectsManager          
  //         proj = projectsManager.newProject({ ...projectData });
  //       } catch (error) {
  //         console.error("Error loading project:", error);
  //         setAlertMessage("Error loading project data.");
  //       }
  //     }
  //     setProject(proj || null);
  //   };

  //   loadProject();
  // }, [id, projectsManager]);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setAlertMessage("Project ID is needed to see this page.");
        return;
      }

      // Fetch project from Firestore
      try {
        console.log("Loading project from Firestore:", id);
        const projectData = await getDocument<Project>("/projects", id);
        if (!projectData) {
          setAlertMessage(`The project with ID ${id} wasn't found.`);
          return;
        }
        // Add this new project to ProjectsManager          
        const project = projectsManager.newProject({ ...projectData });
      } catch (error) {
        console.error("Error loading project:", error);
        setAlertMessage("Error loading project data.");
      }
    }
    setProject(project || null);

    loadProject();
  }, [id, projectsManager]);

  const navigateTo = useNavigate();

  // Assign the onProjectDeleted event handler
  useEffect(() => {
    projectsManager.onProjectDeleted = async (id: string) => {
      // Delete the project from Firestore
      await deleteDocument("/projects", id);
      // Navigate back to home
      navigateTo("/");
    };
  }, [projectsManager, navigateTo]);

  // If the project is not found, display an alert
  if (!project) {
    return <AlertModal message={`The project with ID ${id} wasn't found`} onClose={() => setAlertMessage(null)} />;
  }

  if (!project) {
    return <div>Loading...</div>;
  }

  // Function to handle project deletion
  const handleOnProjectDeletion = async () => {
    // Delete the project using ProjectsManager
    await projectsManager.deleteProject(project.id);
    // Navigate back to the home page after deletion
    navigateTo("/");
  };

  // Open the edit project modal
  const handleOnEditProjectClick = () => {
    setIsModalOpen(true);
  };

  // Close the edit project modal
  const onClose = () => {
    setIsModalOpen(false);
  };

  // Handle project updates
  const handleProjectUpdate = async (updatedProject: Project) => {
    const updatedProj = await getDocument<Project>("/projects", updatedProject.id);
    console.log("Project updated: ", updatedProj);
    // Convert finishDate to Date object if necessary
    if (updatedProj.finishDate instanceof Timestamp) {
      updatedProj.finishDate = updatedProj.finishDate.toDate();
    } else if (typeof updatedProj.finishDate === "string") {
      updatedProj.finishDate = new Date(updatedProj.finishDate);
    }
    // Update the project state
    setProject(updatedProj);
    setIsModalOpen(false);
  };

  // Set the onProjectUpdated handler
  projectsManager.onProjectUpdated = (project) => {
    handleProjectUpdate(project);
  };

  return (
    <div className="page" id="project-details">
      {/* Modal for editing project details */}
      {isModalOpen && (
        <EditProjectDetailsModal
          project={project}
          onClose={onClose}
          onProjectUpdate={handleProjectUpdate}
        />
      )}
      {/* Display the project header */}
      <header>
        <div>
          {/* Display project name */}
          <h2 data-project-info="name">{project.name}</h2>
          {/* Display project description */}
          <p data-project-info="description" style={{ color: "#969696" }}>
            {project.description}
          </p>
        </div>
        {/* Button to delete the project */}
        <button
          onClick={handleOnProjectDeletion}
          style={{ backgroundColor: "red" }}
        >
          Delete project
        </button>
      </header>
      {/* Display the project details */}
      <ProjectDetails project={project} handleOnEditProjectClick={handleOnEditProjectClick} />
      {/* Modal for editing a To-Do item */}
      <dialog id="edit-todo-modal">
        <form id="edit-todo-form">
          <h4>Todo Edit</h4>
          <div className="form-field-container">
            <label htmlFor="edit-todo-title">Title</label>
            <input id="edit-todo-title" type="text" />
          </div>
          <div className="form-field-container">
            <label htmlFor="edit-todo-description">Description</label>
            <textarea id="edit-todo-description" defaultValue={""} />
          </div>
          <div className="form-field-container">
            <label htmlFor="edit-todo-finish-date">Date</label>
            <input id="edit-todo-finish-date" type="date" />
          </div>
          <div className="form-field-container">
            <label style={{ justifyContent: "center" }} htmlFor="edit-todo-completed">
              Completed
            </label>
            <input
              className="material-symbols-rounded"
              id="edit-todo-completed"
              type="checkbox"
            />
          </div>
          <div style={{ display: "flex", margin: "10px 0px 10px auto", columnGap: 10 }}>
            {/* Button to cancel editing */}
            <button
              type="button"
              id="cancel-edit-todo-btn"
              style={{ backgroundColor: "transparent" }}
            >
              Close
            </button>
            {/* Button to submit the edited To-Do */}
            <button type="submit" id="edit-todo-submit-btn" className="btn-secondary">
              <p style={{ width: "100%" }}>Accept</p>
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}