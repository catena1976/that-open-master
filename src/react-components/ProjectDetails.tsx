import React, { useState } from "react";
import { ThreeViewer } from "./ThreeViewer";
import { Project } from "../classes/Project";
import { ToDos } from './ToDos';

interface Props {
    project: Project,
    handleOnEditProjectClick: () => void,
}

export function ProjectDetails(props: Props) {

    const { project, handleOnEditProjectClick } = props;

    return (
            <div className="main-page-content">
                <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
                    {/* Project information card */}
                    <div className="dashboard-card" style={{ padding: "30px 0" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "0px 30px",
                                justifyContent: "space-between",
                                marginBottom: 30,
                            }}
                        >
                            {/* Placeholder for project icon or initials */}
                            <p
                                style={{
                                    backgroundColor: "#ca8134",
                                    aspectRatio: 1,
                                    borderRadius: 100,
                                    padding: 12,
                                    fontSize: 20,
                                }}
                            >
                                HC
                            </p>
                            {/* Button to open the edit modal */}
                            <button
                                onClick={handleOnEditProjectClick}
                                id="edit-project-btn"
                                className="btn-secondary"
                            >
                                <p style={{ width: "100%" }}>Edit</p>
                            </button>
                        </div>
                        <div style={{ padding: "0 30px" }}>
                            <div>
                                {/* Project name */}
                                <h5 data-project-info="cardName">{project.name}</h5>
                                {/* Project description */}
                                <p data-project-info="cardDescription">{project.description}</p>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    columnGap: 30,
                                    justifyContent: "space-between",
                                    padding: "30px 0px",
                                }}
                            >
                                {/* Project status */}
                                <div>
                                    <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>Status</p>
                                    <p data-project-info="status">{project.status}</p>
                                </div>
                                {/* Project cost */}
                                <div>
                                    <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>Cost</p>
                                    <p data-project-info="cost">${project.cost}</p>
                                </div>
                                {/* User's role in the project */}
                                <div>
                                    <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>Role</p>
                                    <p data-project-info="userRole">{project.userRole}</p>
                                </div>
                                {/* Project finish date */}
                                <div>
                                    <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>Finish Date</p>
                                    <p data-project-info="finishDate">{project.finishDate.toDateString()}</p>
                                </div>
                            </div>
                            {/* Project progress bar */}
                            <div
                                style={{
                                    backgroundColor: "#404040",
                                    borderRadius: 9999,
                                    overflow: "auto",
                                }}
                            >
                                <div
                                    data-project-info="progress"
                                    style={{
                                        width: `${project.progress * 100}%`,
                                        backgroundColor: "green",
                                        textAlign: "center",
                                        padding: "4px 0",
                                    }}
                                >
                                    {/* Display progress percentage */}
                                    {(project.progress || 0) * 100}%
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* To-Do list section */}
                    <ToDos project={project} />
                </div>
                {/* Component to display 3D content */}
                <ThreeViewer />
            </div>
    )
}