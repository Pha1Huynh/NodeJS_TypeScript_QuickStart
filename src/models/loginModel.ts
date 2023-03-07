import mongoose, { Document, Schema } from 'mongoose';

export interface ILogin extends Document {
    userID?: string;
    accessToken?: string;
    refreshToken?: string;
}

const LoginSchema: Schema = new Schema(
    {
        userID: { type: Schema.Types.ObjectId },
        accessToken: { type: String },
        refreshToken: { type: String },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model<ILogin>('Login', LoginSchema);
