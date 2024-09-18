const pool = require("../configs/db");

exports.createCar = async (carData) => {
  const { name, status = "Not inspected" } = carData;
  const query = "INSERT INTO cars (name, status) VALUES ($1, $2) RETURNING *";
  const values = [name, status];
  const res = await pool.query(query, values);
  return res.rows[0];
};

exports.getAllCars = async () => {
  const query = ` 
    SELECT * FROM cars
  `;
  const res = await pool.query(query);
  return res.rows;
};

exports.getCarById = async (carId) => {
  const query = `
    SELECT c.*, ic.is_good, ic.note, cr.name AS criteria_name
    FROM cars c
    LEFT JOIN inspection_criteria ic ON c.id = ic.car_id
    LEFT JOIN criteria cr ON ic.criteria_id = cr.id
    WHERE c.id = $1
  `;
  const res = await pool.query(query, [carId]);
  return res.rows;
};

exports.updateCarStatus = async (carId, status) => {
  const query = "UPDATE cars SET status = $1 WHERE id = $2 RETURNING *";
  const res = await pool.query(query, [status, carId]);
  return res.rows[0];
};

exports.deleteCar = async (carId) => {
  const query = "DELETE FROM cars WHERE id = $1";
  await pool.query(query, [carId]);
};
