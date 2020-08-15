import { Request, Response, request, response } from 'express';
import db from '../database/connection';

export default class ConnectionController {
    async index(request: Request, response: Response) {
        const totalConnections = await db('connections').count('* as total');

        const { total } = totalConnections[0]; //O knex retorna multiplos registros, sempre que for retornar somente um, deve pegar a primeira posição do array

        return response.json({ total });
    }

    async create(request: Request, response: Response) {
        const { user_id } = request.body;

        await db('connections').insert({
            user_id,
        });

        return response.status(201).send();
    }
}