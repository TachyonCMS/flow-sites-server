import { readonly, reactive, ref, computed } from "vue";

import { tcms } from "boot/axios";

// MAIN EXPORT FUNCTION
export default function useFlowReader() {
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

  return {
    flowLoaded,
    flowData,
    nuggetsLoading,
    nuggetSeq,
    nuggets,
    nuggetBlocksMap,
  };
}
