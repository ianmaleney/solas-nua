<script>
  import { blob1, blob2 } from "../store.js";

  let blobColours = {
    bc1: "",
    bc2: "",
  };

  blob1.subscribe((v) => (blobColours.bc1 = v));
  blob2.subscribe((v) => (blobColours.bc2 = v));
</script>

<div class="blobs">
  <div class="blob" id="b1" style="background-color: {blobColours.bc1};" />
  <div class="blob" id="b2" style="background-color: {blobColours.bc2};" />
</div>

<style>
  .blob {
    position: fixed;
    width: 25vw;
    height: 25vw;
    border-radius: 50%;
    z-index: 2;
    filter: blur(80px);
    will-change: transform;
    transition: all 3s linear;
    opacity: 0.8;
  }
  #b1 {
    top: calc(100vh - 25vw);
    left: 35vw;
  }
  #b2 {
    top: calc(100vh - 35vw);
    left: 75vw;
  }
</style>
