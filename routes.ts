import Route from "next-routes";

const routes = new Route();

routes
  .add("/projects/create", "projects/create")
  .add("/projects/:address", "projects/detail")
  .add("/projects/:address/payments/create", "projects/payments/create");

export default routes;
