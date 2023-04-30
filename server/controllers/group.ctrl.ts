
import { v4 as uuidv4 } from 'uuid';
import { groupModel, groupUserModel } from '../models/group.model.js';


const groupController = {
    create: async function  (req, res) {
        
        const groupName = req.body.name
        const groupDescription = req.body.description
        const groupOwner = req.auth.userid
        const groupUUID = uuidv4()
        const createdAt = Date.now()


        await groupModel.create({
            groupName: groupName,
            groupDescription: groupDescription,
            groupOwner: groupOwner,
            groupUUID: groupUUID,
            createdAt: createdAt
        })

        await groupUserModel.join({
            groupUUID: groupUUID,
            userId: groupOwner,
            joinAt: createdAt
        })

        res.status(200).json({ status:1 })
    },

    delete: async function  (req, res) {
        const groupUUID = req.params.uuid
        const groupOwner = req.auth.userid

        await groupModel.delete({
            groupOwner: groupOwner,
            groupUUID: groupUUID
        })

        res.status(200).json({ status:1 })
    },

    read: async function  (req, res) {
        const getGroups = await groupModel.read()

        res.status(200).json({ status:1, groups: getGroups.result })
    },

    join: async function  (req, res) {
        const groupUUID = req.params.uuid
        const userId = req.auth.userid
        const joinAt = Date.now()

        await groupUserModel.join({
            groupUUID: groupUUID,
            userId: userId,
            joinAt: joinAt
        })


        res.status(200).json({ status:1 })
    },
}

export { groupController }