import mongoose from "mongoose";

const notifModel = mongoose.Schema({
    chat: [],
    content: String,
    count: Number,
    sender: []
})

const notif = mongoose.model("Notification", notifModel)

export default notif