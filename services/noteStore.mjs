import Datastore from 'nedb-promise'

export class Note {
    constructor(title, description, date, importance) {
        this.title = title;
        this.description = description;
        this.date = date;
        this.created = new Date();
        this.importance = importance;
        this.status = "UNDONE";
    }
}

export class NoteStore {
    constructor(db) {
        this.db = db || new Datastore({filename: './data/notes.db', autoload: true});
    }

    async add(title, description, date, importance) {
        let note = new Note(title, description, date, importance);
        return await this.db.insert(note);
    }
    async update(id, title, description, date, importance, status) {
        return await this.db.update({_id: id}, { $set: { title: title, description: description, importance: importance, date: date, status: status } });
    }

    async delete(id) {
        await this.db.update({_id: id}, {$set: {"status": "DELETE"}});
        return await this.get(id);
    }

    async get(id) {
        return await this.db.findOne({_id: id});
    }

    async all(showAll = true) {
        let query = {};
        if(!showAll) query = {"status" : "UNDONE"};
        return await this.db.find(query);
    }
}

export const noteStore = new NoteStore();
