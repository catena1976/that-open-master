import * as React from 'react'
import { Project } from '../classes/Project'

interface Props {
    project: Project
}

export function ProjectCard(props: Props) {
    return(
        <div className='project-card'>
            <div className="card-header">
                <p
                style={{
                    backgroundColor: "${color}",
                    padding: 10,
                    borderRadius: 8,
                    aspectRatio: 1,
                    textTransform: "uppercase"
                }}
                >
                HC
                </p>
                <div>
                <h5>
                    {props.project.name}
                </h5>
                <p>
                    {props.project.description}
                </p>
                </div>
            </div>
            <div className="card-content">
                <div className="card-property">
                <p style={{ color: "#969696" }}>Status</p>
                <p>
                    {props.project.status}
                </p>
                </div>
                <div className="card-property">
                <p style={{ color: "#969696" }}>Role</p>
                <p>
                    {props.project.userRole}
                </p>
                </div>
                <div className="card-property">
                <p style={{ color: "#969696" }}>Cost</p>
                <p>
                    ${props.project.cost}
                </p>
                </div>
                <div className="card-property">
                <p style={{ color: "#969696" }}>Estimated Progress</p>
                <p>
                    {props.project.progress * 100}%
                </p>
                </div>
            </div>
            </div>

    )
}