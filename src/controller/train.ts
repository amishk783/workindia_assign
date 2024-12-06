import { sequelize } from "@/db";
import Booking from "@/db/schema/Booking";
import Train from "@/db/schema/Train";
import User from "@/db/schema/User";
import { AuthenticatedRequest } from "@/types";
import { AppError } from "@/utils/AppError";
import Logger from "@/utils/logger";
import { trainCreateSchema } from "@/utils/validationSchema";
import { Request, Response, NextFunction } from "express";

export const createTrainController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const exisitngTrain = await Train.findOne({ where: { trainName: "" } });

  try {
    const validatedData = trainCreateSchema.parse(req.body);
    if (exisitngTrain) {
      Logger.error("Train Alreaddy exits");
      throw new AppError("User already exits", 403);
    }

    const newTrain = await Train.create({
      trainName: validatedData.trainName,
      source_station: validatedData.source_station,
      destination_station: validatedData.destination_station,
      total_seats: validatedData.totalSeats,
      available_seats: validatedData.totalSeats,
    });

    await newTrain.save();

    Logger.silly("Train added successfully");
    res.status(201).json({ message: "Train added successfully", newTrain });
  } catch (error) {
    next(error);
  }
};

export const getAllTrains = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { source, destination } = req.query;
    console.log("🚀 ~ destination:", destination);
    console.log("🚀 ~ source:", source);

    if (!source) {
      Logger.error("Source station Id not found");
      throw new AppError("Source station Id not found", 400);
    }
    if (!destination) {
      Logger.error("Destination station Id not found");
      throw new AppError("Destination station Id nout found", 400);
    }
    const trains = await Train.findAll({
      where: {
        source_station: source as string,
        destination_station: destination as string,
      },
    });

    if (trains.length === 0) {
      Logger.error("Train not found");
      throw new AppError("Train not found", 400);
    }

    res.status(200).send({ message: "Trains found successfully", trains });
  } catch (error) {
    console.log("🚀 ~ error:", error);
    // next(error);
  }
};

export const bookSeatController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id: trainId } = req.params;

  if (!trainId) {
    Logger.error("Train Id not found");
    throw new AppError("Train Id not found", 400);
  }
  const { userId } = req.user;
  console.log("🚀 ~ userId:", userId);

  console.log("🚀 ~ user:", userId);

  const transaction = await sequelize.transaction();

  try {
    const train = await Train.findByPk(trainId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!train) throw new AppError("Train not found", 400);

    if (train.available_seats <= 0) {
      throw new AppError("No seats available", 400);
    }
  
    const seatNo = train.total_seats - train.available_seats;

    await Booking.create(
      {
        user_id: userId,
        train_id: trainId,
        seat_no: seatNo,
      },
      { transaction }
    );

    train.available_seats -= 1;
    console.log(train.available_seats);
    await train.save({ transaction });

    await transaction.commit();

    Logger.silly("Seat booked successfully");
    res.status(200).json({ message: "Seat booked successfully", seatNo });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

export const getBookingDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) throw new AppError("Booking not found", 400);
    res.status(200).json({ message: "Booking retrived successfully", booking });
  } catch (error) {
    next(error);
  }
};
