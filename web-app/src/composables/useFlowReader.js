import { readonly, reactive, ref, computed } from "vue";

import { tcms } from "boot/axios";

// MAIN EXPORT FUNCTION
export default function useFlowReader() {
  // The current flowId
  const flowId = ref();

  // Is any flow data loaded?
  const flowLoaded = ref(false);

  const title = ref("Fetching great things...");

  const loadFlowData = async (flowId) => {
    console.log("Fetching data for flow: " + flowId);

    // Get the flow.json to get the title
    const flowDataRes = await tcms.get("/flows/" + flowId + "/flow.json");
    const flowData = flowDataRes.data;
    console.log(flowData);
    // Get the nugget seq so we can start loading nuggets
    // const  = await tcms.get("/flows/" + flowId + "/nuggetSeq.json").data;

    let nuggetSeqRes = await tcms.get("/flows/" + flowId + "/nuggetSeq.json");
    let nuggetSeq = nuggetSeqRes.data.nuggetSeq;
    console.log(nuggetSeq);

    const nuggets = await Promise.all(
      nuggetSeq.map(async (nuggetId) => {
        try {
          console.log(nuggetId);
          const nuggetRes = await tcms.get(
            "/nuggets/" + nuggetId + "/nugget.json"
          );
          const blocksRes = await tcms.get(
            "/nuggets/" + nuggetId + "/blocks.json"
          );
          const nugget = nuggetRes.data;
          nugget.blocks = blocksRes.data.blocks;
          console.log(nugget);
          return nugget;
        } catch (e) {
          console.error(e);
        }
      })
    );

    /*
    await nuggetSeq.forEach(async (nuggetId) => {
      console.log("Fetching data for nugget: " + nuggetId);
      // Use Axios to fetch JSON files from app public directory
      const nugget = await tcms.get("/nuggets/" + nuggetId + "/nugget.json");
      const blocks = await tcms.get("/nuggets/" + nuggetId + "/blocks.json");

      console.log(nugget.data);
      console.log(blocks.data.blocks);

      const nuggetObj = nugget.data;
      nuggetObj.blocks = blocks.data.blocks;

      nuggets.set(nuggetId, nuggetObj);
    });
*/
    flowData.nuggets = nuggets;

    console.log(flowData);

    return flowData;
  };

  // Lookup for - Given a siteName find the primary hostname
  //const siteHost = {};
  //for (var hostName in hostSite) {
  //  siteHost[hostSite[hostName]] = hostName;
  //}

  return {
    flowLoaded,
    loadFlowData,
    title,
  };
}
