import {noteStore} from '../services/noteStore'

export class OrdersController {
    async getOrders(req, res) {
        res.json((await noteStore.all(req) || []))
    };

    async createNote(req, res) {
        let note = req.body;
        res.json(await noteStore.add(note.title, note.description, note.date, note.importance));
    };

    async showNote(req, res) {
        res.json(await noteStore.get(req.params.id));
    };

    async deleteNote(req, res) {
        res.json(await noteStore.delete(req.params.id));
    };

    async updateNote(req, res) {
        let note = req.body;
        res.json(await noteStore.update(req.params.id, note.title, note.description, note.date, note.importance));
    };
}

export const notesController = new OrdersController();