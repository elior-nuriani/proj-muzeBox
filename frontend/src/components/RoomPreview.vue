<template>
  <div class="room-preview flex column" @click="this.handleRoomClicked">
    <div class="room-creators flex row center justify-start">
      <span>Created By</span>
      <div v-if="isAdminsInit" class="flex row center">
        <div
          class="admin-img"
          v-for="(admin,idx) in admins"
          :style="`background-image:url(${admin.imgUrl})`"
          :key="idx"
        ></div>
      </div>
    </div>
    <div
      class="room-img ratio-16-9"
      :style="`background-image:linear-gradient(rgba(0, 0, 0, 0.2),rgba(0, 0, 0, 0.2)),url(${setRoomImg})`"
    >
      <div class="img-icon-wrapper flex row justify-end align-end">
        <span v-if="this.room.isLive" class="img-icon live-title">🔴 Live</span>
        <span v-else>
          <font-awesome-icon class="img-icon" icon="play-circle"></font-awesome-icon>
        </span>
      </div>
    </div>
    <div class="room-content flex column">
      <h2 class="room-title flex row align-start space-between">
        <span>{{room.name}}</span>
        <span>
          <font-awesome-icon icon="list-ul" class="list-icon"></font-awesome-icon>
        </span>
      </h2>
      <p class="room-desc">{{room.desc}}</p>
    </div>
    <div class="room-tags-container flex row center justify-start wrap">
      <div v-for="(tag,idx) in tags" :key="idx" class="tag">{{tag}}</div>
    </div>

    <div class="room-info flex row center space-between">
      <div v-if="isRoomMemebersInit" class="memebers-container flex row center">
        <div
          class="room-memeber"
          v-for="memeber in roomMemebers"
          :key="memeber._id"
          :style="`background-image:url(${memeber.imgUrl})`"
        ></div>
        <div v-if="showMemebersDiff" class="room-memeber room-count flex row center">
          <span>+{{showMemebersDiff}}</span>
        </div>
      </div>
      <div class="stats flex row center">
        <div class="rating-icon-wrapper flex row">
          {{this.room.rating}}
          <span>
            <font-awesome-icon icon="thumbs-up" class="btn stats-icon rating" />
          </span>
        </div>
        <div class="views-icon-wrapper flex row">
          {{this.room.views}}
          <span>
            <i class="far fa-eye stats-icon views"></i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["room"],
  data() {
    return {
      memebersFactor: 4,
      defaultImg:
        "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
    };
  },
  methods: {
    handleRoomClicked() {
      this.$router.push(`/details/${this.room._id}`);
    }
  },
  computed: {
    users() {
      return this.$store.getters.users;
    },
    admins() {
      const adminsId = this.room.roomAdminsId;
      const admins = adminsId.map(adminId => {
        return this.users.find(user => {
          return user._id === adminId;
        });
      });
      return admins;
    },
    isAdminsInit() {
      const admins = this.admins;
      for (var admin in admins) {
        if (typeof admins[admin] === "undefined") return false;
      }
      return true;
    },
    setRoomImg() {
      return this.room.playlist[0]
        ? this.room.playlist[0].img
        : this.defaultImg;
    },
    tags() {
      //Max tags = 5
      return this.room.tags.slice(0, 5);
    },
    roomMemebers() {
      const memebersId = this.room.memebersId;
      const memebers = memebersId.map(memeberId => {
        return this.users.find(user => {
          return user._id === memeberId;
        });
      });
      //Max Memebers
      return memebers.slice(0, 4);
    },
    isRoomMemebersInit() {
      const memebers = this.roomMemebers;
      for (var memeber in memebers) {
        if (typeof memebers[memeber] === "undefined") return false;
      }
      return true;
    },
    showMemebersDiff() {
      var diff = -1;
      if (this.room.memebersId.length) {
        diff = this.room.memebersId.length - this.memebersFactor;
      }
      return diff < 1 ? false : diff;
    }
  }
};
</script>