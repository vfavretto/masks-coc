import {Request, Response} from 'express';
import { getCharacters, createCharacter } from '../Services/characterService';

export const getAllCharacters = async (req: Request, res: Response) => {
    try{
        const character = await getCharacters();
        res.json(character);
    } catch (erro){
        res.status(500).json({ error: "Erro ao buscar personagens" });
    }
};

export const addCharacter = async (req: Request, res: Response) => {
    try{
        const newCharacter = await createCharacter(req.body);
        res.status(201).json(newCharacter);
    } catch (erro){
        res.status(400).json({ error: "Dados invalidos" });
    }
};