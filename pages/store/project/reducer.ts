import { StoreErrorHandling, StoreSuccessHandling } from "pages/utils";

const reducer = (state: Store.ProjectStore, action: Store.ProjectStore) => {
  const { type } = action;

  switch (type) {
    case "createing":
      return action;
    case "failed":
      StoreErrorHandling(action.msg);
      return action;
    case "success":
      StoreSuccessHandling(action.msg);
      return { ...state, ...action };
    default:
      return state;
  }
};

export default reducer;
