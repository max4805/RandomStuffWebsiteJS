<template>
  <div>
    <h1>Banana Mirror Browser</h1>

    <div class="loading" v-if="loading">Loading...</div>
    <div class="error" v-else-if="error">
      <div class="warning">An error occurred.</div>
      <button class="btn btn-warning" v-on:click="reloadPage">Retry</button>
    </div>
    <div v-else>
      <form v-on:submit="searchStuff">
        <input
          v-model="query"
          class="search form-control"
          placeholder="Search a mod..."
        />
      </form>
      <div class="row">
        <div
          v-bind:key="mod.id"
          v-for="mod in mods"
          class="col-xl-4 col-md-6 col-sm-12"
        >
          <ModListItem :mod="mod" />
        </div>
      </div>
      <div class="paginator">
        <button
          class="btn btn-outline-secondary"
          :disabled="page <= 1"
          v-on:click="firstPage"
        >
          &lt;&lt;
        </button>
        <button
          class="btn btn-outline-secondary"
          :disabled="page <= 1"
          v-on:click="previousPage"
        >
          &lt;
        </button>
        {{ page }} / {{ pageCount }}
        <button
          class="btn btn-outline-secondary"
          :disabled="page >= pageCount"
          v-on:click="nextPage"
        >
          &gt;
        </button>
        <button
          class="btn btn-outline-secondary"
          :disabled="page >= pageCount"
          v-on:click="lastPage"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../config";
import ModListItem from "../components/ModListItem.vue";

const vue = {
  components: { ModListItem },
  name: "banana-mirror-browser",
  data: () => ({
    page: 1,
    totalCount: 0,
    query: "",
    mods: [],
    loading: true,
    error: false,
  }),
  methods: {
    firstPage: function () {
      this.page = 1;
      this.reloadPage();
    },
    previousPage: function () {
      this.page--;
      this.reloadPage();
    },
    nextPage: function () {
      this.page++;
      this.reloadPage();
    },
    lastPage: function () {
      this.page = this.pageCount;
      this.reloadPage();
    },
    searchStuff: function () {
      this.page = 1;
      this.reloadPage();
    },
    reloadPage: async function () {
      try {
        this.loading = true;
        this.error = false;
        const result = await axios.get(
          `${config.backendUrl}/api/mods?page=${this.page}` +
            (this.query === "" ? "" : `&q=${encodeURIComponent(this.query)}`)
        );
        this.loading = false;
        this.totalCount = result.headers["x-total-count"];
        this.mods = result.data;
      } catch (e) {
        console.error(e);
        this.error = true;
        this.loading = false;
      }
    },
  },
  computed: {
    pageCount: function () {
      return Math.max(1, Math.floor((this.totalCount - 1) / 20 + 1));
    },
  },
  mounted: function () {
    this.reloadPage();
  },
};

export default vue;
</script>

<style scoped lang="scss">
.loading,
.error {
  margin-top: 30px;
  font-size: 16pt;
}
.error {
  color: #ff8000;
}

.paginator {
  font-size: 14pt;

  .btn {
    margin: 5px 2px;
  }

  margin-bottom: 30px;
}

.search {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
