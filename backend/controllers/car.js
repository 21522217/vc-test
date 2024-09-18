const carModel = require('../models/car');

exports.createCar = async (req, res, next) => {
  try {
    const car = await carModel.createCar(req.body);
    res.status(201).json(car);
  } catch (err) {
    next(err);
  }
};

exports.getCar = async (req, res, next) => {
  try {
    const car = await carModel.getCarById(req.params.id);
    if (car.length === 0) return res.status(404).json({ message: 'Car not found' });
    res.status(200).json(car);
  } catch (err) {
    next(err);
  }
};

exports.getAllCars = async (req, res, next) => {
  try {
    const cars = await carModel.getAllCars();
    res.status(200).json(cars)
  } catch(err) {
    next(err)
  }
}

exports.updateCarStatus = async (req, res, next) => {
  try {
    const car = await carModel.updateCarStatus(req.params.id, req.body.status);
    res.status(200).json(car);
  } catch (err) {
    next(err);
  }
};

exports.deleteCar = async (req, res, next) => {
  try {
    await carModel.deleteCar(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
