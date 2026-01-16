import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(), ".env")})

const app = express();
const port = 5000;

// middleware/parser
app.use(express.json());
// app.use(express.urlencoded());

// Neon DB
const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STR}`
});

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(50) NOT NULL
        )
        `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(10) CHECK (type IN ('car', 'bike', 'van', 'SUV')) NOT NULL,
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price NUMERIC(10,2) CHECK (daily_rent_price > 0) NOT NULL,
        availability_status VARCHAR(10) CHECK (availability_status IN ('available', 'booked')) DEFAULT 'available'  
        )            
        `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price NUMERIC(10,2) CHECK (total_price > 0) NOT NULL,
        status VARCHAR(10) CHECK (status IN ('active', 'cancelled', 'returned')) DEFAULT 'active'
        )
        `);
};
initDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Next Level Developers!')
});

app.post("/", (req: Request, res: Response) => {
    console.log(req.body);

    res.status(201).json({
        success: true,
        message: "API is working"
    })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
