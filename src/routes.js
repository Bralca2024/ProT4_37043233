import { Router } from "express";
import { book } from "./controller.js";

export const router = Router();
router.get('/books', book.getAll);
router.get('/books/:id', book.getBookById);
router.post('/book', book.addBook);
router.put('/update/:id', book.updateBook);
router.delete('/delete', book.deleteByISBN);
