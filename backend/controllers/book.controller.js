import Book from "../models/Book.js";

export const createBook = async (req, res) => {
    try {
        const { title, author, genre } = req.body;

        if (!title || !author || !genre) {
            return res.status(400).json({
                message: "Title, author and genre are required",
            });
        }

        const book = await Book.create({
            title,
            author,
            genre,
            user: req.userId,
        });

        res.status(201).json({
            message: "Book created successfully",
            book,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message,
        });
    }
};

export const getBooks = async (req, res) => {
    try {
        const books = await Book.find({
            user: req.userId,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            books,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message,
        });
    }
};

export const updateBook = async (req, res) => {
    try {
        const { title, author, genre } = req.body;

        if (!title || !author || !genre) {
            return res.status(400).json({
                message: "Title, author and genre are required",
            });
        }

        const book = await Book.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId,
            },
            {
                title,
                author,
                genre,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        res.status(200).json({
            message: "Book updated successfully",
            book,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message,
        });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({
            _id: req.params.id,
            user: req.userId,
        });

        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        res.status(200).json({
            message: "Book deleted successfully",
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message,
        });
    }
};