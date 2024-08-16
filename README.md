# Biblioteca API

## 1. Importaciones
- Realiza las importaciones correspondientes de las dependencias que se utilizaron en la actividad, abriendo la terminal del editor de código y ejecutando el comando:
npm i

- La base de datos se encuentra en la carpeta `BD` bajo el nombre `biblioteca_api.sql`.

## 2. Configuración de la Aplicación
- Establece el puerto en el que la aplicación escuchará (3000). La ruta es [http://localhost:3000/](http://localhost:3000/).
- Es necesario estar logueado en POSTMAN para poder utilizar todos los métodos de petición correspondientes.

## 3. Rutas
- Se define un enrutador que maneja las siguientes rutas:
- `GET /books`: Obtiene todos los libros.
- `GET /books/:id`: Obtiene un libro específico por ID.
- `POST /book`: Agrega un nuevo libro.
- `PUT /update/:id`: Actualiza un libro existente por ID.
- `DELETE /delete`: Elimina un libro por ISBN en el cuerpo de la solicitud.

## 4. Controlador de Libros (`BooksController`)
- **getOne**: Obtiene un libro por ID, con validaciones para comprobar la existencia del mismo.
- **getAll**: Devuelve todos los libros de la base de datos.
- **addBook**: Agrega un nuevo libro, realizando validaciones para asegurar que todos los campos son obligatorios, que el formato de la fecha es correcto y que el ISBN no está duplicado.
- **deleteByISBN**: Elimina un libro por ISBN, validando que se proporcione un ISBN y que el libro exista.
- **updateBook**: Actualiza un libro existente, con validaciones para asegurar que todos los campos son obligatorios, que el formato de la fecha es correcto, que el libro existe y que el ISBN no está duplicado.

## 5. Manejo de Errores
- Se implementan bloques `try/catch` para manejar errores en las operaciones de base de datos y devolver mensajes de error apropiados.

## 6. Inicio del Servidor
- Se inicia el servidor y se muestra un mensaje en la consola indicando que está en funcionamiento en el puerto especificado.
