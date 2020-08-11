<template>
  <el-carousel :interval="5000" outside :type="isMobileDisplay">
    <el-carousel-item
      v-for="(room,idx) in topRatedRooms"
      :key="room._id"
      :class="`boxs-${idx+1}`"
      :style="`background-image:linear-gradient(rgba(5, 5, 5, 0.500),rgba(5, 5, 5, 0.900)),url(${room.playlist[0].img})`"
      @click.native="moveToRoomDetails(room._id)"
    ></el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  props: ["topRatedRooms"],

  data() {
    return{

    }
  },
  computed: {
    isMobileDisplay(){
      return (window.innerWidth <= 540)? '' : 'card';
    }
  },
  methods: {
    moveToRoomDetails(id) {
      console.log(id);
      this.$router.push(`/details/${id}`);
    }
  }
};
</script>