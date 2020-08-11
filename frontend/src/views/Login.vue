<template>
  <section class="form-wrapper flex row center justify-start">
    <div class="form flex column center">
      <h2 class="form-title">Sign In</h2>
      <div class="input-container flex column">
        <div class="flex row center">
          <span class="icon-wrapper-login users-icon-wrapper flex row center justify-start">
            <font-awesome-icon icon="users"></font-awesome-icon>
          </span>
          <el-input class="input" v-model="userCred.email" type="email" placeholder="Email"></el-input>
        </div>
        <div class="flex row center">
          <span class="icon-wrapper-login lock-icon-wrapper flex row center justify-start">
            <font-awesome-icon icon="lock"></font-awesome-icon>
          </span>
          <el-input class="input" v-model="userCred.password" placeholder="Password" show-password></el-input>
        </div>
      </div>
      <div class="btns-box flex row center space-between">
        <div>
          Dont Have Account ?
          <span class="register btn" @click="moveToRegister()">Register</span>
        </div>
        <button v-if="!loggedInUser" class="login-btn" @click="handleLogin()">Login</button>
        <button v-else class="login-btn" @click="handleLogout()">Logout</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      userCred: {
        email: "",
        password: ""
      }
    };
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    }
  },
  methods: {
    async handleLogin() {
      //Shallow Copy
      const userCred = Object.assign({}, this.userCred);
      if (userCred.email && userCred.password) {
        const user = await this.$store.dispatch({ type: "doLogin", userCred });
        if(!user) this.showMessage('Email Or Password Are Invalid!')
        this.userCred.email = "";
        this.userCred.password = "";
      } else this.showMessage("Missing Required Fields");
    },
    async handleLogout() {
      await this.$store.dispatch({ type: "doLogout" });
    },
    moveToRegister() {
      this.$router.push("/signup");
    },
    showMessage(msg = "Action Is Not Allowed") {
      this.$message({
        showClose: true,
        message: msg,
        duration: 5500
      });
    }
  }
};
</script>