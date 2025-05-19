import { ResolveTimestamps, Types } from "mongoose";
import Jam from "../models/Jam";
import User from "../models/User";
import { Request, Response } from "express";

export const createJam = async (req: Request, res: Response) => {
  try {
    const { name, notes, date, time, location, guests, createdBy, options } = req.body;

    if (!name || !date || !createdBy) {
      return res.status(400).json({ message: "Name, date, and createdBy are required." });
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

export const getAllJams = async (req: Request, res: Response) => {
  try {
    const jams = await Jam.find()
      .populate("createdBy", "name")
      .populate("guests", "name");
    return res.status(200).json(jams);
  } catch (error) {
    console.error("Error fetching jams:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}


export const deleteJam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    };

    const deletedJam = await Jam.findByIdAndDelete(id);

    if (!deletedJam) {
      return res.status(400).json({message: "Jam not found"})
    }

    return res.status(200).json({ message: "Jam deleted successfully." });

  } catch (error) {
    console.error("Error deleting Jam:", error);
    return res.status(500).json({ message: "Server error while deleting Jam." });
  }
}

export const getJam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    };

    const jam = await Jam.findById(id)
      .populate("createdBy", "name")
      .populate("guests", "name");
    
    if (!jam) {
      return res.status(400).json({ message: "Jam not found" });
    }

    return res.status(200).json(jam);
  } catch (error) {
    console.error("Error fetching jam:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

export const updateJam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Jam ID." });
    }

    const { name, notes, date, time, location, guests, createdBy, options } = req.body;

    if (date) {
      const parsedDate = new Date(date);
      if (
        !(parsedDate instanceof Date)
      ) {
        return res.status(400).json({ message: "Invalid required data types." });
      }
    }

    if (
      (name && typeof name !== "string") ||
      (notes && typeof notes !== "string") ||
      (time && typeof time !== "string") ||
      (location && typeof location !== "string") ||
      (guests && !Array.isArray(guests)) ||
      (options && !Array.isArray(options))
    ) {
      return res.status(400).json({ message: "Invalid optional data types." });
    }



    // TODO: Validate request body
    const updates = req.body;

    const updatedJam = await Jam.findByIdAndUpdate(id, updates, {
      new: true, // return the updated document
      runValidators: true, // enforce schema validation
    });

    if (!updatedJam) {
      return res.status(404).json({ message: "Jam not found." });
    }

    return res.status(200).json(updatedJam);

  } catch (error) {
      return res.status(400).json({ message: "Error Updating" });
  }

}
