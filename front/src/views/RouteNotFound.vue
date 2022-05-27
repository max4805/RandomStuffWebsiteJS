<template>
  <div>
    <h1>❌ Not Found</h1>
    <router-link to="/">⬅ Back to Home Page</router-link>
  </div>
</template>

<script>
const vue = {
  name: "route-not-found",

  // hide navbar on this 404 page
  mounted: function () {
    document.getElementById("nav").style.display = "none";
  },
  unmounted: function () {
    document.getElementById("nav").style.display = "block";
  },
};

export default vue;
</script>

<style lang="scss" scoped>
// better contrast for links in dark mode
@media (prefers-color-scheme: dark) {
  a {
    color: #47a0ff;
  }
}

h1 {
  margin-top: 12px;
  margin-bottom: 22px;
  font-family: sans-serif;
  font-size: 32px;
  font-weight: bold;
}
</style>
