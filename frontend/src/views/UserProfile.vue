<template>
  <div v-if="this.user" class="user-profile-container container flex column">
    <div class="user-info flex row center">
      <div class="secondry-section flex column center">
        <div
          class="user-img"
          :style="`background-image:linear-gradient(rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.6)),url(${user.imgUrl})`"
        ></div>
      </div>
      <div class="primary-section user-content flex column">
        <div class="name flex row center justify-start">
          {{user.firstName}} {{user.lastName}}
          <div class="rating flex row center">
            {{user.rating}}
            <font-awesome-icon icon="star"></font-awesome-icon>
          </div>
        </div>
        <div class="address">{{user.country}}, {{user.city}}</div>
        <p>" {{user.motto}} "</p>
      </div>
    </div>
    <div class="user-room-list">
      <div class="room-list-header flex row center space-between">
        <h2 class="title">My Room List</h2>
        <div class="social-box flex row center">
          <span class="chat">
            <i class="fas fa-comments"></i>
          </span>
          <span class="insta">
            <i class="fab fa-instagram"></i>
          </span>
          <span class="face">
            <i class="fab fa-facebook"></i>
          </span>
        </div>
      </div>
      <div v-if="roomsPerUser.length">
        <div
          class="user-room-preview btn flex row center justify-start"
          v-for="(room, idx) in roomsPerUser"
          :key="room._id"
          @click="moveToRoom(room._id)"
        >
          <div class="room-idx flex row center">. {{+idx+1}}</div>
          <div class="room-video-img" :style="`background-image:url(${room.playlist[0].img})`"></div>
          <div class="room-name">{{room.name}}</div>
          <div class="room-desc">{{room.desc}}</div>
          <div class="room-rating flex row center">
            <span class="content">{{room.rating}}</span>
            <span class="rating">
              <font-awesome-icon icon="thumbs-up"></font-awesome-icon>
            </span>
          </div>
          <div class="room-views flex row center">
            <span class="content">{{room.views}}</span>
            <span class="views">
              <font-awesome-icon icon="eye"></font-awesome-icon>
            </span>
          </div>
        </div>
      </div>
      <div v-else class="user-room-preview-alt flex row center">No Rooms For Now ... </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    rooms() {
      return this.$store.getters.rooms;
    },
    roomsPerUser() {
      const rooms = this.rooms;
      const roomsPerUser = rooms.filter(room => {
        return room.roomAdminsId.includes(this.user._id);
      });
      return roomsPerUser.slice();
    },
    users() {
      return this.$store.getters.users;
    },
    user() {
      const id = this.$route.params.id;
      if (this.users) {
        return this.users.find(currUser => {
          return currUser._id === id;
        });
      }
      return null;
    }
  },
  methods: {
    moveToRoom(id) {
      this.$router.push(`/details/${id}`);
    }
  }
};
</script>