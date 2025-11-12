import {type Request, type Response, Router} from "express";
import { getDb } from "./mongo";
import { ObjectId } from "mongodb";
import {LD} from "./types";
import {extraerDisco, validarDisco} from "./util";

const router = Router();

const coleccion = () => getDb().collection<LD>(`${process.env.coleccion}`);

router.get("/", async (req, res) => {
    try {
        res.send("¡Bienvenido a la API de gestión discos!");
    } catch (err) {
        res.status(404).json(err);
    }
});

router.get("/ALL", async (req, res) => {
    try {
        const discos:LD[] = (await coleccion().find().toArray());
        res.json(discos);
    } catch (err) {
        res.status(404).json(err);
    }
});

router.get('/Id/:id', async (req: Request, res: Response) =>
{
    const {id} = req.params; // No se puede usar parseInt directamente en ID porque es de tipo string
    const numeroId: number = Number(id);
    if (isNaN(numeroId)) {
        return res.status(400).json({error: "ID inválido"});
    }
    const discoObtenido: LD | null = await  coleccion().findOne({"_id": req.body});
    if(!discoObtenido)
    {
        res.status(404);
    }
    res.json(discoObtenido);
});

router.post('/Id',async (req: Request, res: Response) => {
    try {
        const error = validarDisco(req.body);
        if (error) {
            return res.status(400).json({error});
        }
        const nuevoDisco: LD = extraerDisco(req.body);
        // MONGODOMONGO discos.push(nuevoDisco);
        // coleccion().insertOne(nuevoDisco);
        const id_disco_insertado =(await coleccion().insertOne(nuevoDisco)).insertedId;
        res.status(201).json(nuevoDisco);
    } catch (err: any) {
        res.status(500).json({error: err.message});
    }
});

router.delete('/Id/:id', async(req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const numeroId = Number(id);
        if (isNaN(numeroId)) {
            return res.status(400).json({error: "ID inválido"});
        }

        // if (!MONGODOMONGO discos.some((d) => d.id === numeroId)) {
        //     return res.status(404).json({error: "No existe un disco con ese ID"});
        // }

        if(!await coleccion().findOne({"_id": new ObjectId(id)}))
        {
            return res.status(404).json({error: "No existe un disco con ese ID"});
        }

        await coleccion().deleteOne({"_id": new ObjectId(id)});
        //

       // MONGODOMONGO discos = discos.filter((d) => d.id !== numeroId);
       //
        res.json({message: "Disco eliminado correctamente"});
    } catch (err: any) {
        // err500: ?
        res.status(500).json({error: "Error all llevar a cabo la eliminación", detail: err.message});
    }
});

export default router;
