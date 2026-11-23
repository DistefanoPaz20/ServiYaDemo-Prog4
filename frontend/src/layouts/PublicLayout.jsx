import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

function PublicLayout() {
  return (
    <>
      <Navbar />

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default PublicLayout;