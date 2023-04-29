import React from "react";
import Main from "../components/Main.js"
import CreateGroup from "../components/CreateGroup.js"
import GroupLists from "../components/GroupLists.js"


function RootPage() {

    return (
        <div>
            <Main></Main>
            <CreateGroup></CreateGroup>
            <GroupLists></GroupLists>
        </div>
    );
  }
  
  export default RootPage;