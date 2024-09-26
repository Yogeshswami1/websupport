import Click from "../models/Click.js";

export const handleButtonClick = async (req, res) => {
  try {
    const { userId } = req.body;

    const twentyFourHoursAgo = new Date(Date.now() - 10 * 60 * 60 * 1000);
    const recentClicks = await Click.find({
      userId,
      clickedAt: { $gte: twentyFourHoursAgo },
    });

    if (recentClicks.length >= 3) {
      return res
        .status(400)
        .json({ msg: "You can only book 3 appointments within 24 hours." });
    }
    const newClick = new Click({ userId });
    await newClick.save();

    res.status(200).json({ msg: "Button clicked successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
