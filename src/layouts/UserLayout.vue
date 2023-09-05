<template>
  <div id="userLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <img src="../assets/xoj-logo.png" class="logo" />
          <div>XUANYUE OJ</div>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://github.com/xuanyue18"
          >Xcode Online Judge by xuanyue18</a
        >
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style>
#userLayout {
  text-align: center;
  background: url("http://static.simpledesktops.com/uploads/desktops/2017/02/28/GeoShapes_2880x1800.png")
    0 0 / 100% 100%;
}

#userLayout .logo {
  width: 84px;
  height: 84px;
}

#userLayout .header {
}

#userLayout .content {
  margin-bottom: 16px;
  padding: 20px;
}

#userLayout .footer {
  background: #42b983;
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script></script>
