<template>
  <div class="user-settings-container base-padding flex column center align-start">
    <h1>User Settings</h1>
    <p>Choose Your Color Pallete, Customize MuzeBox based on your prefrences</p>
    <div class="user-settings-form flex column">
      <div class="flex row center justify-start">
        <span class="span" for="bg-main">Background - Primary:</span>
        <el-color-picker id="bg-main" type="color" v-model="pallete['bg-main']" show-alpha></el-color-picker>
      </div>
      <div class="flex row center justify-start">
        <span class="span" for="bg-second">Background - Second:</span>
        <el-color-picker id="bg-second" type="color" v-model="pallete['bg-second']" show-alpha></el-color-picker>
      </div>
      <div class="flex row center justify-start">
        <span class="span" for="main">Text Color - Primary:</span>
        <el-color-picker id="main" type="color" v-model="pallete['main']" show-alpha></el-color-picker>
      </div>
      <div class="flex row center justify-start">
        <span class="span" for="second">Text Color - Second:</span>
        <el-color-picker id="second" type="color" v-model="pallete['second']" show-alpha></el-color-picker>
      </div>
      <div class="flex row center justify-start">
        <span class="span" for="confirm">Button And Tags Color:</span>
        <el-color-picker name="confirm" type="color" v-model="pallete['confirm']" show-alpha></el-color-picker>
      </div>
      <div class="user-settings-btn-box flex row center justify-start">
        <div class="set-pref btn" @click="setPref()">Customize</div>
        <div class="reset-pref btn" @click="resetPref()">Reset prefrences</div>
      </div>
      {{this.pallete}}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pallete: {
        "bg-main": "rgba(9, 9, 9, 1)",
        "bg-second": "rgba(25, 25, 25, 1)",
        main: "rgba(222, 222, 222, 1)",
        second: "rgba(214, 180, 255,1)",
        confirm: "rgba(25,144,241,1)"
      }
    };
  },
  methods: {
    resetPref() {
      const defaultPallete = {
        "bg-main": "rgba(9, 9, 9, 1)",
        "bg-second": "rgba(25, 25, 25, 1)",
        main: "rgba(222, 222, 222, 1)",
        second: "rgba(214, 180, 255,1)",
        confirm: "rgba(25,144,241,1)"
      };
      this.pallete = Object.assign({}, defaultPallete);
    },
    setPref() {
      this.changeColorPallete();
    },
    changeColorPallete() {
    //   var startElem = document.querySelector("body");
    //   var items = startElem.getElementsByTagName("*");
    //       console.log( document.getElementsByTagName("body")[0].style)
    //   if (startElem.style.backgroundColor === "rgba(9, 9, 9, 1)"){
    //         startElem.style.backgroundColor = this.pallete["bg-main"];
        
    //   }

    //   items.forEach(item => {
    //     if (item.style.backgroundColor === "rgba(9, 9, 9, 1)")
    //       item.style.backgroundColor = this.pallete["bg-main"];
    //   });

    //   //   for (let color in this.pallete) {
      //     console.log(`clr-${color}`, `${this.pallete[color]}`);
      //     document.documentElement.style.setProperty(
      //       `clr-${color}`,
      //       `${this.pallete[color]}`
      //     );
      //   }
    }
  }
};
</script>