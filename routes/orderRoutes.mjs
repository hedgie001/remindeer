import express from 'express';
const router = express.Router();
import {notesController} from '../controller/notesController';

router.get("/notes", notesController.getOrders.bind(notesController));
router.post("/notes", notesController.createNote.bind(notesController));
router.get("/notes/:id/", notesController.showNote.bind(notesController));
router.post("/notes/:id/", notesController.updateNote.bind(notesController));
router.delete("/notes/:id/", notesController.deleteNote.bind(notesController));

export const orderRoutes = router;