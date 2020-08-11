<template>
  <div class="trend-user-preview btn flex row center justify-start" @click="moveToUserProfile()">
    <div
      class="trend-user-img"
      :style="`background-image:linear-gradient(rgba(0, 0, 0, 0.1),rgba(0, 0, 0, 0.7)),url(${user.imgUrl})`"
    ></div>
    <div class="trend-user-details flex row center space-between">
      <div class="trend-user-info flex row center justify-start">
        <div class="flex column center align-start personal-info">
          <p>{{user.firstName}} {{user.lastName}}</p>
          <p>{{user.city}}, {{user.country}}</p>
          <p class="rating-wrapper-mobile">
            <font-awesome-icon icon="star" class="rating-star" />
            <span>{{user.rating}}</span>
            <span v-if="idx == 0">🏆</span>
            <span v-else-if="idx == 1">🥈</span>
            <span v-else-if="idx == 2">🥉</span>
          </p>
        </div>
        <div class="rating-wrapper">
          <font-awesome-icon icon="star" class="rating-star" />
          <span>{{user.rating}}</span>
          <span v-if="idx == 0">🏆</span>
          <span v-else-if="idx == 1">🥈</span>
          <span v-else-if="idx == 2">🥉</span>
        </div>
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
        <div class="user-room-alt" v-else>No Rooms Currently</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["user", "idx"],
  methods: {
    moveToUserProfile() {
      this.$router.push(`user/${this.user._id}`);
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