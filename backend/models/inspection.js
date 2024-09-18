const pool = require("../configs/db");

exports.addInspection = async (carId, criteriaId, isGood, note) => {
  const query = `
    INSERT INTO inspection_criteria (car_id, criteria_id, is_good, note) 
    VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = [carId, criteriaId, isGood, note];
  const res = await pool.query(query, values);
  return res.rows[0];
};

exports.updateInspection = async (id, isGood, note) => {
  const query = `
    UPDATE inspection_criteria SET is_good = $1, note = $2 
    WHERE id = $3 RETURNING *`;
  const res = await pool.query(query, [isGood, note, id]);
  return res.rows[0];
};

exports.getAllInspections = async () => {
  const query = `SELECT * from inspection_criteria`
  const res = await pool.query(query)
  return res.rows
};

exports.getInspectionByCarId = async (carId) => {
  const query = `
    SELECT ic.*, cr.name AS criteria_name
    FROM inspection_criteria ic     
    JOIN criteria cr ON ic.criteria_id = cr.id 
    WHERE ic.car_id = $1`;
  const res = await pool.query(query, [carId]);
  return res.rows;
};
