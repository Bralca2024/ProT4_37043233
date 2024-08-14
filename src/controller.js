import { pool } from "./database.js";

class BooksController {

  async getBookById(req, res) {
    try {
      const bookId = req.params.id;

      if (!bookId) {
        return res.status(400).json({ message: 'ID del libro es requerido' });
      }

      const [result] = await pool.query('SELECT * FROM libros WHERE id = ?', [bookId]);

      if (result.length === 0) {
        return res.status(404).json({ message: 'Libro no encontrado' });
      }

      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json({ message: `${error.message}` });
    }
  }

  async getAll(req, res) {
    try {
      const [result] = await pool.query('SELECT * FROM libros');
      res.status(201).json(result);
    } catch (error) {
      res.json({ 'message': `${error.message}` })
    }
  }

  async addBook(req, res) {
    try {
      const book = req.body;

      if (!book.titulo || !book.autor || !book.categoria || !book.año_publicacion || !book.isbn) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
      }

      const yearPublicationRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (!yearPublicationRegex.test(book.año_publicacion)) {
        return res.status(400).json({ message: 'El formato de año_publicacion debe ser YYYY-MM-DD.' });
      }

      const [existingBook] = await pool.query(
        'SELECT * FROM libros WHERE isbn = ?',
        [book.isbn]
      );

      if (existingBook.length > 0) {
        return res.status(400).json({ message: 'El ISBN ya existe en la base de datos.' });
      }

      const [result] = await pool.query(
        `INSERT INTO libros (titulo, autor, categoria, año_publicacion, isbn) VALUES (?, ?, ?, ?, ?)`,
        [book.titulo, book.autor, book.categoria, book.año_publicacion, book.isbn]
      );
      res.status(201).json({ "ID Insertado": result.insertId });
    } catch (error) {
      console.error(`Message: ${error}`);
      res.status(500).json({ message: 'Error al agregar el libro.' });
    }
  }

  async deleteByISBN(req, res) {
    try {
      const { isbn } = req.body;

      if (!isbn) {
        return res.status(400).json({ error: "ISBN del libro es requerido" });
      }

      const [result] = await pool.query(`DELETE FROM Libros WHERE isbn = ?`, [isbn]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }

      res.json({ mensaje: "Registro eliminado", registrosEliminados: result.affectedRows });
    } catch (error) {
      console.error("Error al eliminar libro:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateBook(req, res) {
    try {
      const bookId = req.params.id;
      const book = req.body;
      await pool.query(
        `UPDATE libros SET titulo = ?, autor = ?, categoria = ?, año_publicacion = ?, isbn = ? WHERE id = ?`,
        [book.titulo, book.autor, book.categoria, book.año_publicacion, book.isbn, bookId]
      );
      res.json({ message: 'Libro actualizado correctamente.' });
    } catch (error) {
      console.error("Error al actualizar libro:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }


}

export const book = new BooksController();
