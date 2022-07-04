import { readonly, reactive, ref, computed } from "vue";

import { tcms } from "boot/axios";

import RenderBlocks from "../components/flows/blocks/RenderBlocks";

// MAIN EXPORT FUNCTION
export default function useFlowReader() {
  // The current flowId
  const flowId = ref();

  // Is any flow data loaded?
  const flowLoaded = ref(false);

  // The flow data
  const flowData = ref({});

  // Are nuggets being loaded? They may be loaded in batches on-demand.
  const nuggetsLoading = ref(false);

  // A sequenced array of nuggetIds
  const nuggetSeq = ref(null);

  // Reactive array of Nuggets
  const nuggets = ref([]);

  // A map of blocks by nuggetId
  const nuggetBlocksMap = reactive(new Map());

  const renderBlocks = async (blocks) => {};

  const loadFlowData = async (flowId) => {
    console.log("Fetching data for flow: " + flowId);

    // Get the flow.json to get the title
    tcms
      .get("/flows/" + flowId + "/flow.json")
      .then((response) => {
        flowData.value = response.data;
        flowLoaded.value = true;
        title.value = response.data.title;
      })
      .catch((e) => {
        console.log(e);
      });

    // Get the nugget seq so we can start loading nuggets
    tcms
      .get("/flows/" + flowId + "/nuggetSeq.json")
      .then((response) => {
        nuggetSeq.value = response.data.nuggetSeq;
        response.data.nuggetSeq.forEach((nuggetId) => {
          console.log("Fetching data for nugget: " + nuggetId);
          console.log(response.data.nuggetSeq);
          // Use Axios to fetch JSON files from app public directory
          tcms
            .get("/nuggets/" + nuggetId + "/nugget.json")
            .then((response) => {
              console.log(response.data);
              nuggets.value.push(response.data);

              tcms
                .get("/nuggets/" + nuggetId + "/blocks.json")
                .then((response) => {
                  console.log(response.data);
                  nuggetBlocksMap.set(nuggetId, response.data.blocks);
                })
                .catch((e) => {
                  console.log(e);
                });
            })
            .catch((e) => {
              console.log(e);
            });
        });
      })
      .catch((e) => {
        console.log(e);
      });

    console.log(nuggets.value);
  };

  // Lookup for - Given a siteName find the primary hostname
  //const siteHost = {};
  //for (var hostName in hostSite) {
  //  siteHost[hostSite[hostName]] = hostName;
  //}

  return {
    flowLoaded,
    flowData,
    nuggetsLoading,
    nuggetSeq,
    nuggets,
    nuggetBlocksMap,
    loadFlowData,
  };
}
