import { Character } from '../Models/characterModel';

export const getCharacters = async () => {
    return await Character.findAll();
};

export const createCharacter = async (data: any) => {
    return await Character.create(data);
};