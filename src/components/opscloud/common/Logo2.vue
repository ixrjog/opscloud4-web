<template>
  <div class="box">
    <h2>OPSCLOUD</h2>
  </div>
</template>

<script>
export default {
  name: 'Logo2'
}
</script>

<style scoped lang="less">
.box {
  position: relative;
  width: 400px;
  height: 100px;
  background: #FFFFFF;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-bottom: 20px;

  h2 {
    color: #121621;
    font-size: 4em;
    text-shadow: 2px 2px #EAEAED;
    z-index: 1;
  }

  &::before {
    content: "";
    position: absolute;
    width: 440px;
    height: 50%;
    background: linear-gradient(#00ccff, #d500f9);
    animation: rotate 4s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  &::after {
    content: "";
    position: absolute;
    background: #FFFFFF;
    inset: 5px;
    border-radius: 20px;
  }
}

</style>
