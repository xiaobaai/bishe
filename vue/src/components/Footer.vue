<template>
  <div class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="@/assets/imgs/logo.png" alt="" class="footer-logo">
        <div class="footer-title">社区二手交易平台</div>
      </div>
      <div class="footer-contact">
        <div style="flex: 1">联系电话：010-55668899</div>
        <div style="flex: 1; text-align: right">邮箱：contact@secondhand.com</div>
      </div>
      <div class="copyright">© QING MUX · Community Secondhand Platform</div>
      <div class="record">备案：浙ICP备202533998899号-1 <span style="margin-left: 20px">浙公网安备83312321999111号</span></div>
    </div>
  </div>
</template>

<style scoped>
.site-footer {
  margin-top: 20px;
  min-height: 120px;
  color: #fff;
  background: linear-gradient(120deg, #161c31 0%, #202943 55%, #1f2e53 100%);
  box-shadow: 0 -8px 24px rgba(20, 29, 56, 0.2);
}
.footer-inner {
  width: 42%;
  margin: 0 auto;
  padding: 24px 0;
}
.footer-brand {
  margin-bottom: 14px;
  display: flex;
  grid-gap: 6px;
  justify-content: center;
  align-items: center;
}
.footer-logo {
  width: 30px;
}
.footer-title {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
}
.footer-contact {
  margin-bottom: 16px;
  display: flex;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
}
.copyright {
  margin-bottom: 10px;
  text-align: center;
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
}
.record {
  text-align: center;
  color: rgba(255, 255, 255, 0.76);
  font-size: 13px;
}
</style>
