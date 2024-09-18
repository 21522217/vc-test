const inspectionModel = require("../models/inspection");

exports.addInspection = async (req, res, next) => {
  try {
    const { carId, criteriaId } = req.params;
    const { is_good, note } = req.body;
    const inspectionCriteria = await inspectionModel.addInspectionCriteria(
      carId,
      criteriaId,
      is_good,
      note
    );
    res.status(201).json(inspectionCriteria);
  } catch (err) {
    next(err);
  }
};

exports.updateInspection = async (req, res, next) => {
  try {
    const { is_good, note } = req.body;
    const inspectionCriteria = await inspectionModel.updateInspection(
      req.params.id,
      is_good,
      note
    );
    res.status(200).json(inspectionCriteria);
  } catch (err) {
    next(err);
  }
};

exports.getAllInspections = async (req, res, next) => {
  try {
    const inspections = await inspectionModel.getAllInspections();
    res.status(200).json(inspections);
  } catch (err) {
    next(err);
  }
};

exports.getCarInspectionByCarId = async (req, res, next) => {
  try {
    const inspectionCriteria = await inspectionModel.getInspectionByCarId(
      req.params.carId
    );
    if (inspectionCriteria.length === 0)
      return res
        .status(404)
        .json({ message: "No criteria found for this car" });
    res.status(200).json(inspectionCriteria);
  } catch (err) {
    next(err);
  }
};
