import { SessionNote } from '../Models/sessionNotesModel';

export const createSessionNotes = async (data: any) => {
    return await SessionNote.create(data);
};

export const getSessionNotes = async () => {
    return await SessionNote.findAll();
};