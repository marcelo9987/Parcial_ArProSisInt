import express, {type NextFunction, type Request, type Response,} from "express";

import axios from "axios"

import cors from "cors";

type LD = {
    id: number,

    filmName: string,

    rotationType: "CAV" | "CLV",

    region: string,

    lengthMinutes: number,

    videoFormat: "NTSC" | "PAL"
}

let discos: LD[] = [
    {id: 1, filmName: "Shrek", rotationType: "CAV", region: "EUR", lengthMinutes: 90, videoFormat: "NTSC"},
    {id: 2, filmName: "Prueba2", rotationType: "CLV", region: "NAM", lengthMinutes: 201, videoFormat: "PAL"}
];

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Valida los datos de un disco
 * @param datos - Datos del disco a validar
 * @returns Mensaje de error si hay campos faltantes, o null si todo está bien
 */
const validarDisco = (datos: any): string | null =>
{
    if (!datos)
    {
        return "Se esperan parámetros de entrada";
    }

    const {filmName, rotationType, region, lengthMinutes, videoFormat} = datos;
    if (!filmName || !rotationType || !region || !lengthMinutes || !videoFormat)
    {
        return "Faltan campos obligatorios";
    }

    if (typeof filmName !== "string" ||
        typeof rotationType !== "string" ||
        typeof region !== "string" ||
        typeof lengthMinutes !== "number" ||
        typeof videoFormat !== "string"
    )
    {
        return "ERROR!: Formato esperado: {filmName: string, rotationType: string(CAV o CLV), region: string, lenghtMinutes:number, videoFormat: string (NTSC o PAL)}";
    }

    if(!(rotationType==="CAV" || rotationType  === "CLV"))
    {
        return "ERROR!: Rotation type sólo puede ser CAV o CLV, comprueba que esté bien escrito";
    }

    if(!(videoFormat==="NTSC" || videoFormat  === "PAL"))
    {
        return "ERROR!: Video format type sólo puede ser NTSC o PAL, comprueba que esté bien escrito";
    }

    return null;
};

const extraerDisco = (datos: any): LD =>
{
    const tamanhoBaseDeDatos = discos.length;

    const ultimoId = discos[tamanhoBaseDeDatos - 1]?.id ?? 0;
    const nuevoId: number = ultimoId === 0 ? ultimoId : ultimoId + 1;

    const nombre: string = datos.filmName;

    const tipoDeRotacion: "CAV" | "CLV" = datos.rotationType;

    const region: string = datos.region;

    const minutos: number = datos.lengthMinutes;
    const formato: "NTSC" | "PAL" = datos.videoFormat;

    return {
        id: nuevoId,
        filmName: nombre,
        rotationType: tipoDeRotacion,
        region: region,
        lengthMinutes: minutos,
        videoFormat: formato
    };
};

const gestorDeErrores = (err: any, req: Request, res: Response, next: NextFunction) =>
{
    console.error("¡Detectado un error en la aplicación!:", err.message);
    res.status(500).json({error: "Error interno del servidor", detail: err.message});
};

const testApi = (async () =>
{
    await new Promise(resolve => setTimeout(resolve, 2000)); // damos 2 segundos de margen para que el servidor inicie
    console.log("Han pasado 2 segundos desde que el servidor se inició");


        // 1-2. Obtener la lista de discos (debería devolver los dos discos iniciales)

        console.log("\n 1-2. Discos en memoria:");
        const discos_paso1 = (await axios.get("http://localhost:3000/Id"));
        console.log(discos_paso1.data, "\n");


    // 3-4. Crear un nuevo disco
        console.log(" 3. Creación de un nuevo disco");
        try
        {
            const discos_paso3 = await axios.post("http://localhost:3000/Id/", {
                "filmName": "prueba3", "rotationType": "CLV", "region": "Asia",lengthMinutes:60,videoFormat:"NTSC"
            });

            console.log(" Respuesta de la inserción:", discos_paso3.data, "\n");
        }
        catch (error: any)
        {
            console.log(" Error en la inserción:", error.response.data);
        }

        console.log(" 4-5. Discos en memoria tras la inserción:");
        const discos_postInsert = (await axios.get("http://localhost:3000/Id")).data;
        console.log(discos_postInsert, "\n");



        console.log(" 6. Eliminación del disco con ID 3");
        try
        {
            const respuesta = await axios.delete("http://localhost:3000/Id/3");
            console.log(" Respuesta de la eliminación:", respuesta.data, "\n");
        }
        catch (error: any)
        {
            console.log(" Error en la eliminación:", error.response.data);
        }

        console.log(" 7. Discos en memoria tras la eliminación:");
        const discos_postDelete = (await axios.get("http://localhost:3000/Id")).data;
        console.log(discos_postDelete, "\n");


    console.log("Tests de la API finalizados.");

});

/// -**-**- RUTAS -**-**-

app.get("/", (req: Request, res: Response) =>
{
    res.send("¡Bienvenido a la API de gestión discos!");
});


app.get('/Id', (req: Request, res: Response) =>
{
    res.json(discos); //devuelve la lista de discos en formato JSON de la «base de datos» (que es un array en memoria en este caso)
});


app.get('/Id/:id', (req: Request, res: Response) =>
{
    const {id} = req.params; // No se puede usar parseInt directamente en ID porque es de tipo string
    const numeroId = Number(id);
    if (isNaN(numeroId))
    {
        return res.status(400).json({error: "ID inválido"});
    }

    const disco = discos.find((d) => d.id === numeroId);
    return disco ? res.json(disco) : res.status(404).json({message: "Disco no encontrado"});
});

app.post('/Id', (req: Request, res: Response) =>
{
    try
    {
        const error = validarDisco(req.body);
        if (error)
        {
            return res.status(400).json({error});
        }
        const nuevoDisco = extraerDisco(req.body);
        discos.push(nuevoDisco);
        res.status(201).json(nuevoDisco);
    }
    catch (err: any)
    {
        res.status(500).json({error: err.message});
    }
});

app.delete('/Id/:id', (req: Request, res: Response) =>
{
    try
    {
        const {id} = req.params;
        const numeroId = Number(id);
        if (isNaN(numeroId))
        {
            return res.status(400).json({error: "ID inválido"});
        }

        if (!discos.some((d) => d.id === numeroId))
        {
            return res.status(404).json({error: "No existe un disco con ese ID"});
        }

        discos = discos.filter((d) => d.id !== numeroId);

        res.json({message: "Disco eliminado correctamente"});
    }
    catch (err: any)
    {
        res.status(500).json({error: "Error all llevar a cabo la eliminación", detail: err.message});
    }
});

app.use((req: Request, res: Response) =>
{
    res.status(404).json({error: "Ruta no encontrada"});
});

app.use(gestorDeErrores);


app.listen(3000, () => console.log("Servidor en http://localhost:3000"));

await testApi();
