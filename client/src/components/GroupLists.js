import React, { useEffect, useState } from "react";


function GroupLists() {
    
    const [groups, setGroups] = useState([])

    useEffect(() => {
        patchGroup()
    }, [])

    const patchGroup = async () => {
        const lists = await getGroups()
        const mapLists = lists.map((group) => {
            Object.assign(group, {key: group.groupUUID})
            return group;
        })
        setGroups(mapLists)
    }

    const getGroups = async () => {
        let token = Cookies.get("user")
        let response = await fetch("/api/group", {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-access-token": token
            }
        });

        let data = await response.json();

        return data.groups
    }

    return (
        <div>
            <b class="input-text">Group List</b>
            {groups.map((group) => (<b>{group.groupName}</b>))}
        </div>
    );
  }
  
  export default GroupLists;