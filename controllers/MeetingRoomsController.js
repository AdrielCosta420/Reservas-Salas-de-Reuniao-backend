const MeetingRoom = require('../models/MeetingRoom');
const jwt = require('jsonwebtoken');
const getToken = require('../helpers/get_token');
require('dotenv').config()

const createMeetingRoom = async (req, res) => {
    const { name, description, status } = req.body;

    if (!name) {
        return res.status(422).json({ msg: "O campo nome é obrigatório!" });
    }

    if (!status) {
        return res.status(422).json({ msg: "Campo é obrigatório!" });
    }

    const newMeetingRoom = new MeetingRoom({ name, description, status });

    try {
        const savedRoom = await newMeetingRoom.save();
        res.status(201).json(savedRoom);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const updateRoom = async (req, res) => {
    const id = req.params.id;
    const { name, description, status, startTime, endTime, participants } = req.body;

    try {
        const room = await MeetingRoom.findById(id);
        if (!room) {
            return res.status(404).json({ message: 'Sala de reunião não encontrada.' });
        }

        room.name = name;
        room.description = description;
        room.status = status;
        room.startTime = startTime;
        room.endTime = endTime;
        room.participants = participants;

        await room.save();
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

const getAllRooms = async (req, res) => {
    try {
        const rooms = await MeetingRoom.find();
        if (rooms.length === 0) {
            res.status(404).json({ msg: 'Não existe salas cadastradas.' })
        }
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

const reserveRoom = async (req, res) => {
    const id = req.params.id;

    const { startTime, endTime, participants } = req.body;

    let userId;
    try {

        if (req.headers.authorization) {
            const secret = process.env.JWT_SECRET;

            const token = getToken(req);
            const decoded = jwt.verify(token, secret);
            userId = decoded.id;

        }
        const room = await MeetingRoom.findById(id);


        if (!room) {
            return res.status(404).json({ message: 'Sala de reunião não encontrada.' });
        }

        if (room.status === 'ocupado') {
            return res.status(409).json({ message: 'Sala já está ocupada para este horário.' });
        }


        room.status = 'ocupada';
        room.participants = participants;
        room.startTime = startTime;
        room.endTime = endTime;
        room.reservedBy = userId;

        await room.save();

        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ msg: 'Erro no servidor', error: error.message });
    }
}

const cancelRoom = async (req, res) => {
    const id = req.params.id;


    let userId;

    try {
        if (req.headers.authorization) {
            const secret = process.env.JWT_SECRET;

            const token = getToken(req);
            const decoded = jwt.verify(token, secret);
            
            userId = decoded.id;
        }
        

        const room = await MeetingRoom.findById(id);
        if (!room) {
            return res.status(404).json({ message: 'Sala de reunião não encontrada.' });
        }

        if (room.reservedBy.toString() !== userId) {
            return res.status(403).json({ message: 'Você não tem permissão para cancelar esta reserva.' });
        }


        if (room.status === 'livre') {
            return res.status(409).json({ message: 'A sala já está livre.' });
        }

        room.status = 'livre';
        room.startTime = null;
        room.endTime = null;
        room.participants = null;

        await room.save();
        res.status(200).json({ message: 'Sala de reunião cancelada com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};


const deleteRoom = async (req, res) => {
    const id = req.params.id;


    try {
        const room = MeetingRoom.findById(id);

        if (!room) {
            return res.status(404).json({ msg: 'A sala informada não existe.' });
        }

        await room.deleteOne();
        res.status(200).json({ msg: 'Sala deletada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
}



module.exports = { createMeetingRoom, getAllRooms, reserveRoom, updateRoom, cancelRoom, deleteRoom }