import { Types } from "mongoose";
import Jam from "../models/Jam";
import { Request, Response } from "express";

export const createJam = async (req: Request, res: Response) => {
  try {
    const { name, notes, date, time, location, guests, createdBy, options } =
      req.body;

    if (!name || !date || !createdBy) {
      return res
        .status(400)
        .json({ message: "Name, date, and createdBy are required." });
    }

    const parsedDate = new Date(date);
    if (
      typeof name !== "string" ||
      !(parsedDate instanceof Date) ||
      !Types.ObjectId.isValid(createdBy)
    ) {
      return res.status(400).json({ message: "Invalid required data types." });
    }

    if (
      (notes && typeof notes !== "string") ||
      (time && typeof time !== "string") ||
      (location && typeof location !== "string") ||
      (guests && !Array.isArray(guests)) ||
      (options && !Array.isArray(options))
    ) {
      return res.status(400).json({ message: "Invalid optional data types." });
    }

    if (
      guests &&
      !guests.every((guest: any) => Types.ObjectId.isValid(guest))
    ) {
      return res.status(400).json({ message: "Invalid guest IDs." });
    }

    if (
      options &&
      !options.every(
        (option: any) =>
          typeof option.option === "string" &&
          Array.isArray(option.votes) &&
          option.votes.every((vote: any) => Types.ObjectId.isValid(vote))
      )
    ) {
      return res.status(400).json({ message: "Invalid options format." });
    }

    const newJam = new Jam({
      name,
      notes,
      date,
      time,
      location,
      guests,
      createdBy,
      options,
    });
    
    const savedJam = await newJam.save();
    console.log("Jam created:", savedJam);
    return res.status(201).json(savedJam);

  } catch (error) {
    console.error("Error creating jam:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

