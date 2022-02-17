<template>
  <header>
    <div><h1>Bingo</h1></div>
    <ul>
      <router-link to="/" active-class="link--active"
        ><li>Bingo Machine</li></router-link
      >
      <router-link to="/card" active-class="link--active"
        ><li class="card">Card</li></router-link
      >
    </ul>
  </header>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

header {
  width: 100%;
  color: white;
  h1 {
    background-color: #cc3399;
    height: 50px;
    margin: 0;
  }
  ul {
    margin: 0;

    height: 25px;
    padding: 0;
    list-style: none;
    display: flex;
    a {
      width: 50%;
      color: #cc3399;
      font-weight: 900;
      text-decoration: none;
    }
    .link--active {
      background-color: #cc3399;
      color: white;
    }
  }
}
body {
  margin: 0;
}
</style>
