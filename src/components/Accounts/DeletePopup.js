import React from "react";

function DeletePopup(props) {
    return (props.trigger) ? (
        <div className="delete-popup">
            <div className="delete-popup-inner">
                <button className="delete-popup-button" onClick={() => props.setTrigger(false)}> Close</button>
                <br/>
                {props.children}
            </div>

        </div>
    ) : "";
}

export default DeletePopup;
