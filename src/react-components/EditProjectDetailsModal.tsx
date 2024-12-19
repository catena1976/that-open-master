import React, { useState, useRef } from "react";
import { IProject, Project, ProjectStatus, UserRole } from "../classes/Project";
import { updateDocument } from "../firebase/index";
import { AlertModal } from "./AlertModal";

interface Props {
  project: Project;
  onClose: () => void; // Callback function to close the modal
  onProjectUpdate: (updatedProject: Project) => void; // Callback function to handle project update
}

export function EditProjectDetailsModal(props: Props) {
  const { project, onClose, onProjectUpdate } = props;

  // State to store the selected values
  const [selectedName, setSelectedName] = useState(project.name);
  const [selectedDescription, setSelectedDescription] = useState(project.description);
  const [selectedStatus, setSelectedStatus] = useState(project.status);
  const [selectedUserRole, setSelectedUserRole] = useState(project.userRole);
  const [selectedFinishDate, setSelectedFinishDate] = useState<Date | null>(
    project.finishDate ? new Date(project.finishDate) : null
  );
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const handleClose = () => {
    formRef.current?.reset();
    onClose();
  };

  // Function to handle form submission
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset alert message before validation
    setAlertMessage(null);

    // Get form data and finish date
    const editProjectForm = formRef.current;
    if (!editProjectForm) return;

    const editFormData = new FormData(editProjectForm);
    let finishDateString = editFormData.get("finishDate") as string;
    let finishDate = new Date(finishDateString);

    // Check if finish date is valid
    if (isNaN(finishDate.getTime())) {
      // If not valid, set a default date
      finishDate = new Date();
      finishDate.setDate(finishDate.getDate() + 30);
    } else {
      // If the date is in the past, throw an error
      if (finishDate.getTime() < Date.now()) {
        setAlertMessage("Finish date cannot be in the past");
        return;
      }
    }

    // Get the form data and create a new project
    const updatedProjectData: IProject = {
      id: project.id as string,
      iconColor: null, // This field is not editable
      name: editFormData.get("name") as string,
      description: editFormData.get("description") as string,
      status: editFormData.get("status") as ProjectStatus,
      userRole: editFormData.get("userRole") as UserRole,
      finishDate: finishDate,
    };

    try {
      await updateDocument<Partial<IProject>>("/projects", project.id, updatedProjectData);
      onProjectUpdate(new Project(updatedProjectData));
      formRef.current?.reset();
      handleClose();
    } catch (err) {
        console.error("Error updating project:", err);
        setAlertMessage(`Error updating project: ${err.message}`);
    }
  };

  return (
    <>
    <dialog id="edit-project-modal" open>
      <form onSubmit={onFormSubmit} ref={formRef} id="edit-project-form">
        <h2>Edit Project</h2>
        <div className="input-list">
          <div className="form-field-container">
            <label>
              <span className="material-symbols-rounded">apartment</span>Name
            </label>
            <input
              name="name"
              type="text"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
            />
            <p
              style={{
                color: "gray",
                fontSize: "var(--font-sm)",
                marginTop: 5,
                fontStyle: "italic",
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
              value={selectedDescription}
              onChange={(e) => setSelectedDescription(e.target.value)}
            />
          </div>
          <div className="form-field-container">
            <label>
              <span className="material-symbols-rounded">person</span>Role
            </label>
            <select
              name="userRole"
              value={selectedUserRole}
              onChange={(e) =>
                setSelectedUserRole(e.target.value as "architect" | "engineer" | "developer")
              }
            >
              <option value="architect">Architect</option>
              <option value="engineer">Engineer</option>
              <option value="developer">Developer</option>
            </select>
          </div>
          <div className="form-field-container">
            <label>
              <span className="material-symbols-rounded">not_listed_location</span>Status
            </label>
            <select
              name="status"
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as "pending" | "active" | "finished")
              }
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <div className="form-field-container">
            <label htmlFor="finishDate">
              <span className="material-symbols-rounded">calendar_month</span>Finish Date
            </label>
            <input
              name="finishDate"
              type="date"
              value={
                selectedFinishDate && !isNaN(selectedFinishDate.getTime())
                  ? selectedFinishDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => setSelectedFinishDate(new Date(e.target.value))}
            />
          </div>
        </div>
        <div style={{ display: "flex", margin: "10px 0px 10px auto", columnGap: 10 }}>
          <button
            type="button"
            id="cancel-edit-project-btn"
            style={{ backgroundColor: "transparent" }}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>
            Accept
          </button>
        </div>
      </form>
    </dialog>
    {alertMessage && (
    <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
    )}
    </>
  );
}