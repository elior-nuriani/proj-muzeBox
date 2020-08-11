<template>
  <section class="homepage flex column">
    <div
      data-aos="fade"
      data-aos-duration="1500"
      data-aos-easing="linear"
      data-aos-once="true"
      data-aos-anchor-placement="bottom-bottom"
      class="hero"
    >
      <div class="hero-content flex column center align-start">
        <h1>Music Made Social.</h1>
        <p>100% Free Music</p>
        <p>Be Part of the community</p>
        <p>Listen together with friends</p>
        <div class="main-btn flex row center space-between">
          <span @click="moveToRooms()">Join Rooms</span>
          <span>
            <font-awesome-icon icon="long-arrow-alt-right"></font-awesome-icon>
          </span>
        </div>
      </div>
    </div>
    <div class="homepage-main">
      <!-- Top Rated -->
      <div class="top-rated-container flex column container">
        <div class="top-rated-content">
          <h2 class="title">Popular on Playlist</h2>
          <p>Check out what's trending on Playlist</p>
        </div>
        <div class="gallery-container">
          <TopRated class="container" v-if="topRatedRooms.length" :topRatedRooms="topRatedRooms"></TopRated>
          <div v-else class="spinner-wrapper flex row center">
            <Spinner />
          </div>
        </div>
      </div>
      <!-- Popular Users -->
      <div class="trend-users-container flex column container">
        <div class="trend-users-content">
          <h2 class="title">Meet Our Trending Memebers</h2>
          <p>Discover top rated memebers on Playlist</p>
        </div>
        <div v-if="topRatedUsers.length" class="trend-user-list flex column center">
          <TrendUserPreview
            v-for="(user, idx) in topRatedUsers"
            :key="user._id"
            :user="user"
            :idx="idx"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out"
            data-aos-mirror="true"
            data-aos-once="true"
            data-aos-anchor-placement="bottom-bottom"
          />
          <div class="flex row center">
            <div
              v-if="isShowLess"
              class="show-less-btn btn flex row center"
              @click="handleShowLessClicked()"
            >
              <font-awesome-icon icon="long-arrow-alt-left"></font-awesome-icon>
              <span>Show Less</span>
            </div>
            <div
              v-if="isShowMore"
              class="show-more-btn btn flex row center"
              @click="handleShowMoreClicked()"
            >
              <span>Show More</span>
              <font-awesome-icon icon="long-arrow-alt-right"></font-awesome-icon>
            </div>
          </div>
        </div>
        <Spinner v-else />

        <!-- Slider Using Vue-Awesome-swiper -->
        <!-- <div class="flex row center wrap">
          <swiper ref="mySwiper" class="swiper" :options="swiperOption">
            <swiper-slide v-for="user in topRatedUsers" class="user-profile-card" :key="user._id">
              <UserSliderCard :user="user"></UserSliderCard>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
            <div @click="handleClick('prev')" class="swiper-button-prev" slot="button-prev"></div>
            <div @click="handleClick('next')" class="swiper-button-next" slot="button-next"></div>
          </swiper>
        </div>-->

        <!-- Slider Using Carousel-Vue -->
        <!-- <carousel :perPage="3" :loop="true" :scrollPerPage="false">
          <slide v-for="user in topRatedUsers" class="user-profile-card-second" :key="user._id">
            <UserSliderCard :user="user"></UserSliderCard>
          </slide>
        </carousel>-->
      </div>
      <!-- Rooms List -->
      <div ref="roomsContainer" class="rooms-list-container flex column">
        <div class="rooms-list-content">
          <h2 class="title">Join Our Music Rooms</h2>
          <p>Listen to Music , Connect People , Be part of our community</p>
        </div>
        <RoomFilter />
        <RoomsList
          class="roomsList"
          v-if="roomsToShowInfinteScroll.length"
          :rooms="roomsToShowInfinteScroll"
        />
        <Spinner v-else />
        <div class="infiniteScrollTrigger"></div>
        <Spinner v-if="isShowInfiniteSpinner" class="infinte-scroll-spinner" />
        <div class="no-room-msg">No More Rooms To Discover ... Create Your Own Playlist</div>
      </div>
    </div>
    <div @click="toggleOpenRoom()" class="create-room-btn btn float flex row center">
      <font-awesome-icon icon="plus"></font-awesome-icon>
    </div>

    <div @click="toggleOpenRoom()" class="screen" :class="createRoomOpen">
      <CreateRoom class="create-room-resp" :class="createRoomOpen" />
    </div>
    <CreateRoom class="create-room-mobile" :class="createRoomOpen" />
  </section>
</template>

<script>
import RoomsList from "../components/RoomsList";
import TopRated from "../components/TopRated";
import CreateRoom from "../components/CreateRoom";
import RoomFilter from "../components/RoomFilter";
import TrendUserPreview from "../components/TrendUserPreview";
import Spinner from "../components/Spinner";
// import UserSliderCard from "../components/UserSliderCard";

//*********** Sliders Import *************
//*********** Cancel Swiper Comments **************/

// import { Swiper, SwiperSlide } from "vue-awesome-swiper";
// import { Carousel, Slide } from "vue-carousel";

// If you use Swiper 6.0.0 or higher
// import "swiper/swiper-bundle.css";

export default {
  mounted() {
    // this.swiper.slideTo(3, 1000, false);
    this.handleInfiniteScroll();
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 30,
        slidesPerGroup: 1,
        pagination: {
          clickable: true,
          el: ".swiper-pagination"
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        loop: true,
        loopFillGroupWithBlank: true,
        breakpoints: {
          750: {
            slidesPerView: 3
          },
          540: {
            slidesPerView: 2
          },
          300: {
            slidesPerView: 1
          }
        }
      },
      isCreatRoomOpen: false,
      usersCount: 6,
      maxRoomsPerPage: 9,
      currentPage: 1,
      isShowInfiniteSpinner: false
    };
  },
  methods: {
    compareFunc() {
      return (a, b) => {
        if (a.rating < b.rating) return 1;
        if (a.rating > b.rating) return -1;
        if (a.rating === b.rating) return 0;
      };
    },
    toggleOpenRoom() {
      this.isCreatRoomOpen = !this.isCreatRoomOpen;
    },
    moveToRooms() {
      const elRoomsTitle = this.$refs.roomsContainer;
      elRoomsTitle.scrollIntoView();
    },
    handleShowMoreClicked() {
      this.usersCount = this.usersCount + 3;
    },
    handleShowLessClicked() {
      this.usersCount = this.usersCount - 3;
    },
    handleInfiniteScroll() {
      var observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (
            entry.intersectionRatio > 0 &&
            this.currentPage < this.pageCount
          ) {
            this.isShowInfiniteSpinner = true;
            setTimeout(() => {
              this.currentPage += 1;
              this.isShowInfiniteSpinner = false;
            }, 2000);
          }
          var elMsg = document.querySelector(".no-room-msg");
          if (
            entry.intersectionRatio > 0 &&
            this.currentPage >= this.pageCount &&
            !elMsg.classList.contains("show")
          )
            elMsg.classList.add("show");
        });
      });
      observer.observe(document.querySelector(".infiniteScrollTrigger"));
    }
  },
  computed: {
    roomsToShow() {
      var rooms = this.$store.getters.rooms;
      var regex = new RegExp(`${this.filterBy.txt}`, "i");
      var filterdRooms;

      if (this.filterBy.options === "all") {
        filterdRooms = rooms.filter(room => {
          return (
            regex.test(room.name) ||
            regex.test(room.desc) ||
            regex.test(room.tags.join(" "))
          );
        });
      } else {
        //Filter The Rooms By The NAME / DESCRIPTION / TAGS
        var option = this.filterBy.options;
        //An Array And Not String
        filterdRooms =
          option === "tags"
            ? rooms.filter(room => {
                return regex.test(room[option].join(" "));
              })
            : rooms.filter(room => {
                return regex.test(room[option]);
              });
      }
      return filterdRooms;
    },
    topRatedRooms() {
      var rooms = this.roomsToShow;
      return rooms.sort(this.compareFunc()).slice(0, 4);
    },
    usersToShow() {
      return this.$store.getters.users;
    },
    topRatedUsers() {
      var users = this.usersToShow;
      return users.sort(this.compareFunc()).slice(0, this.usersCount);
    },
    createRoomOpen() {
      return { open: this.isCreatRoomOpen };
    },
    filterBy() {
      return this.$store.getters.filterBy;
    },
    isShowLess() {
      return this.usersCount > 6;
    },
    isShowMore() {
      return this.usersCount < 12;
    },
    //How Much Rooms To show....
    pageOffset() {
      return this.maxRoomsPerPage * this.currentPage;
    },
    pageCount() {
      return Math.ceil(this.roomsToShow.length / this.maxRoomsPerPage);
    },
    roomsToShowInfinteScroll() {
      return this.roomsToShow.slice(0, this.pageOffset);
    }

    //  swiper() {
    //   return this.$refs.mySwiper.$swiper;
    // }
  },
  components: {
    RoomFilter,
    RoomsList,
    TopRated,
    CreateRoom,
    TrendUserPreview,
    Spinner
    // UserSliderCard,
    // Swiper,
    // SwiperSlide,
    // Carousel,
    // Slide
  }
};
</script>
