import {LD} from "./types";

/**
 * Valida los datos de un disco
 * @param datos - Datos del disco a validar
 * @returns Mensaje de error si hay campos faltantes, o null si todo está bien
 */
export const validarDisco = (datos: any): string | null => {
    if (!datos) {
        return "Se esperan parámetros de entrada";
    }

    const {filmName, rotationType, region, lengthMinutes, videoFormat} = datos;
    if (!filmName || !rotationType || !region || !lengthMinutes || !videoFormat) {
        return "Faltan campos obligatorios";
    }

    if (typeof filmName !== "string" || typeof rotationType !== "string" || typeof region !== "string" || typeof lengthMinutes !== "number" || typeof videoFormat !== "string") {
        return "ERROR!: Formato esperado: {filmName: string, rotationType: string(CAV o CLV), region: string, lenghtMinutes:number, videoFormat: string (NTSC o PAL)}";
    }

    if (!(rotationType === "CAV" || rotationType === "CLV")) {
        return "ERROR!: Rotation type sólo puede ser CAV o CLV, comprueba que esté bien escrito";
    }

    if (!(videoFormat === "NTSC" || videoFormat === "PAL")) {
        return "ERROR!: Video format type sólo puede ser NTSC o PAL, comprueba que esté bien escrito";
    }

    return null;
};

export const extraerDisco = (datos: any): LD => {
    // const tamanhoBaseDeDatos =MONGODOMONGO discos.length;

    // const ultimoId:number = MONGODOMONGO discos[tamanhoBaseDeDatos - 1]?.id ?? 0;
    // const nuevoId: number = ultimoId === 0 ? ultimoId : ultimoId + 1;

    const nombre: string = datos.filmName;

    const tipoDeRotacion: "CAV" | "CLV" = datos.rotationType;

    const region: string = datos.region;

    const minutos: number = datos.lengthMinutes;
    const formato: "NTSC" | "PAL" = datos.videoFormat;

    return {
        filmName: nombre,
        rotationType: tipoDeRotacion,
        region: region,
        lengthMinutes: minutos,
        videoFormat: formato
    };
};
