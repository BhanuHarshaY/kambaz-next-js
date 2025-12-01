"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function AccountNavigation() {
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  const links = currentUser 
    ? [{ href: "/Account/Profile", label: "Profile" }]
    : [
        { href: "/Account/Signin", label: "Signin" },
        { href: "/Account/Signup", label: "Signup" }
      ];

  return (
    <div id="wd-account-navigation" className="list-group">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`list-group-item list-group-item-action border-0 text-center rounded-0 ${
              isActive
                ? "text-black border-start border-3 border-black"
                : "text-danger"
            }`}
          >
            <span className="d-block">{link.label}</span>
          </Link>
        );
      })}
      
      
      {currentUser && currentUser.role === "ADMIN" && (
        <Link
          href="/Account/Users"
          className={`list-group-item list-group-item-action border-0 text-center rounded-0 ${
            pathname.endsWith('Users')
              ? "text-black border-start border-3 border-black"
              : "text-danger"
          }`}
        >
          <span className="d-block">Users</span>
        </Link>
      )}
    </div>
  );
}