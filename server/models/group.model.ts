import { MySQLConnect, AppDataSource } from '../databases/db.js'
import { Group } from "../databases/entity/Group.js";
import { GroupUsers } from "../databases/entity/GroupUsers.js";


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

    delete: async function ({ groupUUID, groupOwner }) {
        try {
            const groupRepository = AppDataSource.getRepository(Group);
            const deleteGroup = await groupRepository.createQueryBuilder('group')
            .delete()
            .from(Group)
            .where("groupUUID = :uuid AND groupOwner = :owner", { idx: groupUUID, owner: groupOwner })
            .execute()

            return { status: 1 }
    
        } catch (err) {
            console.log(err)
            return { status: 0 }
        }
    },

    read: async function () {
        try {
            const groupRepository = AppDataSource.getRepository(Group);
            const getGroups = await groupRepository.find()
    
            return { status: 1, result: getGroups }
    
        } catch (err) {
            console.log(err)
            return { status: 0 }
        }
    },
}

const groupUserModel = {
    join: async function ({ groupUUID, userId, joinAt }) {
        try {
            const groupValues = new GroupUsers()
            groupValues.groupUUID = groupUUID
            groupValues.userId = userId
            groupValues.joinAt = joinAt

            const groupUserRepository = AppDataSource.getRepository(GroupUsers);
            await groupUserRepository.save(groupValues)
            return { status: 1 }
    
        } catch (err) {
            console.log(err)
            return { status: 0 }
        }
    },
}

export { groupModel, groupUserModel }