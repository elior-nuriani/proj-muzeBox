<template>
  <section class="form-wrapper signup-wrapper flex row center space-between">
    <div class="form signup-form flex column space-between">
      <div class="flex column">
        <h2>Create your Account</h2>
        <p>Listen To Music, Connect People , Be part of our Community.</p>
      </div>
      <div class="input-first">
        <div class="flex row center">
          Firstname:
          <el-input v-model="userCred.firstName" type="text" placeholder="John"></el-input>
        </div>
      </div>
      <div class="input-last">
        <div class="flex row center">
          Lastname:
          <el-input v-model="userCred.lastName" type="text" placeholder="Doe"></el-input>
        </div>
      </div>
      <div class="input-user">
        <div class="flex row center">
          Email:
          <el-input v-model="userCred.email" type="email" placeholder="example@gmail.com"></el-input>
        </div>
      </div>
      <div class="input-pass">
        <div class="flex row center">
          Password:
          <el-input v-model="userCred.password" type="password" placeholder="*****" show-password></el-input>
        </div>
      </div>
      <div class="input-country">
        <div class="flex row center">
          Country:
          <el-input v-model="userCred.country" type="text"></el-input>
        </div>
      </div>
      <div class="input-city">
        <div class="flex row center">
          City:
          <el-input v-model="userCred.city" type="text"></el-input>
        </div>
      </div>
      <div class="missing-fields-note" :class="isActiveMissingNote">* Missing Required Fields</div>
      <div class="register-btn-wrapper flex column center space-evenly">
        <button class="register" @click="handleRegister()">Create Account</button>
        <div>
          Already have an account?
          <span class="signIn-btn" @click="moveToLogin()">Sign in</span>
        </div>
      </div>
    </div>
    <div class="aside"></div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      userCred: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        city: "",
        country: ""
      },
      isShowMissingNote: false
    };
  },
  methods: {
    async handleRegister() {
      let isUserCredFieldsEmpy = false;
      for (let userInfo in this.userCred) {
        if (!this.userCred[userInfo]) {
          isUserCredFieldsEmpy = true;
          continue;
        }
      }
      if (!isUserCredFieldsEmpy) {
        const { email, password } = await this.$store.dispatch({
          type: "doSignup",
          userCred: this.userCred
        });
        await this.$store.dispatch({
          type: "doLogin",
          userCred: { email, password }
        });

        //Reset Data
        this.isShowMissingNote = false;
        this.userCred = {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          city: "",
          country: ""
        };
      } else {
        console.log("Missing Required Fields!");
        this.isShowMissingNote = true;
      }
    },
    moveToLogin() {
      this.$router.push("/login");
    }
  },
  computed: {
    isActiveMissingNote() {
      return { show: this.isShowMissingNote };
    }
  }
};
</script>