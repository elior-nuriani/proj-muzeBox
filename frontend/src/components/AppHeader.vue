<template>
  <section class="app-header set-navbar-pref\ flex row center space-between">
    <div @click="toggleMenuButtonOpen" class="body-screen" :class="menuButtonOpen"></div>
    <div @click="moveToHomePage()" class="logo"></div>
    <div class="nav flex row center" :class="menuButtonOpen">
      <router-link to="/login" class="flex row center space-between">
        Login
        <font-awesome-icon class="arrow-icon" icon="angle-right"></font-awesome-icon>
      </router-link>
      <router-link to="/signup" class="flex row center space-between">
        Signup
        <font-awesome-icon class="arrow-icon" icon="angle-right"></font-awesome-icon>
      </router-link>
      <router-link to="/about" class="flex row center space-between">
        About
        <font-awesome-icon class="arrow-icon" icon="angle-right"></font-awesome-icon>
      </router-link>
      <!-- <router-link to="/settings" class="flex row center space-between">
        Settings
        <font-awesome-icon class="arrow-icon" icon="angle-right"></font-awesome-icon>
      </router-link> -->
      <div
        class="loggedInUser-img"
        v-if="loggedInUser"
        :style="`background-image:url(${loggedInUser.imgUrl})`"
      ></div>
    </div>
    <div class="nav-mobile flex row center">
      <div
        class="loggedInUser-img"
        v-if="loggedInUser"
        :style="`background-image:url(${loggedInUser.imgUrl})`"
      ></div>
      <MenuButton @click.native="toggleMenuButtonOpen()" :class="menuButtonOpen"></MenuButton>
    </div>
  </section>
</template>

<script>
import MenuButton from "../components/MenuButton";
export default {
  data() {
    return {
      isMenuButtonOpen: false,
      isShowBodyScreen: false
    };
  },
  methods: {
    moveToHomePage() {
      this.$router.push("/");
    },
    toggleMenuButtonOpen() {
      this.isMenuButtonOpen = !this.isMenuButtonOpen;
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
    menuButtonOpen() {
      return { open: this.isMenuButtonOpen };
    }
  },
  components: {
    MenuButton
  }
};
</script>