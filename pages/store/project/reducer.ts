import { StoreErrorHandling, StoreSuccessHandling } from "pages/utils";

const reducer = (state: Store.ProjectStore, action: Store.ProjectStore) => {
  const { type } = action;

  switch (type) {
    case "createing":
      return action;
    case "created":
      return { ...state, ...action };
    case "failed":
      StoreErrorHandling(action.msg);
      return action;
    case "success":
      StoreSuccessHandling(action.msg);
      return action;
    default:
      return state;
  }
};

export default reducer;
