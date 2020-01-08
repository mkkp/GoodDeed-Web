<template>
  <div class="deed-list">
    <div class="search">
      <input class="search-input" placeholder="Keresés" />
    </div>
    <div class="scroll">
      <div v-for="deed in deeds" :key="deed.id" class="item">
        <span class="description">{{ deed.description }}</span>
        <span class="nickname">{{ deed.createdBy.nickname }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Deed from '@/models/Deed';

@Component({ name: 'DeedList' })
export default class DeedList extends Vue {
  @Prop()
  deeds?: Array<Deed>;
}
</script>

<style lang="scss" scoped>
.deed-list {
  .search {
    width: 100%;
    height: 30px;

    .search-input {
      display: block;
      width: 100%;
      height: 20px;
      margin: 15px auto;
      padding: 10px 15px;
      font-size: 15px;
      outline: none;
      border: none;
      border-radius: 2px;
      box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px 0px;
      color: gray;
      font-style: italic;
    }

    .search-input:focus {
      color: black;
      font-style: normal;
    }

    .search-input-placeholder {
      color: gray;
      font-style: italic;
    }
  }

  .scroll {
    overflow-x: hidden;
    overflow-y: scroll;

    .item {
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #d6d6d6;
      cursor: pointer;

      .description, .nickname {
        margin: 5px 10px;
      }
    }

    .item:hover {
      background-color: #f1f1f1;
    }
  }
}
</style>
