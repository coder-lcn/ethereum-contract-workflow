import { StoreErrorHandling, StoreSuccessHandling } from "pages/utils";

const reducer = (state: Store.payStore, action: Store.payStore) => {
  const { type, payload } = action;

  switch (type) {
    case "success":
    case "failed":
      type === "failed" && StoreErrorHandling(action.msg);
      type === "success" && StoreSuccessHandling(action.msg);

      if (payload.list.length) {
        const index = state.payload.list.findIndex((v) => v.address === payload.list[0].address);
        state.payload.list.splice(index, 1);
        state.payload.processingProject = payload.list[0];
      } else {
        StoreErrorHandling("缺少投资项目参数");
      }

      return {
        ...state,
        type,
      };
    case "paying":
      state.payload.list.push(payload.list[0]);

      return {
        ...state,
        type,
      };
    default:
      return state;
  }
};

export default reducer;
