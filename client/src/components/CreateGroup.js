import React, { useState } from "react";
import { default as axios } from 'axios';


function CreateGroup() {
    const [inputs, setInputs] = useState({
        groupName: '',
        groupDescription: ''
    })
    const { groupName, groupDescription } = inputs


    const onChange = (e) => {
        const { value, name } = e.target
        setInputs({
          ...inputs,
          [name]: value
        });
    };
  
    const onReset = () => {
        setInputs({
            groupName: '',
            groupDescription: '',
        })
    };

    const handleClick = () => {

        send()
    }

    const send = async () => {
        let token = Cookies.get("user")
        axios({
            method: 'post',
            url: '/api/group',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              "x-access-token": token
            },
            data: {
                name: groupName,
                description: groupDescription
            }
        }).then(async (response) => {
            console.log(response)
        });

    }

    return (
        <div>
            <b class="input-text">Group Name</b>
            <div class="input-group mt-1 mb-3">
                <input type="text" class="form-control" aria-label="Group Name" name="groupName" onChange={onChange} value={groupName} />
            </div>

            <b class="input-text">Group Description</b>
            <div class="input-group mt-1 mb-3">
                <textarea class="form-control" aria-label="Group Description" name="groupDescription" onChange={onChange} value={groupDescription}></textarea>
            </div>

            <button className="btn btn-primary" onClick={handleClick}>Create</button>
        </div>
    );
  }
  
  export default CreateGroup;