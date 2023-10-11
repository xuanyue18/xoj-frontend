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
        <a href="https://github.com/xuanyue18" style="text-decoration: none"
          >Xcode Online Judge by xuanyue18</a
        >
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style>
#basicLayout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#basicLayout .header {
  box-shadow: #eee 0px 2px 5px;
  margin-bottom: 16px;
  position: sticky;
  top: 0;
  z-index: 1;
}

#basicLayout .content {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.9);
  width: 95%;
  padding: 15px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  //background: linear-gradient(to right, #fefefe, #fff); margin-bottom: 16px;
}

#basicLayout .footer {
  padding: 12px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script>
import GlobalHeader from "@/components/GlobalHeader";

export default {
  components: { GlobalHeader },
};
</script>
