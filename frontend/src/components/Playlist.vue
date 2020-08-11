<template>
  <div class="playlist">
    <div class="header-container flex row center justify-start">
      <span class="list-icon">
        <font-awesome-icon icon="list-ul" class="list-icon"></font-awesome-icon>
      </span>
      <h2>Playlist</h2>
    </div>
    <draggable
      :handle="isDragging"
      class="drag-wrapper"
      v-model="room.playlist"
      ghost-class="ghost"
    >
      <transition-group type="transition" name="flip-list">
        <div
          v-for="(video,idx) in room.playlist"
          :key="video.videoId"
          class="video-box video-box-playlist flex row center space-between"
          @dragend="handleDragend()"
          @touchend="handleDragend()"
          :data-idx="idx"
        >
          <div class="video-details">
            <span class="playlist-idx">{{+idx+1}}.</span>
            {{video.title}}
          </div>
          <span
            @click="removeVideoFromPlaylist(video.videoId)"
            class="btn remove icon-wrapper flex row center"
          >
            <i class="fas fa-times"></i>
          </span>
          <span class="btn flex row center">
            <el-checkbox
              v-model="checkboxVals[idx]"
              @click.native="showDisableMsg"
              @change="changePlaylistOrder(idx)"
              :disabled="!isAdmin"
            ></el-checkbox>
          </span>
          <div class="video-img" :style="`background-image: url(${video.img});`"></div>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import SocketService from "../services/socketService";

export default {
  props: ["room", "isAdmin"],
  created() {},
  data() {
    return {
      nums: [],
      checkboxVals: {}
    };
  },
  computed: {
    isDragging() {
      //Empty String Allow Drag and Drog
      if (this.isAdmin) {
        return "";
      }
      return "false";
    },
    roomPlaylist() {
      return this.room.playlist;
    }
  },
  methods: {
    handleDragend() {
      SocketService.emit("change room", this.room);
    },
    removeVideoFromPlaylist(videoId) {
      if (this.isAdmin) {
        this.$emit("removeVideo", videoId);
      } else
        this.$emit(
          "showMessage",
          "Only Admins Are Allowed removing video from playlist"
        );
    },
    async changePlaylistOrder(num) {
      if (this.isAdmin) {
        if (this.nums.includes(num)) {
          // console.log("num is include inside the array", this.nums);
          const idx = this.nums.findIndex(currNum => {
            return currNum === num;
          });
          this.nums.splice(idx, 1);
          // console.log("end of splice", this.nums);
        } else this.nums.push(num);
        console.log(this.nums, "update middle func");
        if (this.nums.length === 2) {
          // console.log("start playlist change order");
          //Change The Locations Of the two idxs...
          // console.log(this.room.playlist[this.nums[0]]);
          let temp = this.room.playlist[this.nums[0]];
          this.room.playlist[this.nums[0]] = this.room.playlist[this.nums[1]];
          this.room.playlist[this.nums[1]] = temp;

          //Reset section !
          this.nums.forEach(num => {
            // let strNum = num + '';
            this.checkboxVals[num] = false;
          });
          this.nums = [];

          // console.log(this.room.playlist);
          await SocketService.emit("change room", this.room);
        }
      } else
        this.$emit(
          "showMessage",
          "Only Admins Are Allowed Updating Playlist"
        );
    },
    showDisableMsg() {
      if (!this.isAdmin) {
        this.$emit(
          "showMessage",
          "Only Admins Are Allowed Updating Playlist"
        );
      }
    }
  },
  watch: {
    // roomPlaylist() {
    //   console.log("playlist changed!");
    //   // SocketService.emit("change room", this.room);
    // }
  },
  components: {
    draggable
  }
};
</script>