<template>
  <div class="flex row center">
    <div class="filter-wrapper flex row center">
        <el-input
          class="input"
          @change="setFilterBy()"
          v-model="filterBy.txt"
          placeholder="Search Room"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      <el-select @change="setFilterBy()" v-model="filterBy.options" placeholder="Select">
        <el-option
          v-for="option in options"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import UtilService from '../services/utilService';
export default {
  data() {
    return {
      options: [
        {
          value: "all",
          label: "ALL"
        },
        {
          value: "name",
          label: "By Room Name"
        },
        {
          value: "desc",
          label: "By Room Description"
        },
        {
          value: "tags",
          label: "By Room Tags"
        }
      ],
      filterBy: {
        txt: "",
        options: "all"
      }
    };
  },
  created(){
    if(sessionStorage.filterBy) this.filterBy = UtilService.loadFromSession('filterBy');
    console.log(this.filterBy)
  },
  methods: {
    setFilterBy() {
      this.$store.dispatch({ type: "setFilterBy", filterBy: this.filterBy });
      UtilService.saveToSession('filterBy', this.filterBy)
    }
  }
};
</script>