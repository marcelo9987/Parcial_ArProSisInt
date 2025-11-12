/**
 * TODO: Tipar entrada y salida de axios
 */

import express, {type NextFunction, type Request, type Response,} from "express";

import axios from "axios";

import cors from "cors";

import {LD} from "./types"

import {connectMongoDB} from "./mongo";

import enrutadorPersonas from "./routes"

import dotenv from "dotenv";
/*
*  [{id: 1, filmName: "Shrek", rotationType: "CAV", region: "EUR", lengthMinutes: 90, videoFormat: "NTSC"}
*  {id: 2, filmName: "Prueba2", rotationType: "CLV", region: "NAM", lengthMinutes: 201, videoFormat: "PAL"}];
*/



const gestorDeErrores = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("¡Detectado un error en la aplicación!:", err.message);
    res.status(500).json({error: "Error interno del servidor", detail: err.message});
};

const testApi = (async () => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // damos 1 segundo1 de margen para que el servidor inicie
    console.log("Ha pasado 1 segundo desde que el servidor se inició");


    // 1-2. Obtener la lista de discos (debería devolver los dos discos iniciales)

    console.log("\n 1-2. Discos en memoria:");
    const discos_paso1 = (await axios.get("http://localhost:3000/Id"));
    console.log(discos_paso1.data, "\n");


    // 3-4. Crear un nuevo disco
    console.log(" 3. Creación de un nuevo disco");
    try {
        const discos_paso3 = await axios.post("http://localhost:3000/Id/", {
            "filmName": "prueba3", "rotationType": "CLV", "region": "Asia", "lengthMinutes": 60, "videoFormat": "NTSC"
        });

        console.log(" Respuesta de la inserción:", discos_paso3.data, "\n");
    } catch (error: any) {
        console.log(" Error en la inserción:", error.response.data);
    }

    console.log(" 4-5. Discos en memoria tras la inserción:");
    const discos_postInsert: LD[] = (await axios.get("http://localhost:3000/Id")).data;
    console.log(discos_postInsert, "\n");


    console.log(" 6. Eliminación del disco con ID 3");
    try {
        const respuesta = await axios.delete("http://localhost:3000/Id/3");
        console.log(" Respuesta de la eliminación:", respuesta.data, "\n");
    } catch (error: any) {
        console.log(" Error en la eliminación:", error.response.data);
    }

    console.log(" 7. Discos en memoria tras la eliminación:");
    const discos_postDelete = (await axios.get("http://localhost:3000/Id")).data;
    console.log(discos_postDelete, "\n");


    console.log("Tests de la API finalizados.");

});

dotenv.config();

connectMongoDB();

const app = express();
app.use(express.json());
app.use(cors)
app.use("/api/personas",enrutadorPersonas)


app.listen(3000,()=>"API iniciada");

/// -**-**- RUTAS -**-**-

app.use((req: Request, res: Response) => {
    res.status(404).json({error: "Ruta no encontrada"});
});

app.use(gestorDeErrores);


app.listen(3000, () => console.log("Servidor en http://localhost:3000"));

testApi().then();
