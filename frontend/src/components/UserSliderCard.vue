<template>
  <div @click="moveToUserProfile" class="user-slider-card-wrapper flex column btn">
    <div
      class="slider-user-img flex column center justify-end"
      :style="`background-image:linear-gradient(rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.7)),url(${user.imgUrl})`"
    >
      <div class="user-info flex column center">
        <p>{{user.firstName}} {{user.lastName}}</p>
        <p>{{user.city}}, {{user.country}}</p>
      </div>

      <div class="user-rooms-list flex row center space-between">
        <div v-if="roomsPerUser.length" class="flex row center btn">
          <div
            v-for="(room,idx) in roomsPerUser"
            class="user-room"
            :key="idx"
            :style="`background-image:linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)),url(${room.playlist[0].img})`"
          ></div>
          <div class="explore-btn flex row center">
            <font-awesome-icon icon="long-arrow-alt-right" />
          </div>
        </div>
        <div v-else>No Current Rooms</div>
        <div class="rating-wrapper">
          <font-awesome-icon icon="star" class="rating-star" />
          <span>{{user.rating}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["user"],
  methods:{
    moveToUserProfile(){
      this.$router.push(`user/${this.user._id}`)
    }
  },
  computed: {
    rooms() {
      return this.$store.getters.rooms;
    },
    roomsPerUser() {
      const rooms = this.rooms;
      const roomsPerUser = rooms.filter(room => {
        return room.roomAdminsId.includes(this.user._id);
      });
      return roomsPerUser.slice(0, 3);
    }
  }
};
</script>