<template>
  <div>
    <div class="header-container flex row center justify-start">
      <span @click="handleSearch()">
        <i class="icon-search icon fas fa-search"></i>
      </span>
      <input v-on:keyup.enter="handleSearch()" class="input" v-model="txt" placeholder="Search" />
    </div>
    <div v-if="this.isOptionsExist" class="search-options-container flex column">
      <div class="video-box flex row center justify-start" v-for="(video,idx) in videos" :key="idx">
        <div class="video-img" :style="`background-image: url(${video.img});`"></div>
        <div class="video-details flex column center align-start">
          <span class="video-title">{{video.title}}</span>
        </div>
        <div class="icons-container flex row center justify-end">
          <span class="btn info icon-wrapper flex row center">
            <i class="fas fa-info"></i>
          </span>
          <span @click="addVideo(video)" class="btn add icon-wrapper flex row center">
            <i class="fas fa-plus"></i>
          </span>
        </div>
      </div>
    </div>
    <div v-else class="search-msg flex row center">
      <span>{{msg}}</span>
    </div>
  </div>
</template>

<script>
import videoService from "../services/videoService";

export default {
  props: ["room","isAdmin"],
  data() {
    return {
      txt: "",
      videos: [],
      msg: "Search Video For Your Playlist ..."
    };
  },
  methods: {
    async handleSearch() {
      if (this.isAdmin && this.txt) {
        var searchValue = this.txt;
        const data = await videoService.loadVids(searchValue);
        this.videos = data.map(video => {
          return {
            videoId: video.id.videoId,
            title: video.snippet.title,
            img: video.snippet.thumbnails.default.url
          };
        });
        this.txt = "";
        if(!this.videos.length) this.msg = "No Results Found ...";
      }
    },
    async addVideo(video) {
      this.$emit('addVideo',video)
    }
  },
  computed: {
    isOptionsExist() {
      return !!this.videos.length;
    }
  }
};
</script>