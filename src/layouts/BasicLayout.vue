<template>
  <div id="basicLayout">
    <a-layout>
      <a-layout-header class="header">
        <global-header />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a
          href="https://github.com/xuanyue18"
          target="_blank"
          rel="noopener noreferrer"
        >
          Xcode Online Judge by xuanyue18
        </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style>
#basicLayout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

#basicLayout .header {
  box-shadow: #eee 0px 2px 5px;
  margin-bottom: 16px;
  position: sticky;
  top: 0;
  z-index: 1;
}

#basicLayout .content {
  width: 95%;
  height: 90%;
  padding: 15px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
}

#basicLayout .footer {
  padding: 12px;
  text-align: center;
  //position: sticky;
  //bottom: 0;
}
#basicLayout .footer a {
  color: #035afd;
  text-decoration: none;
  transition: color 0.3s;
}

#basicLayout .footer a:hover {
  color: #003fd0;
}
</style>
<script>
import GlobalHeader from "@/components/GlobalHeader";

export default {
  components: { GlobalHeader },
};
</script>
