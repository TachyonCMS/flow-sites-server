<template>
  <q-page>
    <!-- Show a spinner over the div if the flow hasn't finished loading. -->
    <template v-if="flowLoaded">
      <template v-if="flowData.nuggets">
        <q-list v-for="nugget in flowData.nuggets" :key="nugget.id">
          <div class="nugget-container row col-12">
            <render-blocks
              :blocks="nugget.blocks"
              v-if="nugget.type === 'media'"
            >
            </render-blocks>
            <editorjs-reader
              :blocks="nugget.blocks"
              v-if="nugget.type === 'editor'"
            >
            </editorjs-reader>
          </div>
        </q-list>
      </template>
    </template>
    <template v-else>
      <q-inner-loading :showing="true">
        <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
      </q-inner-loading>
    </template>
  </q-page>
</template>

<script>
import { defineComponent, computed, ref, reactive, onMounted } from "vue";

import { useQuasar, useMeta } from "quasar";

import useFlowReader from "../composables/useFlowReader.js";

import RenderBlocks from "../components/flows/blocks/RenderBlocks";
import EditorjsReader from "../components/flows/blocks/EditorjsReader";

// Lookup for - Given a hostname find the siteName
const hostSite = {
  "www.bikemechanic.info": "bikemechanic",
  "www.ezvegetarian.com": "ezvegetarian",
  "www.financeaproperty.com": "financeaproperty",
  "www.netrealestateguide.com": "netrealestateguide",
  "www.opensourcebike.com": "opensourcebike",
  "www.tachyoncms.com": "tachyoncms-com",
  "www.etownmall.com": "etownmall",
  "www.izzup.com": "izzup",
  localhost: "dev",
};

// Lookup for - Given a siteName find the primary hostname
const siteHost = {};
for (var hostName in hostSite) {
  siteHost[hostSite[hostName]] = hostName;
}

// Lookup for - Given a siteName find the siteFlowId
const siteFlow = {
  bikemechanic: "gGc3_MzRV_FQOU_QTzu_U3Ze",
  ezvegetarian: "V2p6_4aNr_U5y2_EiAj_sn4p",
  financeaproperty: "8k1C_ZaJw_3eck_o5yr_rXT6",
  netrealestateguide: "2KLG_ePJ0_ySkN_HmAu_mHX0",
  opensourcebike: "DCZ2_7T9c_HAr6_TLa4_zzc9",
  "tachyoncms-com": "wWap_bxAI_Gg6N_DJoF_g8Ib",
  etownmall: "SUok_qLLO_5H4g_kAFK_cKPx",
  dev: "z2LP_8che_ypUi_uNID_JEs3",
  izzup: "Llu2_iPdV_GfZs_wvux_Q1w0",
};

// Main export

export default defineComponent({
  name: "FlowSitesIndexPage",
  components: {
    RenderBlocks,
    EditorjsReader,
  },
  emits: ["newPageTitle"],
  setup(props, { emit }) {
    const hostName = computed(() => {
      return window.location.hostname;
    });

    const siteName = ref(null);
    const siteFlowId = ref(null);

    siteName.value = hostSite[hostName.value];
    siteFlowId.value = siteFlow[siteName.value];

    const { loadFlowData, title } = useFlowReader();

    const flowData = ref(null);

    const flowLoaded = ref(false);

    onMounted(async () => {
      flowData.value = await loadFlowData(siteFlowId.value);
      flowLoaded.value = true;
      emit("newPageTitle", flowData.value.title);
    });

    // NOTICE the parameter here is a function
    // Under the hood, it is converted to a Vue computed prop for reactivity
    useMeta(() => {
      return {
        // whenever "title" from above changes, your meta will automatically update
        title: title.value,
      };
    });

    return {
      hostName,
      siteName,
      siteFlowId,
      flowLoaded,
      flowData,
      title,
    };
  },
});
</script>
