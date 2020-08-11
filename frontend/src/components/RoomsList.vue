<template>
  <div  class="rooms-container">
    <div>
      <RoomPreview v-for="(room) in rooms" :key="room._id" class="room" :room="room" />
    </div>
  </div>
</template>

<script>
import RoomPreview from "../components/RoomPreview";
// import UtilService from '../services/utilService';

export default {
  props: ["rooms"],
  components: {
    RoomPreview
  },
  computed: {}
};
</script>