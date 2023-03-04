import User from '../models/UserModel'
import Login from '../models/LoginModel'
import buildTokens from '../ultils/buildTokens';
const handleRegister = (data:object) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(data) {    
                const user = new User(data);
                await user.save();
               
                resolve({
                    errCode: 0,
                    errMessage: 'Create a new user success',
                    user: user
                })
            }
            else {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing params'
                })
            }
        } catch (e) {
           reject(e) 
        }
    })
}
const handleLogin = (data:object) =>{
    return new Promise(async(resolve, reject) => {
        try {
            let findUser = await User.findOne(data)
            if(findUser) {
                let {accessToken, refreshToken} = await buildTokens.handleBuildTokens(
                    {...data, isAdmin: findUser.isAdmin,userID:findUser._id})
                let userID = findUser._id
                
                let findLogin = await Login.findOne({userID});
                console.log('check findLogin', findLogin)
                if(findLogin) {
                    let deleteLogin = await Login.deleteOne({userID})
                   
                }
                    const login = new Login({userID,accessToken,refreshToken})
                   
                    await login.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Login sucess',
                        tokens: {accessToken: accessToken, refreshToken: refreshToken},
                        user: findUser
                    })
            }
            else {
                resolve({
                    errCode: -2,
                    errMessage: 'User not found'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
const handleUpdateUser = (accessToken:string, data:object) => {
    return new Promise(async(resolve, reject) => {
        try {
            let findAccessToken = await Login.findOne({accessToken:accessToken})
            if(findAccessToken) {
                let updateUSer = await User.updateOne({_id:findAccessToken.userID},data)
                
                resolve({
                    errCode: 0,
                    errMessage: 'Update Success'
                })
            }
            else {
                resolve({
                    errCode: -2,
                    errMessage: 'Something went wrong, please Login again'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
export default {handleRegister,handleLogin,handleUpdateUser}