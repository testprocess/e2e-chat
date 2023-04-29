import React from "react";


function GroupItem({ groupName, groupDescription, groupUUID }) {

    const handleClick = () => {
        location.href = `/chat/${groupUUID}`
    }

    return (
        <div className="card" onClick={handleClick}>
            <div className="card-body">
                <h5 className="card-title">{groupName}</h5>
                <p className="card-text text-muted">{groupDescription}</p>
            </div>
        </div>
    );
}
  
export default GroupItem;