import { MySQLConnect, AppDataSource } from '../databases/db.js'
import { Group } from "../databases/entity/Group.js";


const groupModel = {
    create: async function ({ groupName, groupDescription, groupOwner, groupUUID, createdAt }) {
        try {
            const groupValues = new Group()
            groupValues.groupName = groupName
            groupValues.groupDescription = groupDescription
            groupValues.groupOwner = groupOwner
            groupValues.groupUUID = groupUUID
            groupValues.createdAt = createdAt

            const groupRepository = AppDataSource.getRepository(Group);
            await groupRepository.save(groupValues)
            return { status: 1 }
    
        } catch (err) {
            console.log(err)
            return { status: 0 }
        }
    },
}

export { groupModel }