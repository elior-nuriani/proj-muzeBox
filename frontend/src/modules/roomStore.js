import RoomService from '../services/roomService';
import UtilService from '../services/utilService';
import roomService from '../services/roomService';


var sessionRooms = [];
if (sessionStorage.rooms) sessionRooms = JSON.parse(sessionStorage.rooms);


export default {
  state: {
    rooms: sessionRooms,
    filterBy: {
      txt: '',
      options: 'all'
    }
    // currViews: 0
  },
  getters: {
    rooms(state) {
      return state.rooms;
    },
    filterBy(state) {
      return state.filterBy
    }
    // currViews(state) {
    //   return state.currViews;
    // }

  },
  mutations: {

    loadRooms(state, { rooms }) {
      state.rooms = rooms;
      UtilService.saveToSession('rooms', rooms)
    },
    updateRoom(state, { room }) {
      var idx = state.rooms.findIndex((currRoom) => {
        return currRoom._id === room._id
      })
      state.rooms.splice(idx, 1, room);
      UtilService.saveToSession('rooms', state.rooms)
    },
    // setViewsCount(state, { views }) {
    //   state.currViews = views;
    // }
    addRoom(state, { room }) {
      state.rooms.push(room);
      UtilService.saveToSession('rooms', state.rooms)
    },
    removeRoom(state, { id }) {
      var idx = state.rooms.findIndex((currRoom) => {
        return currRoom._id === id
      })
      //when admin Leave and comeback to the room socket.brodcast is active too -- fix it ,bad practice!!
      if(idx !== -1) state.rooms.splice(idx, 1);
      UtilService.saveToSession('rooms', state.rooms)
    },
    setFilterBy(state, { filterBy }) {
      state.filterBy = filterBy;
    }
  },
  actions: {
    async loadRooms(context) {
      var rooms = await RoomService.query();
      context.commit({ type: 'loadRooms', rooms })
    },
    async updateRoom(context, { room }) {
      context.commit({ type: 'updateRoom', room })
    },
    // async setViewsCount(context, { views }) {
    //   context.commit({ type: "setViewsCount", views })
    // },
    async initCurrViews(context, { id }) {
      const { views } = await RoomService.getById(id);
      // context.commit({ type: "setViewsCount", views })
      return views;
    },
    async createRoom(context, { room }) {
      const addedRoom = await RoomService.add(room);
      context.commit({ type: 'addRoom', room: addedRoom })
    },
    async setFilterBy(context, { filterBy }) {
      context.commit({ type: 'setFilterBy', filterBy })
    },
    //Updating Database
    async removeRoom(context, { id }) {
      await roomService.remove(id);
      context.commit({ type: 'removeRoom', id })
    },
    //Without Updating Databas
    async removeRoomSockets(context, { id }) {
      context.commit({ type: 'removeRoom', id })
    }
  },
}
