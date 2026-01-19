import { pool } from "../../config/db"

const createVehicle = async (vehicle_name: string, type: string, registration_number: string, daily_rent_price: number, availability_status: string) => {
    const result = await pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);

    return result;
};

const getVehicle = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);

    return result;
};
// get single item
const getSingleVehicle = async (id: string) => {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);

    return result;
};

export const vehicleService = {
    createVehicle,
    getVehicle,
    getSingleVehicle
}