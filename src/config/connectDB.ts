import mongoose from 'mongoose';
export async function connectDb() {
    try {
        await mongoose.connect(process.env.CONNECT_STRING);

        console.log('Connect DB successfullsy');
    } catch (e) {
        console.log('Connect DB failure');
    }
}
