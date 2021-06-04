<template>
  <div class="wipe-converter">
    <h1>Wipe Converter</h1>

    <p>
      Use this tool to convert your wipes from a series of PNG files to the
      format expected by
      <a href="https://gamebanana.com/mods/53687" rel="noopener" target="_blank"
        >max480's Helping Hand</a
      >, to use them in-game.
    </p>
    <p>
      Select all your "fade in" or "fade out" frames, hit "Convert", and be
      patient!
    </p>

    <label class="btn btn-default">
      <input
        type="file"
        accept="image/png"
        multiple
        @change="selectFile"
        :disabled="converting"
      />
    </label>

    <button
      class="btn btn-success"
      :disabled="!selectedFiles || converting"
      @click="convert"
    >
      Convert!
    </button>

    <div class="converting" v-if="converting">Converting...</div>
    <div class="progress" v-if="converting">
      <div
        class="progress-bar progress-bar-info"
        role="progressbar"
        :aria-valuenow="fileProgress"
        aria-valuemin="0"
        :aria-valuemax="selectedFiles.length"
        :style="{ width: (fileProgress / selectedFiles.length) * 100 + '%' }"
      >
        {{ fileProgress }} / {{ selectedFiles.length }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import download from "downloadjs";
import config from "../config";

const vue = {
  name: "wipe-converter",
  data: () => ({
    selectedFiles: undefined,
    converting: false,
    error: false,
    fileProgress: 0,
  }),
  methods: {
    selectFile: function () {
      this.progressInfos = [];
      this.selectedFiles = event.target.files;
    },
    convert: async function () {
      try {
        this.converting = true;
        this.error = false;

        // sort files by name
        const selectedFiles = Array.from(this.selectedFiles).sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        // convert them 1 by 1
        const result = [];
        for (let i = 0; i < selectedFiles.length; i++) {
          this.fileProgress = i;

          let formData = new FormData();
          formData.append("wipe", selectedFiles[i]);
          result.push(
            (await axios.post(`${config.backendUrl}/api/wipes`, formData)).data
          );
        }

        // download the result!
        download(JSON.stringify(result), "wipe.json", "application/json");
      } catch (e) {
        console.error(e);
        this.error = true;
      }
      this.converting = false;
    },
  },
  computed: {
    pageCount: function () {
      return Math.max(1, Math.floor((this.totalCount - 1) / 20 + 1));
    },
  },
};

export default vue;
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 30px;
}

.converting {
  font-size: 18pt;
  margin: 20px;
}
</style>
