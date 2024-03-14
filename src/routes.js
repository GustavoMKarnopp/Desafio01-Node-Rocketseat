import { randomUUID } from 'node:crypto';
import { DataBaseTask } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new DataBaseTask;

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/task'),
        handler: (req, res) => {
            const tasks = database.select('tasks');
            return res.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/task'),
        handler: (req, res) => {
            const { title, description } = req.body;

            if(!title || !description){
                return res.writeHead(404).end(
                    JSON.stringify({message: 'Preencha o texto ou descrição!' })
                )
            }

            const tasks = {
                id: randomUUID(),
                title, 
                description, 
                completed_at: null,
                created_at : new Date, 
                updated_at : new Date
            }
            database.insert('tasks', tasks);
            return res.writeHead(201).end();
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/task/:id'),
        handler: (req, res) => {
            const {id} = req.params;
            const { title, description} = req.body;
            const [task] = database.select('tasks', {id});
            if(!task){
                return res.writeHead(404).end();
            }
            database.update('tasks', id, {
                title : title ? title : task.title,
                description: description ? description : task.description, 
                updated_at : new Date
            });

            return res.writeHead(204).end();
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/task/:id/complete'),
        handler: (req, res) => {
            const {id} = req.params;
            const [task] = database.select('tasks', {id});
            if(!task){
                return res.writeHead(404).end();
            }
            const task_ok = !!task.completed_at;
            const success_task = task_ok ? null : new Date;
            database.update('tasks', id, {
                completed_at: success_task
            });
            return res.writeHead(204).end();
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/task/:id'),
        handler: (req, res) => {
            const {id} = req.params;
            database.delete('tasks', id);
            return res.writeHead(204).end();
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/task'),
        handler: (req, res) => {
            database.deleteFullTask('tasks');
            return res.writeHead(204).end();
        }
    }
]