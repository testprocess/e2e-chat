import { MySQLConnect, AppDataSource } from '../databases/db.js'

import { User } from "../databases/entity/User.js";

type UserUpdateTypes = {
    userId: string
    userPasswordHash?: string
    userEmail?: string
    userPublicKey?: string
    userAuthLevel?: number
}


const userModel = {
    create: async function ({ userId, userPasswordHash, userEmail, userPublicKey, createdAt }) {
        try {
            const userValues = new User()
            userValues.userId = userId
            userValues.userPassword = userPasswordHash
            userValues.userEmail = userEmail
            userValues.userAuthLevel = 1
            userValues.userPublicKey = userPublicKey
            userValues.createdAt = createdAt
    
            const userRepository = AppDataSource.getRepository(User);
            await userRepository.save(userValues)
            return { status: 1 }
    
        } catch (err) {
            console.log(err)
            return { status: 0 }
        }
    },
    
    read: async function ({ userId, userEmail }: any) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const getUser = await userRepository
                .createQueryBuilder("user")
                .where("user.userId = :id OR user.userEmail = :email", { id: userId, email: userEmail })
                .getOne()
    
            const status = getUser == null ? 0 : 1
            return { status: status, user: getUser }
        } catch (err) {
            console.log(err)
            throw Error(err)
        }
    },


    update: async function ({ userId, userPasswordHash, userEmail, userPublicKey, userAuthLevel }: UserUpdateTypes) {
        try {
            const paramsIndex = ["userId", "userPasswordHash", "userEmail", "userPublicKey", "userAuthLevel"]
            const paramsData = [userId, userPasswordHash, userEmail, userPublicKey, userAuthLevel]
            let setData = {}

            for (let index = 0; index < paramsIndex.length; index++) {
                if (paramsData[index] != undefined) {
                    setData[paramsIndex[index]] = paramsData[index]
                }
            }

            console.log(setData)

            const userRepository = AppDataSource.getRepository(User);
            const updateUser = await userRepository
                .createQueryBuilder()
                .update(User)
                .set(setData)
                .where("userId = :userId", { userId: userId })
                .execute()

            // let updateUser = "UPDATE users SET userAuthLevel = ? WHERE userId = ?";
            // const data = await new Promise((resolve, reject) => {
            //     MySQLConnect.query(updateUser, [auth, userId], function(err, result) {
            //         if (err) {
            //             resolve({status:0})
            //         } else {
            //             resolve({status:1})
            //         }
            //     });
            // })
    
            return { status: 1 }
        } catch (err) {
            console.log(err)
            throw Error(err)
        }
    }
    

}

export { userModel }