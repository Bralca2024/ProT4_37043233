import { pool } from "./database.js";

class BooksController {

  async getOne(req, res) {
    try {
      // Se obtiene el ID del libro desde los parámetros de la URL
      const bookId = req.params.id;
      // Consulta el libro en la base de datos
      const [result] = await pool.query('SELECT * FROM libros WHERE id = ?', [bookId]);
      // Verifica si se encontró el libro
      if (result.length === 0) {
        return res.status(404).json({ message: 'Libro no encontrado' });
      }
      // Devuelve el libro encontrado
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
      // Validación de campos
      if (!book.titulo || !book.autor || !book.categoria || !book.año_publicacion || !book.isbn) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
      }
      // Se utiliza un regExp para validar el formato de año_publicacion (YYYY-MM-DD)
      const yearPublicationRegex = /^\d{4}-\d{2}-\d{2}$/;

      if (!yearPublicationRegex.test(book.año_publicacion)) {
        return res.status(400).json({ message: 'El formato de año_publicacion debe ser YYYY-MM-DD.' });
      }
      // Se verifica si el ISBN ya existe en la base de datos
      const [existingBook] = await pool.query(
        'SELECT * FROM libros WHERE isbn = ?',
        [book.isbn]
      );

      if (existingBook.length > 0) {
        return res.status(400).json({ message: 'El ISBN ya existe en la base de datos.' });
      }
      // Realiza un inserción de los elementos en la base de datos
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
      // Verifica que se haya proporcionado un ISBN en el cuerpo de la solicitud
      if (!isbn) {
        return res.status(400).json({ error: "ISBN del libro es requerido" });
      }
      // Realiza la consulta para eliminar un libro
      const [result] = await pool.query(`DELETE FROM Libros WHERE isbn = ?`, [isbn]);
      // Verifica si se eliminó correctamente el registro de la base de datos
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }
      // Muestra el número de registros eliminados
      res.json({ mensaje: "Registro eliminado", registrosEliminados: result.affectedRows });
    } catch (error) {
      console.error("Error al eliminar libro:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async updateBook(req, res) {
    try {
      // Se obtiene el ID del libro por los parámetros de la solicitud
      const bookId = req.params.id;

      const book = req.body;
      // Validación de campos
      if (!book.titulo || !book.autor || !book.categoria || !book.año_publicacion || !book.isbn) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
      }
      // Se utiliza un regExp para validar el formato de año_publicacion (YYYY-MM-DD)
      const yearPublicationRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!yearPublicationRegex.test(book.año_publicacion)) {
        return res.status(400).json({ message: 'El formato de año_publicacion debe ser YYYY-MM-DD.' });
      }
      // Verifica si sl libro existe en la base de datos
      const [existingBookCheck] = await pool.query(
        'SELECT * FROM libros WHERE id = ?',
        [bookId]
      );

      if (existingBookCheck.length === 0) {
        return res.status(404).json({ message: 'El libro con el ID que ingresó no existe.' });
      }
      // Verificar si el ISBN ya existe en la base de datos (excluyendo el libro actual)
      const [duplicateISBNCheck] = await pool.query(
        'SELECT * FROM libros WHERE isbn = ? AND id <> ?',
        [book.isbn, bookId]
      );

      if (duplicateISBNCheck.length > 0) {
        return res.status(400).json({ message: 'El ISBN ya existe en la base de datos.' });
      }
      // Actualiza el libro en la base de datos
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
