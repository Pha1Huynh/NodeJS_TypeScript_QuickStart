import User from '../models/userModel';
import Login from '../models/loginModel';
import { handleBuildTokens } from '../utils/buildTokens';

interface IUserInfo {
    name: string;
    password: string;
}
export interface IdataUserFromMiddleware extends IUserInfo {
    isAdmin: boolean;
    userID: string;
    iat: number;
    exp: number;
}

export interface IDataUpdate {
    name?: string;
    password?: string;
}

export const handleRegister = async (dataRegister: IUserInfo) => {
    if (dataRegister) {
        const user = new User(dataRegister);
        await user.save();
        return { data: user, errMessage: 'Created success' };
    }
};
export const handleLogin = async (loginInfo: IUserInfo) => {
    const findUser = await User.findOne(loginInfo);

    if (findUser) {
        const { accessToken, refreshToken } = await handleBuildTokens({
            name: loginInfo.name,
            password: loginInfo.password,
            isAdmin: findUser.isAdmin,
            userID: findUser._id,
        });
        const userID = findUser._id;

        const findLogin = await Login.findOne({ userID });

        if (findLogin) {
            await Login.deleteOne({ userID });
        }
        const login = new Login({ userID, accessToken, refreshToken });

        await login.save();
        return {
            errMessage: 'Login sucess',
            data: {
                tokens: { accessToken: accessToken, refreshToken: refreshToken },
            },
        };
    } else {
        return {
            errMessage: 'User not found',
        };
    }
};
export const handleUpdateUser = async (dataFromMiddleware: IdataUserFromMiddleware, data: IDataUpdate) => {
    const userUpdate = await User.updateOne({ _id: dataFromMiddleware.userID }, data);
    if (userUpdate) {
        const getUserUpdate = await User.findOne({ _id: dataFromMiddleware.userID });
        const { accessToken, refreshToken } = await handleBuildTokens({
            name: getUserUpdate.name,
            password: getUserUpdate.password,
            isAdmin: getUserUpdate.isAdmin,
            userID: getUserUpdate._id,
        });
        await Login.updateOne({ userID: getUserUpdate._id }, { accessToken: accessToken, refreshToken: refreshToken });
        return {
            errMessage: 'Update Success',
            data: {
                user: getUserUpdate,
                tokens: { accessToken: accessToken, refreshToken: refreshToken },
            },
        };
    } else {
        return {
            errMessage: 'User not found',
        };
    }
};
