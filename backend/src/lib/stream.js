import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET


if(!apiKey || !apiSecret){
    console.log("Stream API Key and Secret are required")

}

const streamClient = StreamChat.getInstance(apiKey,apiSecret)

export const upsertStreamUser = async(userData)=>{
    try{
        await streamClient.upsertUsers([userData])
        return userData
    }catch(error){
        console.error("Error upserting Stream user:",error)
    }
};

export const generateStreamToken = (userId)=>{
    try{
        const userStr = userId.toString()
        return streamClient.createToken(userStr)
    }catch(error){
        console.error("Error generating Stream token:",error)
    }
}