import React from "react";


interface Props {

    message: string;
  
    onClose: () => void;
  
  }

// Function to toggle alert-modal visibility
const toggleAlertModal = (show: boolean ) => {
    const alertModal = document.getElementById("alert-modal") as HTMLDialogElement;
    show? alertModal.showModal() : alertModal.close()
}

export function AlertModal ( props: Props) {

React.useEffect(() => {

    toggleAlertModal(true)
    
    }, [])

    return(
        <dialog id="alert-modal" >
            <div id="alert-dialogue" className="alert">
                <p id="alert-message">{props.message}</p>
                <button onClick={(e) => toggleAlertModal(false)} id="alert-modal-btn">Accept</button>
            </div>
        </dialog>
    )
}