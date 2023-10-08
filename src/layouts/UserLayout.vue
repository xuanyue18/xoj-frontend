<template>
  <div id="userLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header">
        <a-space :size="mini">
          <a-link @click="$router.push('/')" :hoverable="false">
            <img src="../assets/xoj-logo.png" class="logo" />
          </a-link>
          <a-link @click="$router.push('/')" :hoverable="false">
            <div class="title">XUANYUE OJ</div>
          </a-link>
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
  background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png")
    0 0 / 100% 100%;
  //background-image: linear-gradient(25deg, #92abe1, #7fc4e5, #61dce8, #1af4eb);
}

#userLayout .logo {
  width: 90px;
  height: 90px;
}

#userLayout .title {
  font-family: "Helvetica Neue", sans-serif;
  font-size: 32px;
  color: #333;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

#userLayout .header {
}

#userLayout .content {
  margin-bottom: 16px;
  padding: 20px;
}

#userLayout .footer {
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

#userLayout .footer a {
  color: #2762a6;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

#userLayout .footer a:hover {
  color: #007bff;
}
</style>
<script></script>
