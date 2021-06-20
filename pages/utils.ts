import notification from "antd/lib/notification";

export const StoreErrorHandling = (msg: string) => {
  notification.error({
    message: "Error",
    description: msg,
    placement: "bottomRight",
  });
};

export const StoreSuccessHandling = (msg: string) => {
  notification.success({
    message: "Success",
    description: msg,
    placement: "bottomRight",
  });
};
