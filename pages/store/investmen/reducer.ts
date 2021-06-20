import { StoreErrorHandling, StoreSuccessHandling } from "pages/utils";

const reducer = (state: Store.InvestmentStore, action: Store.InvestmentStore) => {
  const { type, payload } = action;

  switch (type) {
    case "failed":
      StoreErrorHandling(action.msg);
    case "success":
      StoreSuccessHandling(action.msg);

      const index = state.payload.findIndex((v) => v.address === payload[0].address);
      state.payload.splice(index, 1);

      return {
        ...state,
        type,
      };
    case "investing":
      state.payload.push(payload[0]);

      return {
        ...state,
        type,
      };
    default:
      return state;
  }
};

export default reducer;
