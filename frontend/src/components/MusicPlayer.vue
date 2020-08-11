<template>
  <div class="music-player">
    <div id="player"></div>
    <div class="sync-btn btn" v-if="isShowSyncBtn" @click="sync()">
      <span>Sync</span>
      <span class="sync-icon">
        <font-awesome-icon icon="sync"></font-awesome-icon>
      </span>
    </div>
  </div>
</template>

<script>
import videoService from "../services/videoService";
import socketService from "../services/socketService";

export default {
  props: ["room"],
  async created() {
    this.loggedInUser = await this.$store.getters.loggedInUser;
  },
  data() {
    return {
      loggedInUser: null,
      counterFaildToSync: 0
    };
  },
  computed: {
    isShowSyncBtn() {
      if (this.room.roomAdminsId) {
        return this.loggedInUser
          ? this.room.isLive &&
              !this.room.roomAdminsId.includes(this.loggedInUser._id)
          : this.room.isLive;
      }
      return this.room.isLive;
    }
  },
  methods: {
    async sync() {
      //Check If the relavent methods are Inizialized ....
      if (
        this.room.isLive &&
        this.player().loadPlaylist &&
        this.player().seekTo
      ) {
        console.log("sync");
        await socketService.emit("get data", {
          room: this.room
        });
      } else {
        if (this.counterFaildToSync === 3) {
          this.showMessage("Cannot Sync, Try Refresh The Page");
        } else if (!this.room.isLive)
          this.showMessage("Cannot Sync, Room is NOT live room");
        else {
          this.counterFaildToSync += 1;
          this.showMessage("Cannot Sync Music Player ...  Try Again");
        }
        await videoService.initPlayer(this.room);
      }
    },
    player() {
      return videoService.getPlayer();
    },
    playVideo() {
      const time = videoService.getTime();
      socketService.emit("play video", time);
    },
    pauseVideo() {
      socketService.emit("stop video");
    },
    showMessage(msg = "Action Is Not Allowed") {
      this.$message({
        showClose: true,
        message: msg,
        duration: 5500
      });
    }
  },
  watch: {
    room: function() {
      videoService.loadPlayer(this.room);
    }
  }
};
</script>