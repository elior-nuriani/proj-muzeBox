<template>
  <div id="app">
    <App-Header></App-Header>
    <router-view />
  </div>
</template>


<script src="https://www.youtube.com/iframe_api"></script>
<script>

import AppHeader from "./components/AppHeader";
export default {
  async created() {
    await this.$store.dispatch({ type: "loadUsers" });
    this.$store.dispatch({ type: "loadRooms" });
  },
  data() {
    return {};
  },
  components: {
    AppHeader
  }
};
</script>