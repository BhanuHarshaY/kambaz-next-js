"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountNavigation() {
  const pathname = usePathname();

  const links = [
    { href: "/Account/Signin", label: "Signin" },
    { href: "/Account/Signup", label: "Signup" },
    { href: "/Account/Profile", label: "Profile" },
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
    </div>
  );
}