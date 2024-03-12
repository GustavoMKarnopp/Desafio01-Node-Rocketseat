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
            const { title, description, completed_at, created_at, updated_at } = req.body;
            const tasks = {
                id: randomUUID(),
                title, 
                description, 
                completed_at, 
                created_at, 
                updated_at
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
            const { title, description } = req.body;
            database.update('tasks', id, {title, description});
            return res.writeHead(201).end();
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
    }
]