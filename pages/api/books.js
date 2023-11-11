import nc from 'next-connect';
import multer from 'multer';
import { authenticateTokenMiddleware } from '../../server/authenticateTokenMiddleware'; 
import { dbMiddleware } from '../../server/dbMiddleware'; 

const upload = multer({
  dest: './uploads/',
});

const handler = nc()
  .use(dbMiddleware)
  .use(upload.single('image'))
  .use(authenticateTokenMiddleware);

handler.post(async (req, res) => {
  const { title, author, publisher, year, pages } = req.body;
  try {
    const book = await req.db.query(
      'INSERT INTO books (title, author, publisher, year, pages, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, author, publisher, parseInt(year), parseInt(pages), req.file.path]
    );

    res.json({ book: book.rows[0] });
  } catch (err) {
    console.log('err', err);
    res.status(400).json({ message: 'Book creation failed' });
  }
});

handler.get(async (req, res) => {
  try {
    const books = await req.db.query('SELECT * FROM books');
    res.json({ books: books.rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error retrieving books' });
  }
});

export default handler;
