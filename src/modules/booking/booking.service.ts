import { pool } from "../../config/db";

const createBooking = async (customer_id: string, vehicle_id: string, rent_start_date: string, rent_end_date: string, total_price: number, status: string) => {
    const result = await pool.query(`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status]);

    return result;
};

const getBooking = async () => {
    const result = await pool.query(`SELECT * FROM bookings`);

    return result;
};

const updateBooking = async (customer_id: string, vehicle_id: string, rent_start_date: string, rent_end_date: string, total_price: number, status: string, id: string) => {
    const result = await pool.query(`UPDATE bookings SET customer_id=$1, vehicle_id=$2, rent_start_date=$3, rent_end_date=$4, total_price=$5, status=$6 WHERE id=$7 RETURNING *`, [
        customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, id
    ]);

    return result;
};

export const bookingService = {
    createBooking,
    getBooking,
    updateBooking
}