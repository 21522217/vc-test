const express = require("express");
const carController = require("../controllers/car");
const router = express.Router();

router.post("/cars", carController.createCar);
router.get("/cars", carController.getAllCars);
router.get("/cars/:id", carController.getCar);
router.put("/cars/:id/status", carController.updateCarStatus);
router.delete("/cars/:id", carController.deleteCar);

module.exports = router;
