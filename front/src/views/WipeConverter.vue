<template>
  <div class="wipe-converter">
    <h1>Wipe Converter</h1>

    <div class="text col-lg-8 offset-lg-2">
      <p>
        Use this tool to convert your wipes from a series of PNG files to the
        format expected by
        <a
          href="https://gamebanana.com/mods/53687"
          rel="noopener"
          target="_blank"
          >max480's Helping Hand</a
        >, to use them in-game.
      </p>
      <p>
        Select all your "fade in" or "fade out" frames, hit "Convert", and be
        patient!
      </p>
      <div>
        Once you got the file:
        <ul>
          <li>
            rename the file to either <code>wipe-in.bin</code> or
            <code>wipe-out.bin</code>
          </li>
          <li>
            move it to your mod, in
            <code>Mods/yourmod/MaxHelpingHandWipes/yournickname/wipename</code>
            folder
          </li>
          <li>
            in Ahorn, use
            <code>MaxHelpingHand/CustomWipe:yournickname/wipename</code> as a
            wipe
          </li>
        </ul>
      </div>
    </div>

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

    <div class="error" v-if="error">
      <div class="warning">
        An error occurred. Check that your images are valid.
      </div>
    </div>

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

        // the output bin is a binary format:
        // [frame count], for each frame { [coordinate count], [coordinate list] }
        // all numbers are encoded on 2 bytes, except [coordinate count] because it may exceed 65535.

        // first, we are going to write the frame count
        const result = [];
        result.push(selectedFiles.length);

        // then, convert them 1 by 1
        for (let i = 0; i < selectedFiles.length; i++) {
          this.fileProgress = i;

          // send file to the API to receive a triangle list
          let formData = new FormData();
          formData.append("wipe", selectedFiles[i]);
          const triangles = (
            await axios.post(`${config.backendUrl}/api/wipes`, formData)
          ).data;

          // double-flatten (triangles => points => coordinates) to end up with a coordinate list
          const coordinates = triangles.flatMap((t) => t).flatMap((p) => p);

          // add the coordinate count, then the coordinates themselves, to the array.
          result.push(coordinates.length % 65536);
          result.push(Math.floor(coordinates.length / 65536));
          coordinates.forEach((c) => result.push(c));
        }

        // download the result as a bin file!
        download(
          new Blob([new Uint16Array(result)], {
            type: "application/octet-stream",
          }),
          "wipe.bin",
          "application/octet-stream"
        );
      } catch (e) {
        console.error(e);
        this.error = true;
      }
      this.converting = false;
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

.error {
  font-size: 18pt;
  color: #ff8000;
  margin: 20px;
}

@media (prefers-color-scheme: dark) {
  input[type="file"] {
    color: #dedad6;
  }
}

.text {
  text-align: left;
  margin-bottom: 30px;
}
</style>
