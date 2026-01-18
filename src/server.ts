import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") })

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

// Users CRUD
app.post("/api/v1/users", async (req: Request, res: Response) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const result = await pool.query(`INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, email, password, phone, role]);

        res.status(201).json({
            success: true,
            message: "User inserted successfully",
            data: result.rows[0]
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});
// Users CRUD
app.get("/api/v1/users", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users`);
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result.rows
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});
// Users CRUD
app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const result = await pool.query(`UPDATE users SET name=$1, email=$2, password=$3, phone=$4, role=$5 WHERE id=$6 RETURNING *`, [
            name, email, password, phone, role, req.params.id
        ]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User update successfully",
                data: result.rows[0]
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});
// Users CRUD
app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
            req.params.id
        ]);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: null
            });
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

// Vehicles CRUD
app.post("/api/v1/vehicles", async (req: Request, res: Response) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    try {
        const result = await pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);

        res.status(201).json({
            success: true,
            message: "Vehicle inserted successfully",
            data: result.rows[0]
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});
// Vehicles CRUD => get all vehicles
app.get("/api/v1/vehicles", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM vehicles`);
        res.status(200).json({
            success: true,
            message: "vehicles fetched successfully",
            data: result.rows
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});
// Vehicles CRUD => get single vehicle
app.get("/api/v1/vehicles/:id", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
            req.params.id
        ]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: result.rows[0]
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});
// Vehicles CRUD
app.put("/api/v1/vehicles/:id", async (req: Request, res: Response) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    try {
        const result = await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`, [
            vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.id
        ]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicles not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle updated successfully"
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});
// Vehicles CRUD
app.delete("/api/v1/vehicles/:id", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [
            req.params.id
        ]);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle deleted successfully",
                data: null
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

// bookings CRUD
app.post("/api/v1/bookings", async (req: Request, res: Response) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status } = req.body;

    try {
        const customer = await pool.query(
            "SELECT id FROM users WHERE id = $1",
            [customer_id]
        );

        if (customer.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Customer does not exist"
            });
        }

        const vehicle = await pool.query(
            "SELECT id FROM vehicles WHERE id = $1",
            [vehicle_id]
        );

        if (vehicle.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Vehicle does not exist"
            });
        }

        const result = await pool.query(`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status]);

        res.status(201).json({
            success: true,
            message: "Bookings inserted successfully",
            data: result.rows[0]
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
// bookings CRUD => get all bookings
app.get("/api/v1/bookings", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM bookings`);
        res.status(200).json({
            success: true,
            message: "bookings fetched successfully",
            data: result.rows
        });

    } catch(err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
// bookings CRUD
app.put("/api/v1/bookings/:id", async (req: Request, res: Response) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status } = req.body;

    try {
        const result = await pool.query(`UPDATE bookings SET customer_id=$1, vehicle_id=$2, rent_start_date=$3, rent_end_date=$4, total_price=$5, status=$6 WHERE id=$7 RETURNING *`, [
            customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, req.params.id  
        ]);

        if(result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Bookings not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Bookings updated successfully"
            })
        }

    } catch(err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// for wrong path (if anyone hit wrong path)
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
