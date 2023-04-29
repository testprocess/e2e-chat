
import { v4 as uuidv4 } from 'uuid';
import { groupModel } from '../models/group.model.js';


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

        res.status(200).json({ status:1 })
    },

    delete: async function  (req, res) {
        const groupUUID = req.body.uuid
        const groupOwner = req.auth.userid

        await groupModel.delete({
            groupOwner: groupOwner,
            groupUUID: groupUUID
        })

        res.status(200).json({ status:1 })
    },
}

export { groupController }