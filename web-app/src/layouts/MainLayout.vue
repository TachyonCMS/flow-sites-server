<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>{{ pageTitle }}</q-toolbar-title>
        <div class="nameBug">
          <a href="https://www.TachyonCMS.org/#/">TachyonCMS</a>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view @newPageTitle="(event) => onNewTitle(event)" />
    </q-page-container>

    <q-footer class="bg-grey-2 foot">
      <q-toolbar>
        <div class="col-12 text-body2 subdued-link text-center">
          Powered by
          <a target="_blank" href="https://www.tachyoncms.org/#/">TachyonCMS</a
          >, the free CMS.
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    const leftDrawerOpen = ref(false);

    const pageTitle = ref("great things loading...");

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      pageTitle,
    };
  },
  methods: {
    onNewTitle(title) {
      console.log("SETTING Title: " + title);
      this.pageTitle = title;
    },
  },
});
</script>

<style scoped>
.foot {
  color: darkgray;
}
.nameBug {
  opacity: 40%;
}
</style>
