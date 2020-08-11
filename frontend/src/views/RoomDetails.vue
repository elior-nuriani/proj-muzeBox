<template>
  <div class="room-wrapper base-padding">
    <div class="room-details-container container">
      <div class="details-header flex row center space-between">
        <h3 class="flex row center">{{this.room.name}}</h3>
        <div class="btns-box flex row center">
          <div class="header-info flex row center">
            <div v-if="!isUserLikedRoom" @click="addLike()">
              {{this.room.rating}}
              <font-awesome-icon icon="thumbs-up" class="btn info-icon like" />
            </div>

            <div v-else @click="removeLike()">
              {{this.room.rating}}
              <font-awesome-icon icon="thumbs-down" class="btn info-icon liked" />
            </div>
            <div>
              {{this.room.views}}
              <i class="far fa-eye info-icon views"></i>
            </div>
          </div>
          <div
            v-if="!isSearchTabOpen"
            class="btn add-btn"
            @click="toggleSearchTabOpen()"
          >Add To Playlist</div>
          <div v-else class="btn add-btn" @click="toggleSearchTabOpen()">Expand Chat</div>
          <div class="btn" @click="removeRoom()">
            <font-awesome-icon icon="times"></font-awesome-icon>
          </div>
        </div>
      </div>
      <RoomChat :room="room" class="chat" :class="searchTabOpen" @showMessage="this.showMessage" />
      <SearchTab
        class="search-container"
        :class="searchTabOpen"
        :room="room"
        :isAdmin="isAdmin"
        @addVideo="this.addVideo"
      />
      <MusicPlayer :room="room" ref="musicPlayer" />
      <Playlist
        :room="room"
        :isAdmin="isAdmin"
        @removeVideo="this.removeVideo"
        @showMessage="this.showMessage"
      />
      <div v-if="checkMemebersCount()" class="social-box flex column">
        <div class="tag">Memebers:</div>
        <div class="profile-imgs-container flex row center justify-start">
          <div
            class="profile-img"
            v-for="(memeber,idx) in memebers"
            :key="idx"
            :style="`background-image: url(${memeber.imgUrl});`"
          ></div>
          <div v-if="showMemebersDiff" class="profile-img profile-count flex row center">
            <span>+{{showMemebersDiff}}</span>
          </div>
        </div>
      </div>
      <div class="social-box flex row center" v-else>No Memebers in the Room For Now</div>
      <div class="admins-box">
        <div class="tag">Admins:</div>
        <div class="profile-imgs-container flex row center justify-start">
          <div
            class="profile-img"
            v-for="(admin,idx) in admins"
            :key="idx"
            :style="`background-image: url(${admin.imgUrl});`"
          ></div>
        </div>
      </div>
      <div class="action-box-mobile flex row center space-evenly">
        <span @click="handleSyncButton()">
          <font-awesome-icon icon="sync"></font-awesome-icon>
        </span>
        <span @click="toggleSearchTabOpen()">
          <font-awesome-icon icon="plus"></font-awesome-icon>
        </span>
        <span @click="togglePlaylistOpen()">
          <font-awesome-icon icon="random"></font-awesome-icon>
        </span>
      </div>
    </div>
  </div>
</template>



<script>
import MusicPlayer from "../components/MusicPlayer";
import Playlist from "../components/Playlist";
import SearchTab from "../components/SearchTab";
import RoomChat from "../components/RoomChat";
import SocketService from "../services/socketService";
import utilService from "../services/utilService";
import videoService from "../services/videoService";
import socketService from "../services/socketService";

export default {
  async created() {
    //Register TO sockets first
    SocketService.setup();
    SocketService.on("add newMember", this.updateRoom);
    // SocketService.on("remove newMember", this.updateRoom);
    SocketService.on("update room", this.updateRoom);
    SocketService.on("set rating", this.updateRoom);
    SocketService.on("set viewCount", this.setViewsCount);
    // SocketService.on("start video", this.startVideo);
    // SocketService.on("pause video", this.pauesVideo);
    SocketService.on("get data from admin", this.getPlayerData);
    SocketService.on("cancel sync", this.cancelSync);
    SocketService.on("update data from admin", this.updatePlayerData);
    SocketService.on("handle remove room", this.handleRemoveRoom);

    await this.$store.dispatch({ type: "loadUsers" });

    var id = await this.$route.params.id;
    var rooms = await this.$store.getters.rooms;
    this.room = rooms.find(room => {
      return room._id === id;
    });

    SocketService.emit("setChatRoom", this.room.name);

    const views = await this.$store.dispatch({ type: "initCurrViews", id });
    this.room.views = views;

    this.loggedInUser = await this.$store.getters.loggedInUser;
    var isUserRegisterToRoom = false;

    if (this.loggedInUser) {
      isUserRegisterToRoom = this.room.memebersId.includes(
        this.loggedInUser._id
      )
        ? // this.room.roomAdminsId.includes(this.loggedInUser._id)
          true
        : false;
    }

    if (
      this.loggedInUser &&
      !isUserRegisterToRoom &&
      !sessionStorage.isRefresh
    ) {
      socketService.emit("update roomMemembers", {
        type: "ADD",
        room: this.room,
        loggedInUser: this.loggedInUser,
        factor: 1
      });
    } else if (!sessionStorage.isRefresh) {
      await SocketService.emit("change viewCount", {
        room: this.room,
        factor: 1
      });
    }

    utilService.saveToSession("isRefresh", true);

    if (this.room.isLive) {
      await socketService.emit("check room host", {
        room: this.room,
        loggedInUser: this.loggedInUser
      });
    }

    // this.loggedInUser = await this.$store.getters.loggedInUser;
    // var isUserRegisterToRoom = false;

    // if (this.loggedInUser) {
    //   isUserRegisterToRoom = this.room.memebersId.includes(
    //     this.loggedInUser._id
    //   )
    //     ? // this.room.roomAdminsId.includes(this.loggedInUser._id)
    //       true
    //     : false;
    // }

    // if (this.loggedInUser && !isUserRegisterToRoom) {
    //   await SocketService.emit("add memeber", {
    //     loggedInUser: this.loggedInUser,
    //     room: this.room
    //   });
    // }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    console.log("Destroyed");

    window.removeEventListener("resize", this.handleResize);

    sessionStorage.removeItem("isRefresh");
    videoService.resetPlayer();

    socketService.emit("update roomMemembers", {
      type: "REMOVE",
      room: this.room,
      loggedInUser: this.loggedInUser,
      factor: -1
    });

    // SocketService.emit("change viewCount", {
    //   room: this.room,
    //   factor: -1
    // });

    // SocketService.emit("remove memeber", {
    //   loggedInUser: this.loggedInUser,
    //   room: this.room
    // });

    // SocketService.off("remove newMember", this.loggedInUser);
    SocketService.off("add newMember", this.addMsg);
    SocketService.off("set viewCount", this.updateRoom);
    SocketService.off("create element", this.createElement);
    SocketService.off("update room", this.updateRoom);
    SocketService.off("get data from admin", this.getPlayerData);
    SocketService.off("update data from admin", this.updatePlayerData);
    SocketService.off("cancel sync", this.cancelSync);

    SocketService.terminate();
  },
  data() {
    return {
      room: {},
      loggedInUser: null,
      isSearchTabOpen: false,
      memebersFactor: 10
    };
  },
  computed: {
    users() {
      return this.$store.getters.users;
    },
    currViews() {
      return this.$store.getters.currViews;
    },
    memebers() {
      if (this.room.memebersId) {
        let memebers = this.room.memebersId.map(id => {
          return this.users.find(user => {
            return user._id === id;
          });
        });
        //Only 10 Memebers will appear
        return memebers.slice(0, this.memebersFactor);
      }
      return [];
    },
    admins() {
      if (this.room.roomAdminsId) {
        let admins = this.room.roomAdminsId.map(id => {
          return this.users.find(user => {
            return user._id === id;
          });
        });
        //Only 3 Memebers will appear
        return admins.slice(0, 3);
      }
      return [];
    },
    searchTabOpen() {
      return { "open-search-tab": this.isSearchTabOpen };
    },
    showMemebersDiff() {
      var diff = -1;
      if (this.room.memebersId.length) {
        diff = this.room.memebersId.length - this.memebersFactor;
      }
      return diff < 1 ? false : diff;
    },
    isUserLikedRoom() {
      if (this.loggedInUser && this.loggedInUser.ratedRoomsId) {
        return this.loggedInUser.ratedRoomsId.includes(this.room._id);
      }
      return false;
    },
    isAdmin() {
      if (this.room.roomAdminsId) {
        return (
          this.loggedInUser &&
          this.room.roomAdminsId.includes(this.loggedInUser._id)
        );
      }
      return false;
    }
  },
  methods: {
    updateRoom(room) {
      this.room = Object.assign({}, room);
      this.$store.dispatch({ type: "updateRoom", room: this.room });
    },
    setViewsCount(room) {
      this.room = Object.assign({}, room);
      // await this.$store.dispatch({ type: "setViewsCount", views });
    },
    toggleSearchTabOpen() {
      if (this.isAdmin) {
        this.isSearchTabOpen = !this.isSearchTabOpen;
      } else
        this.showMessage("Only Admins Are Allowed adding video to playlist");
    },
    addVideo(video) {
      videoService.addVideoToPlaylist(video);
      this.room.playlist.push(video);
      this.updateRoom(this.room);
      SocketService.emit("change room", this.room);
    },
    removeVideo(videoId) {
      var idx = videoService.removeVideoFromPlaylist(videoId);
      if (idx !== -1) {
        this.room.playlist.splice(idx, 1);
        this.updateRoom(this.room);
        SocketService.emit("change room", this.room);
      }
    },
    checkMemebersCount() {
      return this.memebers.length !== 0;
    },
    addLike() {
      if (this.loggedInUser) {
        this.loggedInUser.ratedRoomsId.push(this.room._id);
        this.$store.dispatch({
          type: "updateUser",
          loggedInUser: this.loggedInUser
        });
        SocketService.emit("change rating", { room: this.room, factor: 1 });
      } else this.showMessage("Please Log In or Register");
    },
    removeLike() {
      if (this.loggedInUser) {
        const idx = this.loggedInUser.ratedRoomsId.findIndex(roomId => {
          roomId === this.room._id;
        });
        this.loggedInUser.ratedRoomsId.splice(idx, 1);
        this.$store.dispatch({
          type: "updateUser",
          loggedInUser: this.loggedInUser
        });
        SocketService.emit("change rating", { room: this.room, factor: -1 });
      } else this.showMessage("Please Log In or Register");
    },

    showMessage(msg = "Action Is Not Allowed") {
      this.$message({
        showClose: true,
        message: msg,
        duration: 5500
      });
    },
    cancelSync() {
      this.showMessage("Can Not Sync , Admin Is not in the room");
    },
    startVideo(currTime) {
      videoService.startVideo(currTime);
    },
    pauesVideo() {
      videoService.stopVideo();
    },
    handleResize() {
      const elHeader = document.querySelector(".app-header");
      if (window.innerWidth < 730) this.memebersFactor = 5;
      if (
        window.innerWidth < 630 &&
        !elHeader.classList.contains("set-navbar-pref")
      ) {
        elHeader.classList.add("set-navbar-pref");
      }
    },
    async getPlayerData(socketId) {
      console.log("get your player data");
      const data = await videoService.getPlayerData();
      console.log(data);
      await SocketService.emit("update new watcher", { to: socketId, data });
    },
    async updatePlayerData(data) {
      console.log(data);
      await videoService.updatePlayerData(data);
    },

    togglePlaylistOpen() {
      const elMusicPlayer = document.querySelector(".music-player");
      const elPlaylist = document.querySelector(".playlist");
      elMusicPlayer.classList.toggle("close");
      elPlaylist.classList.toggle("show");
    },
    handleSyncButton() {
      this.$refs.musicPlayer.sync();
    },

    //Handle Removing Room By The Admin
    async removeRoom() {
      if (this.isAdmin) {
        this.$confirm(
          "This will permanently delete the existing Room. Continue?",
          "Warning",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning"
          }
        )
          .then(async () => {
            await this.$store.dispatch({
              type: "removeRoom",
              id: this.room._id
            });
            SocketService.emit("handle remove room", this.room._id);
            this.$router.push("/");
            this.showMessage(`Successfully Removed "${this.room.name}" room`);
          })
          .catch(() => {
            this.showMessage("Delete Cancelled");
          });
      } else
        this.showMessage("Only Room Creators Or Supervisor can Delete Room!");
    },
    //Handle Remove room While There ARE still Clients connected....
    async handleRemoveRoom(id) {
      await this.$store.dispatch({ type: "removeRoomSockets", id });
      this.$router.push("/");
      this.showMessage(`Room Was Removed By Room Creator Or Supervisor`);
    }
  },
  components: {
    MusicPlayer,
    Playlist,
    RoomChat,
    SearchTab
  }
};
</script>