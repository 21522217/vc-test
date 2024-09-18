const express = require("express")
const inspectionController = require("../controllers/inspection")
const router = express.Router();

router.post("/cars/:carId/criteria/:criteriaId", inspectionController.addInspection)
router.get("/cars/:carId/inspect", inspectionController.getCarInspectionByCarId)
router.get("/inspections", inspectionController.getAllInspections)
router.put("/inspection/:id", inspectionController.updateInspection)

module.exports = router;