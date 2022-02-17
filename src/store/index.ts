import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: () => {
    return {
      // スロットに最小値から最大値の数字を入れる用配列
      bingo: [] as unknown[],
      // スロットにランダムに選ばれた数字を入れる用配列
      random: [] as unknown[],
      // スロットのボタン記憶用
      bingoButton: "",
      // カードに入れる数字用配列
      card: [] as unknown[],
      // カードでクリックされた数字を入れる用配列
      onoffnumber: [] as unknown[],
    };
  },
  mutations: {
    // 最小値から最大値の数字を入れる
    insert: (state, obj) => {
      state.bingo.push(obj);
    },
    // スロットにランダムに選ばれた数字を入れる
    random: (state, obj) => {
      state.random.push(obj);
    },
    // 重複しないようにランダムに選ばれた数字を削除
    slice: (state, obj) => {
      state.bingo = state.bingo.filter((item) => item !== obj);
    },
    // ボタンメッセージ管理用
    onmessage: (state, obj) => {
      state.bingoButton = obj;
    },
    // カードにランダムに数字を入れる
    createCard: (state, obj) => {
      state.card.push(obj);
    },
    // カードでクリックされた数字を入れる
    selected: (state, obj) => {
      state.onoffnumber.push(obj);
    },
    // カードでもう一回クリックされた数字を入れる（色を消す）
    notselected: (state, obj) => {
      state.onoffnumber = state.onoffnumber.filter((item) => item !== obj);
    },
    // リセットスロット
    resetSlot: (state) => {
      state.bingo.length = 0;
      state.random.length = 0;
    },
    // リセットカード
    resetCard: (state) => {
      state.card.length = 0;
      state.onoffnumber.length = 0;
    },
  },
  //リロードしても消えない用
  plugins: [createPersistedState()],

  actions: {},
  modules: {},
});
