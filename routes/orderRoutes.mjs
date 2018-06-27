import express from 'express';
const router = express.Router();
import {notesController} from '../controller/notesController';

router.get("/notes", notesController.getNotes.bind(notesController)); //Get All Notes
router.post("/notes", notesController.createNote.bind(notesController)); //Create new Note
router.get("/notes/:id/", notesController.showNote.bind(notesController)); //Get Note by ID
router.post("/notes/:id/", notesController.updateNote.bind(notesController)); //Update Note by ID
router.delete("/notes/:id/", notesController.deleteNote.bind(notesController)); //Delete Note by ID

export const orderRoutes = router;