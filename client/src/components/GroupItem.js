import React from "react";
import { default as axios } from 'axios';


function GroupItem({ groupName, groupDescription, groupUUID }) {

    const handleClick = () => {
        joinGroup()
    }

    const joinGroup = () => {
        let token = Cookies.get("user")

        axios({
            method: 'post',
            url: `/api/group/join/${groupUUID}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              "x-access-token": token
            }
        }).then(async (response) => {
            if (response.data.status != 1) {
                dds.toast({
                    content: '그룹에 가입할 수 없어요'
                })
                return 0
            }

            location.href = `/chat/${groupUUID}`
        });
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