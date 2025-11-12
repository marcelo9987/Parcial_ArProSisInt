import { Db, MongoClient } from "mongodb";

let client : MongoClient;
let dB: Db;
const db_nombre = "SistemasEnInternet";

export const connectMongoDB = async (): Promise<void> =>
{
    // const mongoUrl = `mongodb+srv://${process.env.USER_MONGO}:${process.env.USER_PASSWORD}@cluster0.cluster0.irzyluw.mongodb.net/?appName=${process.env.MONGO_APP_NAME}`;
    const mongoUrl = `mongodb+srv://${process.env.USER_MONGO}:${process.env.USER_PASSWORD}@${process.env.MONGO_CLUSTER}.irzyluw.mongodb.net/?appName=${process.env.MONGO_APP_NAME}`;
    try
    {
        // client = new MongoClient("mongodb+srv://marcelo:contraseña@cluster0.irzyluw.mongodb.net/?appName=Cluster0");
        client = new MongoClient(mongoUrl);
        await client.connect();
        dB = client.db(db_nombre);
        console.log("Conectado a MongoDB, BBDD: " + db_nombre);
    }
    catch (error)
    {
        console.log("Error en mongo: ",error);
    }
};

export const getDb = ():Db => dB;