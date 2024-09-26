import createManager from "../models/createManagerModel.js";
import createUser from "../models/createUserModel.js";
import Ticket from "../models/ticketModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const addCommentAndClose = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { comment, name, role } = req.body;

    let email;
    let status = "Closed";

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const { userId } = ticket;
    const managerName = ticket.manager;

    const User = await createUser.findById(userId);
    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }
    email = User.email;

    const ManagerData = await createManager.findOne({ name: managerName });
    if (!ManagerData) {
      return res.status(404).json({ message: "Manager not found" });
    }
    const managerEmail = ManagerData.email;

    ticket.comments.push({ comment, name });
    ticket.status = status;
    await ticket.save();

    // Prepare email content
    const emailContent = `
      <h2>Ticket Update</h2>
      <p><strong>Ticket ID:</strong> TCK${ticket.ticketId}</p>
      <p><strong>Comment:</strong> ${comment}</p>
      <p><strong>Added by:</strong> ${name}</p>
      <p><strong>Status:</strong> ${status}</p>
    `;

    // Email options for user
    const mailOptionsUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Update on your support ticket",
      html: emailContent,
    };

    // Email options for manager
    const mailOptionsManager = {
      from: process.env.EMAIL_USER,
      to: managerEmail,
      subject: "Update on a managed support ticket",
      html: emailContent,
    };

    // Send emails
    transporter.sendMail(mailOptionsUser, (error, info) => {
      if (error) {
      } else {
      }
    });

    transporter.sendMail(mailOptionsManager, (error, info) => {
      if (error) {
      } else {
      }
    });

    res.status(200).json({ message: "Comment added successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error } );
  }
};
