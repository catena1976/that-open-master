import * as React from "react"

export function Sidebar() {
    return(
        <aside id="sidebar">
            <img id="company-logo" src="./assets/company-logo.svg" alt="Construction Company" />
            <ul id="nav-buttons">
                <li id="projects-btn"><span className="material-symbols-rounded">apartment</span>Projects</li>
                <li><span className="material-symbols-rounded">account_circle</span>Users</li>
            </ul>
        </aside>
    )
}
