import * as React from "react"
import * as Router from "react-router-dom"

export function Sidebar() {
    return(
        <aside id="sidebar">
            <img id="company-logo" src="./assets/company-logo.svg" alt="Construction Company" />
            <ul id="nav-buttons">
                <Router.Link to="/">
                    <li id="projects-btn"><span className="material-symbols-rounded">apartment</span>Projects</li> 
                </Router.Link>
                <Router.Link to="/project">
                    <li><span className="material-symbols-rounded">account_circle</span>Users</li>
                </Router.Link>

            </ul>
        </aside>
    )
}
