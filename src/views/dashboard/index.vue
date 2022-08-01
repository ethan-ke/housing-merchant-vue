<template>
  <div class="dashboard-container">
    <div class="dashboard-text">{{ noon_tip }}: {{ this.$store.state.user.user.nickname }}</div>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      noon_tip: ''
    }
  },
  created() {
    const date = new Date()
    if (date.getHours() >= 0 && date.getHours() < 12) {
      this.noon_tip = '上午好'
    } else if (date.getHours() >= 12 && date.getHours() < 18) {
      this.noon_tip = '下午好'
    } else {
      this.noon_tip = '晚上好'
    }
  },
  methods: {
    noonTips: () => {

    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
