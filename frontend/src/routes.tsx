import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./components/pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (<HomePage setCurrentPage={(page: string) => console.log(page)} />),
  },
]);