import express from "express";
import {
    createBook,
    getBooks,
    updateBook,
    deleteBook,
} from "../controllers/book.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateUser);

router.get("/", getBooks);
router.post("/", createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;