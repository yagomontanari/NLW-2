import { Request, Response, request, response } from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
    week_day: number
    from: string
    to: string
}

export default class ClassesController {
    async index(request: Request, response: Response) { //Metodo para listagem da aulas
        const filters = request.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;


        if (!filters.week_day || !filters.subject || !filters.time) {
            return response.status(400).json({
                error: 'Missing filters to search classes'
            })

        }

        const timeInMinutes = convertHourToMinutes(time);

        console.log(timeInMinutes);
        console.log();

        const classes = await db('classes')
            .whereExists(function () {  //Query para a tabela Schedule para verificar se há o horário disponível para a aula.
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` >= ??', [timeInMinutes])
            })



            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id') //Inner join para trazer os dados da tabela
            .select(['classes.*', 'users.*']); //seleciona todos os dados do usuário e classe
        return response.json(classes);
    }

    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;

        const trx = await db.transaction(); // Função que verifica todos os dados que sao inseridos, so commita se não tiver nenhum erro em um dos passos.

        try {
            const insertedUsersIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            });

            const user_id = insertedUsersIds[0];

            const insertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id,
            });

            const class_id = insertedClassesIds[0];

            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to),
                };
            })

            await trx('class_schedule').insert(classSchedule);

            await trx.commit();

            return response.status(201).send();
        } catch (err) {
            await trx.rollback(); //Desfaz qualquer alteração realizada nesse meio tempo!

            return response.status(400).json({
                error: 'Unexpected error while creating new class'
            })
        }

    }
}