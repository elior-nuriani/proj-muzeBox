<template>
  <div @click.stop class="create-room-container flex column center space-between">
    <h2 class="title">Create Your Room</h2>
    <div class="form">
      <label for="name-create">What Should We Call It ?</label>
      <el-input
        id="name-create"
        v-model="room.name"
        class="input"
        type="text"
        placeholder="Name Your Room"
        maxlength="60"
        show-word-limit
      ></el-input>
      <label for="desc-create">What We Need To Know About it ?</label>
      <el-input
        class="desc-create"
        v-model="room.desc"
        id="input"
        type="text"
        placeholder="Describe Your Room"
        maxlength="100"
        show-word-limit
      ></el-input>
      <label for="select-create">
        Create Tags Describing Your Room ,
        <span>You Can Add Your Own Tags !</span>
      </label>
      <el-select
        id="select-create"
        v-model="room.tags"
        multiple
        :filterable="true"
        :allow-create="true"
        :multiple-limit="5"
        placeholder="Create Your Tags"
      >
        <el-option
          v-for="tag in defaultTags"
          :key="tag.value"
          :label="tag.label"
          :value="tag.value"
        ></el-option>
      </el-select>
      <label for="live-create">
        Should It be a Live Room ?
        <span>Anyone Can Synchronize with the Video</span>
      </label>
      <span>
        <el-switch
          class="live-create"
          v-model="room.isLive"
          active-color="rgb(194, 145, 253)"
          inactive-color="rgba(194, 145, 253, 0.507)"
        ></el-switch>
        {{room.isLive}}
      </span>
    </div>
    <button @click="createRoom()" class="publish-btn">Publish Your Room</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      room: {
        name: "",
        desc: "",
        tags: [],
        isLive: true
      },
      defaultTags: [
        {
          value: "Hip Hop",
          label: "Hip Hop"
        },
        {
          value: "Classic",
          label: "Classic"
        },
        {
          value: "Rock",
          label: "Rock"
        },
        {
          value: "Alternative",
          label: "Alternative"
        },
        {
          value: "Dance",
          label: "Dance"
        },
        {
          value: "Pop",
          label: "Pop"
        },
        {
          value: "Rap",
          label: "Rap"
        },
        {
          value: "R&b",
          label: "R&b"
        },
        {
          value: "Reggaton",
          label: "Reggaton"
        },
        {
          value: "Techno",
          label: "Techno"
        },
        {
          value: "Trance",
          label: "Trance"
        },
        {
          value: "Soul",
          label: "Soul"
        },
        {
          value: "Hits",
          label: "Hits"
        }
      ]
    };
  },
  methods: {
    async createRoom() {
      if (this.loggedInUser && this.room.name) {
        var { _id } = this.loggedInUser;
        var room = Object.assign({}, this.room);
        room.roomAdminsId = [];
        room.roomAdminsId.push(_id);
        console.log(room, "newRoom!");
        await this.$store.dispatch({ type: "createRoom", room });
        this.showMessage('Successfully Created Room!')
      } else (!this.loggedInUser)? this.showMessage('Can Not Create Room , Please Log In Or Register'):
      this.showMessage('Room Name Required!')
  
    },
    showMessage(msg = "Action Is Not Allowed") {
      this.$message({
        showClose: true,
        message: msg,
        duration: 5500
      });
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    }
  }
};
</script>