<template>
  <div
    v-on:click="onSelect"
    class="number"
    v-bind:class="{ numberColor: isActive }"
  >
    {{ array }}
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Number",
  props: ["array"],

  setup(props) {
    //数字の背景色のCSS変更用
    let isActive = ref(false);
    //ストア使用のための変数
    let store = useStore();

    /**
     * 初期、リロード時
     */
    if (store.state.onoffnumber.includes(props.array)) {
      isActive.value = true;
    } else {
      isActive.value = false;
    }

    /**
     * 数字をクリックすると背景色が変化させる
     */
    const onSelect = () => {
      if (isActive.value === false) {
        store.commit("selected", props.array);
        // isActive.value = store.state.numbercolor;
        isActive.value = true;
      } else {
        store.commit("notselected", props.array);
        // isActive.value = store.state.numbercolor;
        isActive.value = false;
      }
    };

    return {
      isActive,
      onSelect,
    };
  },
});
</script>
<style lang="scss">
.number {
  width: 90%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px;
  border-radius: 35% 35% 0 0;
  &:hover {
    background-color: #ffddff;
  }
}
.numberColor {
  background-color: #bb1e5e;
  color: white;
}
</style>
