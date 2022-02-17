<template>
  <div class="item">
    <div class="title">
      <div class="letter">B</div>
      <div class="letter">I</div>
      <div class="letter">N</div>
      <div class="letter">G</div>
      <div class="letter">O</div>
    </div>
    <div class="card">
      <ul>
        <li
          v-for="(item, i) of storeCard"
          v-bind:key="i"
          v-on:click="changeColor"
        >
          <Number :array="storeCard[i]" />
        </li>
      </ul>
    </div>
    <div class="button">
      <button
        class="shuffleButton"
        type="button"
        v-on:click="onCreate"
        v-if="createButton"
      >
        Shuffle
      </button>
      <button
        class="resetButton"
        type="button"
        v-on:click="onReset"
        v-if="resetButton"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Number from "../components/Number.vue";
import { useStore } from "vuex";

export default defineComponent({
  components: { Number },
  setup() {
    //最小値
    let min = ref(1);
    //最大値
    let max = ref(75);
    //最小値から最大値を格納する数値配列
    let bingo: number[] = [];
    //ランダムに24個の数値を入れた配列
    let random = ref(["0"]);
    //表示用
    let currentNum = ref(0);
    //カード作成ボタン
    let createButton = ref(true);
    // リセットボタン
    let resetButton = ref(false);
    // クリックした数字の色付け用クラス
    let isActive = ref(false);
    //ストア使用のための変数
    let store = useStore();
    //リセットボタン確認用
    let confirmReset = ref(true);
    //ストアに保存したビンゴ用配列
    let storeCard = ref(["0"]);

    /**
     * 初期、リロード時
     */
    storeCard.value = store.state.card;
    if (storeCard.value.length > 0) {
      createButton.value = false;
      resetButton.value = true;
    } else {
      createButton.value = true;
      resetButton.value = false;
    }

    //初期値に0が入っているため配列を空にする
    random.value.length = 0;

    /**
     * カードをランダムに作成する
     */
    const onCreate = () => {
      //ストアのカード用配列を初期化
      // store.state.card.length = 0;
      store.commit("resetCard");
      isActive.value = false;
      createButton.value = false;
      resetButton.value = true;
      store.commit("notselected");
      //リセット
      random.value.length = 0;
      //最小値から最大値を配列にセットする
      for (let i = min.value; i <= max.value; i++) {
        bingo.push(i);
      }
      //ランダムに24個の数字を配列に入れる
      for (let i = 1; i <= 25; i++) {
        //真ん中にFreeの文字を挿入
        if (i === 13) {
          random.value.push("Free");
          store.commit("createCard", "Free");
        } else {
          //ランダムな数字を選ぶ
          currentNum.value = bingo[Math.floor(Math.random() * bingo.length)];
          //スロット用配列から選ばれた数字を削除
          bingo = bingo.filter((item) => item !== currentNum.value);
          // 残り24個の数字を文字列としてカード表示用配列に追加
          random.value.push(currentNum.value.toString());
          //
          store.commit("createCard", currentNum.value.toString());
        }
      }
    };
    /**
     * リセットボタン押した時の処理
     */
    const onReset = () => {
      //確認メッセージ
      confirmReset.value = window.confirm("Are you sure you want to reset?");
      if (confirmReset.value === true) {
        //ストアのカード用配列を初期化
        store.commit("resetCard");
        storeCard.value.length = 0;
        resetButton.value = false;
        createButton.value = true;
        store.commit("notselected");
        //ローカルストレージをクリア
        localStorage.clear();
      } else {
        return;
      }
    };

    return {
      bingo,
      random,
      currentNum,
      onCreate,
      createButton,
      isActive,
      resetButton,
      onReset,
      confirmReset,
      storeCard,
    };
  },
});
</script>

<style lang="scss" scoped>
.item {
  .title {
    font-size: min(8vw, 50px);
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    width: 87vw;
    max-width: 550px;
    margin: 0 auto;
    .letter {
      width: 16vw;
    }
  }
  .card {
    margin: 0 auto;
    ul {
      width: 90vw;
      height: 90vw;
      max-width: 550px;
      max-height: 550px;
      margin: 0 auto;
      display: flex;
      padding: 0;
      list-style: none;
      text-align: center;
      flex-wrap: wrap;
      border: solid 2px;
      font-size: min(8vw, 50px);

      li {
        justify-content: center;
        width: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .button {
    margin: 20px;
    // margin: 0 10px 20px;
    button {
      font-size: 200%;
      margin: 0 20px;
      border-radius: 10px;
      color: white;
    }
    .shuffleButton {
      background-color: white;
      color: #cc3399;
      &:hover {
        background-color: #cc3399;
        color: white;
      }
    }
    .resetButton {
      background-color: #ceadce;
      &:hover {
        background-color: #7f667f;
      }
    }
  }
}
</style>
