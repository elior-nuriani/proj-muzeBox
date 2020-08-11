<template>
  <div>
    <div class="output">
      <div class="chat-note">
        * Only Sign In Memebers Can Chat , Everyone Can Use The
        <span>ICONS</span> Button!
      </div>
      <div class="chat-msg" v-for="(msg,idx) in msgs" :key="idx">
        <div v-if="checkLastMsgs(idx)" class="chat-msg-details flex row center justify-start">
          <div class="profile-img msg-img" :style="`background-image: url(${msg.from.imgUrl});`"></div>
          <div v-if="isUserSendMsg(idx)" class="msg-name">{{msg.from.firstName}}</div>
          <div v-else class="msg-name">You</div>
        </div>
        <div class="msg-wrapper flex row center justify-start">
          <div class="msg-txt">{{msg.txt}}</div>
        </div>
      </div>
    </div>
    <div class="chat-form flex row">
      <button @click="sendMsg()">Share</button>
      <input
        v-on:keyup.enter="sendMsg()"
        class="input"
        v-model="msg.txt"
        type="text"
        placeholder="What you think?"
      />
      <span @click="toggleIsIconsBoxOpen()" class="btn icons-btn flex row center justify-end">
        <i class="fas icons fa-icons"></i>
      </span>
      <div class="icons-container flex row center justify-end" :class="openIconsBox">
        <div class="icons-box flex row center">
          <div
            class="icon-image btn"
            v-for="(icon, idx) in iconsList"
            :key="idx"
            @click="handleIconClicked(icon)"
          >{{icon}}</div>
        </div>
        <span @click="toggleIsIconsBoxOpen()" class="btn icons-btn icons-btn-back flex row center">
          <i class="fas icons fa-arrow-right"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import SocketService from "../services/socketService";
import UtilService from "../services/utilService";

export default {
  props: ["room"],
  async created() {
    SocketService.on("chat addMsg", this.addMsg);
    SocketService.on("create element", this.createElement);
  },
  updated() {
    var chatHistory = document.querySelector(".output");
    chatHistory.scrollTop = chatHistory.scrollHeight - chatHistory.clientHeight;
  },
  destroyed() {
    SocketService.off("chat addMsg", this.addMsg);
  },
  data() {
    return {
      msgs: [],
      msg: {
        from: "",
        txt: ""
      },
      iconsList: [
        "🤗",
        "😍",
        "🧡",
        "💪",
        "😁",
        "😵",
        "🤪",
        "✌️",
        "🤩",
        "🔥",
        "✨"
      ],
      isIconsBoxOpen: false
    };
  },
  methods: {
    addMsg(msg) {
      const users = this.$store.getters.users;
      const user = users.find(currUser => {
        return currUser._id === msg.from;
      });
      const msgCopy = Object.assign({}, msg);
      msgCopy.from = user;
      this.msgs.push(msgCopy);
    },

    sendMsg() {
      if (this.loggedInUser) {
        if (this.msg.txt) {
          this.msg.from = this.loggedInUser._id;
          SocketService.emit("chat newMsg", this.msg);
          this.msg = { from: "", txt: "" };
        }
      } else {
        this.$emit(
          "showMessage",
          "Only Logged In Memebers can comment,YOU CAN use the ICONS button "
        );
      }
    },

    handleIconClicked(icon) {
      SocketService.emit("init element", icon);
    },
    async createElement(icon) {
      const elContainer = document.querySelector(".output");
      const el = document.createElement("DIV");
      const num = await UtilService.getRndNum(3, 1);
      el.className = `float-icon-wrapper flex row center floating-sample-${"" +
        num}`;
      el.innerText = icon;
      el.dataset.id = UtilService.makeId();

      el.addEventListener("animationend", () => {
        const child = document.querySelector(`div[data-id='${el.dataset.id}']`);
        elContainer.removeChild(child);
      });
      
      elContainer.appendChild(el);
    },
    toggleIsIconsBoxOpen() {
      this.isIconsBoxOpen = !this.isIconsBoxOpen;
    },
    isUserSendMsg(idx) {
      return (this.loggedInUser)? this.msgs[idx].from._id !== this.loggedInUser._id: true;
    },
    checkLastMsgs(idx) {
      if (this.msgs.length < 2) return true;
      if (idx > 0) {
        if (this.msgs[idx].from._id === this.msgs[idx - 1].from._id)
          return false;
      }
      return true;
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
    openIconsBox() {
      return { open: this.isIconsBoxOpen };
    }
  }
};
</script>