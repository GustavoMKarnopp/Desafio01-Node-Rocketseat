import {parse} from 'csv-parse';

import fs from 'node:fs';

let numeroAleatorio = Math.floor(Math.random() * 100);

const csvPath = new URL(`./arquivo-csv/arquivo-${numeroAleatorio}.csv`, import.meta.url);

const stream = fs.createReadStream(csvPath);

const csvStream = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2
})

async function run(){
    const lineParse = stream.pipe(csvStream);

    for await (const line of lineParse){
        const [title, description] = line;

        return JSON.stringify({
            title,
            description,
        })    
    }
}

fetch('http://localhost:3333/task', {
    method: 'POST',
    body: run(),
    headers: {
        'Content-Type': 'application/json',
    },
}).then(response => {
    response.text().then(data => {
        console.log(data)
    })
})