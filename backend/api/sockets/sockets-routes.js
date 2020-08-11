const roomService = require('../rooms/rooms.service');

module.exports = connectSockets

function connectSockets(io) {
    io.on('connection', socket => {
        //Setting Room Socket By Name = Prefer Id....
        socket.on('setChatRoom', room => {
            // console.log(room,'room')
            if (socket.room) {
                socket.leave(socket.room)
            }
            socket.join(room);
            socket.room = room;
            console.log(socket.room)
            // var clients = io.sockets.adapter.rooms[room].host;
        })

        socket.on('chat newMsg', msg => {
            io.to(socket.room).emit('chat addMsg', msg)
        })

        socket.on('change viewCount', async ({ room, factor }) => {
            room.views = room.views + factor;
            await roomService.update(room);
            await io.to(socket.room).emit('set viewCount', room);
        })

        socket.on('change rating', ({ room, factor }) => {
            room.rating = room.rating + factor;
            roomService.update(room);
            io.to(socket.room).emit('set rating', room);
        })

        socket.on('change room', (room) => {
            roomService.update(room);
            io.to(socket.room).emit('update room', room)
        })

        socket.on('init element', (icon) => {
            io.to(socket.room).emit('create element', icon)
        })

        socket.on('update roomMemembers', ({ type, room, loggedInUser, factor }) => {

            if (type === 'REMOVE') {
                if (room.memebersId && loggedInUser) {
                    const idx = room.memebersId.findIndex(memeberId => {
                        return memeberId === loggedInUser._id;
                    });
                    if (idx !== -1) {
                        room.memebersId.splice(idx, 1);
                    }
                }
            }
            if (type === 'ADD') {
                if (
                    room.memebersId && loggedInUser._id &&
                    room.memebersId.indexOf(loggedInUser._id) === -1
                ) {
                    room.memebersId.push(loggedInUser._id);
                }
            }

            room.views = room.views + factor;
            roomService.update(room);
            io.to(socket.room).emit('update room', room);

        })
        socket.on('play video', (currTime) => {
            io.to(socket.room).emit('start video', currTime);
        })
        socket.on('stop video', () => {
            io.to(socket.room).emit('pause video')
        })

        socket.on('check room host', ({ room, loggedInUser }) => {
            if (!io.rooms) io.rooms = {}
            if (room.roomAdminsId && loggedInUser) {
                if (room.roomAdminsId.includes(loggedInUser._id)) {
                    io.rooms[room._id] = socket.id;
                }
            }
        })

        socket.on('get data', ({room}) => {
            if (socket.id !== io.rooms[room._id]) {
                //Give Us The Admins Data - Synchronize
                (io.rooms[room._id])? io.to(io.rooms[room._id]).emit('get data from admin', socket.id): io.to(socket.id).emit('cancel sync');
            }
        })

        socket.on('update new watcher', ({ to, data }) => {
            console.log(to)
            io.to(to).emit('update data from admin', data)
        })

        socket.on('handle remove room', (id) =>{
            socket.broadcast.to(socket.room).emit('handle remove room',id);
        })
    })
}





        // socket.on('add memeber', ({ loggedInUser, room }) => {
        //     if (
        //         room.memebersId && loggedInUser._id &&
        //         room.memebersId.indexOf(loggedInUser._id) === -1
        //     ) {
        //         room.memebersId.push(loggedInUser._id);
        //         roomService.update(room);
        //     }

        //     io.to(socket.room).emit('add newMember', room);
        // })
        // socket.on('remove memeber', ({ loggedInUser, room }) => {

        //     if (room.memebersId && loggedInUser) {
        //         const idx = room.memebersId.findIndex(memeberId => {
        //             return memeberId === loggedInUser._id;
        //         });
        //         if (idx !== -1) {
        //             room.memebersId.splice(idx, 1);
        //             roomService.update(room);
        //         }
        //     }

        //     io.to(socket.room).emit('remove newMember', room);

        // })
