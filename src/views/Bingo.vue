<template>
  <div class="bingo">
    <div class="box">
      <div class="currentNum" v-if="showNumber">{{ currentNum }}</div>
      <div class="message" v-if="showMessage">{{ message }}</div>
    </div>
    <div class="button">
      <button
        class="startButton"
        type="button"
        v-on:click="onclick"
        v-if="showButton"
      >
        {{ button }}
      </button>
      <button class="resetButton" type="button" v-on:click="reset">
        Reset
      </button>
    </div>
    <div class="random">
      <ul>
        <li v-for="item of storeRandom" v-bind:key="item">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    //最小値
    let min = ref(1);
    //最大値
    let max = ref(75);
    //表示用
    let currentNum = ref(0);
    //スタートストップボタン
    let button = ref("Start");
    //スロットタイマー初期化
    let timer = ref(0);
    //リセットボタン確認用
    let confirmReset = ref(true);
    //数字表示切替用
    let showNumber = ref(true);
    //メッセージ表示切替用
    let showMessage = ref(false);
    //スタートボタン表示非表示用
    let showButton = ref(true);
    //メッセージ
    let message = ref("");
    //ストア使用のための変数
    let store = useStore();
    //ストアの保存したビンゴ用配列
    let storeBingo = ref([0]);
    //ストアの出た数字を入れる配列
    let storeRandom = ref([0]);

    /**
     * 初期、リロード時
     */
    if (store.state.bingoButton === "Complete") {
      showNumber.value = false;
      showMessage.value = true;
      message.value = "Complete";
      showButton.value = false;
    } else if (store.state.random.length === max.value) {
      button.value = "Complete";
      showNumber.value = true;
      showMessage.value = false;
      showButton.value = true;
      button.value = "Complete";
      currentNum.value = store.state.random[store.state.random.length - 1];
    } else if (store.state.random.length > 0) {
      currentNum.value = store.state.random[store.state.random.length - 1];
    } else {
      showNumber.value = false;
      showMessage.value = true;
      message.value = "Start";
    }

    //ストアの配列を入れる
    storeBingo.value = store.state.bingo;
    storeRandom.value = store.state.random;

    /**
     * スロット回す用
     */
    const slot = () => {
      //  スロット開始
      timer.value = setInterval(() => {
        //ランダムの数字を選ぶ
        currentNum.value =
          storeBingo.value[Math.floor(Math.random() * storeBingo.value.length)];
      }, 25);
    };

    /**
     * ランダムに選ばれた数値を表示し配列に入れる
     */
    const onclick = () => {
      //
      if (store.state.bingo.length === 0 && store.state.random.length === 0) {
        for (let i = min.value; i <= max.value; i++) {
          store.commit("insert", i);
        }
        showNumber.value = true;
        showMessage.value = false;
        slot();
        button.value = "Stop";
      } else if (button.value === "Complete") {
        //終了時メッセージを表示
        showNumber.value = false;
        showMessage.value = true;
        showButton.value = false;
        message.value = "Complete";
        store.commit("onmessage", "Complete");
      } else if (store.state.bingo.length === 0) {
        return;
      } else if (button.value === "Start") {
        showNumber.value = true;
        showMessage.value = false;
        //スロット開始
        slot();
        //ボタンの表示を変更
        button.value = "Stop";
      } else if (button.value === "Stop" && store.state.bingo.length === 1) {
        //スロットを止める
        clearInterval(timer.value);
        //選ばれた数字を配列に入れる
        store.commit("random", currentNum.value);
        store.commit("slice", currentNum.value);
        storeBingo.value = store.state.bingo;
        storeRandom.value = store.state.random;
        //ボタンの表示を変更
        button.value = "Complete";
      } else {
        //スロットを止める
        clearInterval(timer.value);
        //選ばれた数字を配列に入れる
        store.commit("random", currentNum.value);
        store.commit("slice", currentNum.value);
        storeBingo.value = store.state.bingo;
        storeRandom.value = store.state.random;
        //ボタンの表示を変更
        button.value = "Start";
        // store.commit("startButton");
      }
    };

    /**
     * リセットする
     */
    const reset = () => {
      //リセット確認用メッセージ
      confirmReset.value = window.confirm("リセットしてもよろしいですか？");
      if (confirmReset.value === true) {
        //タイマーを止める
        clearInterval(timer.value);
        //表示の変更
        showButton.value = true;
        button.value = "Start";
        showNumber.value = false;
        showMessage.value = true;
        message.value = "Start";
        //初期化
        store.commit("resetSlot");
        storeBingo.value.length = 0;
        storeRandom.value.length = 0;
        store.commit("onmessage", "Start");
        //ローカルストレージをクリア
        localStorage.clear();
      } else {
        return;
      }
    };

    return {
      currentNum,
      button,
      showNumber,
      showMessage,
      showButton,
      message,
      storeBingo,
      storeRandom,
      onclick,
      reset,
      slot,
    };
  },
});
</script>
<style scoped lang="scss">
.bingo {
  margin: 0 auto;
  .box {
    width: 70vw;
    height: 13vw;
    min-height: 120px;
    border: solid 2px;
    margin: 20px auto;
    font-size: max(90px, 12vw);
    display: flex;
    justify-content: center;
    align-items: center;
    .message {
      font-size: max(50px, 12vw);
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .currentNum {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .random {
    li {
      list-style: none;
    }
  }
  .button {
    margin: 0 10px 20px;
    button {
      font-size: 200%;
      margin: 0 20px;
      border-radius: 10px;
      color: white;
    }
    .startButton {
      background-color: white;
      color: #cc3399;
      &:hover {
        background-color: #cc3399;
        color: white;
      }
    }
    .resetButton {
      // background-color: #999999;
      background-color: #ceadce;
      &:hover {
        // background-color: #555555;
        background-color: #7f667f;
      }
    }
  }
  .random {
    ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0;
      margin: 0 auto;
      width: 95%;
      justify-content: flex-start;

      li {
        background-color: #bb1e5e;
        color: white;
        width: 13vw;
        height: 13vw;
        max-width: 80px;
        max-height: 80px;
        margin: 4px;
        border-radius: 10px;
        font-size: min(8vw, 50px);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
