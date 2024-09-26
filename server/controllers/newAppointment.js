import Appointment from "../models/appointmentModel.js";
import dayjs from "dayjs";

export const newAppointment = async (req, res) => {
  try {
    const {
      name,
      email,
      number,
      subject,
      enrollment,
      platform,
      manager,
      description,
      date,
      time,
      ad,
    } = req.body;

    // Convert the date string to a Date object
    const appointmentDate = new Date(date);

    // Get the start and end of the day for the selected date
    const startOfDay = dayjs(appointmentDate).startOf("day").toDate();
    const endOfDay = dayjs(appointmentDate).endOf("day").toDate();

    // Count the number of appointments for the user on the same date
    const existingAppointments = await Appointment.find({
      enrollment,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingAppointments.length >= 3) {
      return res.status(400).json({
        error: "Booking limit reached",
        message:
          "You can only book 3 appointments within a single day. Please try another day.",
      });
    }

    // If the user has less than 3 appointments, allow the booking
    const newAppointment = new Appointment({
      name,
      email,
      number,
      subject,
      enrollment,
      platform,
      manager,
      description,
      date,
      time,
      ad,
    });

    const appointment = await newAppointment.save();
    console.log(appointment);
    res.status(200).json({
      message: "New appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error creating appointment", error);
    res.status(500).json({ error: "Could not create new appointment" });
  }
};
