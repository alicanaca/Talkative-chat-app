import Notif from '../Models/notifModel.js'

const sendNotif = async (req, res) => {
    const notif = req.body

    if (!notif) { return res.sendStatus(400) }

    var newNotif = {
        chat: notif.chat,
        sender: notif.sender,
        count: notif.count,
        content: notif.content
    }

    try {
        var notification = await Notif.create(newNotif)
        res.send(notification)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
}

export { sendNotif }