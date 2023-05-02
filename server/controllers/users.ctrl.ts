
import { userService } from '../services/users.serv.js';
import { rsaService } from '../services/rsa.serv.js';

import { userModel } from '../models/users.model.js';

const userController = {
    create: async function  (req, res) {
        const userId = Buffer.from(req.body.user_id, "base64").toString('utf8');
        const userPassword = Buffer.from(req.body.user_pw, "base64").toString('utf8');
        const userEmail = Buffer.from(req.body.user_email, "base64").toString('utf8');
        const createdAt = Date.now()

        const isAvailable = await userService.checkAvailableUser({ userId: userId, userEmail: userEmail })
        const getUser = await userModel.read({ userId, userEmail })
        const isDuplicate = getUser.status
    
        if (String(userPassword).length <= 7) {
            return res.status(200).json({status: 2})
        }
        if (isAvailable == 0 || isDuplicate != 0) {
            return res.status(200).json({status:0})
        }
    
        const getUserPasswordHash = await userService.encryptPassword({ userPassword: userPassword })
        const userPasswordHash = getUserPasswordHash.userPasswordHash
        const key = await rsaService.generateKey()
    
        await userModel.create({ 
            userId: userId, 
            userPasswordHash: userPasswordHash, 
            userEmail: userEmail,
            userPublicKey: key.publicKey,
            createdAt: createdAt
        })
    
        const isGrantAuthorization: any = await userModel.update({ userId: userId, userAuthLevel: 1 });
        const getJwtToken = await userService.grantToken({ userId: userId });
        const createdToken = getJwtToken.userJwtToken

        if (isGrantAuthorization.status == 0) {
            return res.status(401).json({status:0})
        }

        res.status(200).json({ status:1, token: createdToken, privateKey: key.privateKey })
    },
    
    
    delete: async function (req, res) {
        // NOTE: 로그인 된 유저 체크 안함
        let userId = req.params.user_id;
        let isRevoke: any = await userModel.update({ userId: userId, userAuthLevel: 0 });

        if (isRevoke.status == 0) {
            return res.status(200).json({status:0})
        }
    
        res.clearCookie('user')
        res.status(200).json({status:1})
    },
    
    
    get: async function (req, res) {
        try {
            let userId = req.params.user_id;
            let userInfo = await userModel.read({ userId: userId });
    
            let result = {
                idx: userInfo.user.idx, 
                user_auth: userInfo.user.userAuthLevel, 
                //user_email: userInfo.user.userEmail, 
                user_id: userInfo.user.userId,
                publicKey: userInfo.user.userPublicKey

            }

            if (userInfo.user.userAuthLevel <= 0) {
                return res.status(200).json({ status: 0 })
            }
        
            res.status(200).json({ status: 1, data: result })
        } catch (error) {
            res.status(500).json({ status: 0 })
        }
    }
}


export { userController }