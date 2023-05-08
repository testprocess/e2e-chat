import React, { useEffect, useState } from "react";
import GroupItem from "./GroupItem.js"
import { default as axios } from 'axios';

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

        const getPromise = new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: '/api/group',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', 
                    "x-access-token": token
                }
            })
            .then(async (response) => {
                let data = response.data
                resolve(data.groups)
            });
        })


        return getPromise        
    }

    return (
        <div className="mt-4">
            <b className="input-text">Group List</b>
            {groups.map((group) => (<GroupItem groupName={group.groupName} groupDescription={group.groupDescription} groupUUID={group.groupUUID}></GroupItem>))}
        </div>
    );
  }
  
  export default GroupLists;