import { ReactNode } from "react";
import AccountNavigation from "./Navigation";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div id="wd-account" className="d-flex mt-4">
      <div className="d-none d-md-block me-3">
        <AccountNavigation />
      </div>
      <div className="flex-fill d-flex justify-content-center">
        {children}
      </div>
    </div>
  );
}