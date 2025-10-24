import type { FC, PropsWithChildren } from "react";
import Navbar from "../Navbar/Navbar";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="container">{children}</main>
    </>
  );
};

export default Layout;
