import fs from 'node:fs/promises';

const dataPath = new URL('../db.json', import.meta.url);

export class DataBaseTask{
    
    #database = {};

    constructor(){
        fs.readFile(dataPath, 'utf8')
        .then(data => {
            this.#database = JSON.parse(data);
        })
        .catch(() => {
            this.#persist()
        })
    }

    #persist(){
        fs.writeFile(dataPath, JSON.stringify(this.#database))
    }

    select(table){
        const data = this.#database[table] ?? [];
        return data;
    }

    insert(table, data) {
        if(Array.isArray(this.#database[table])){
            this.#database[table].push(data);
        }else{
            this.#database[table] = [data];
        }
        this.#persist();
        return data;
    }

    update(table, id, data){
        const rowIndex = this.#database[table].findIndex(row => row.id === id)
        if(rowIndex > -1){
            const row = this.#database[table][rowIndex]
            this.#database[table][rowIndex] = {id, ...row, ...data};
            this.#persist();
        }
    }

    delete(table, id){
        const rowIndex = this.#database[table].findIndex(row => row.id === id);

        if(rowIndex > -1){
            this.#database[table].splice(rowIndex, 1);
            this.#persist()
        }
    }
}