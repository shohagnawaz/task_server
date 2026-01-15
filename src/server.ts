import express, { Request, Response } from "express";
import { Pool } from "pg";
const app = express();
const port = 5000;

// middleware/parser
app.use(express.json());
// app.use(express.urlencoded());

// Neon DB
const pool = new Pool({
    connectionString: `postgresql://neondb_owner:npg_vnQeB6W5gCSw@ep-calm-band-ah467r8a-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
});

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role user_role NOT NULL DEFAULT 'user'
        )
        `)
};
initDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Next Level Developers!')
});

app.post("/", (req, res) => {
    console.log(req.body);

    res.status(201).json({
        success: true,
        message: "API is working"
    })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
