"use client";

import Image from "next/image";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "./store";

export default function KambazNavigation() {
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const links = [
    { label: "Dashboard", path: "/Dashboard", icon: AiOutlineDashboard, requiresAuth: true },
    { label: "Courses", path: "/Dashboard", icon: LiaBookSolid, requiresAuth: true }, 
    { label: "Calendar", path: "/Calendar", icon: IoCalendarOutline, requiresAuth: true },
    { label: "Inbox", path: "/Inbox", icon: FaInbox, requiresAuth: true },
    { label: "Labs", path: "/Labs", icon: LiaCogSolid, requiresAuth: false },
  ];

  return (
    <ListGroup
      id="wd-kambaz-navigation"
      style={{ width: 110 }}
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
    >
      {/* NEU Logo */}
      <ListGroupItem
        id="wd-neu-link"
        target="_blank"
        href="https://www.northeastern.edu/"
        action
        className="bg-black border-0 text-center"
      >
        <Image src="/images/NEU.png" alt="NEU Logo" width={70} height={70} priority />
      </ListGroupItem>

      {/* Account */}
      <ListGroupItem
        as={Link}
        href="/Account"
        className={`text-center border-0 bg-black ${
          pathname.includes("Account") ? "bg-white text-danger" : "bg-black text-white"
        }`}
      >
        <FaRegCircleUser
          className={`fs-1 ${
            pathname.includes("Account") ? "text-danger" : "text-white"
          }`}
        />
        <br />
        Account
      </ListGroupItem>

      {/* Navigation Links */}
      {links.map((link) => {
        const isActive = pathname.includes(link.label);
        const Icon = link.icon;
        const isDisabled = link.requiresAuth && !currentUser;
        
        
        if (isDisabled) {
          return (
            <ListGroupItem
              key={`${link.path}-${link.label}`}
              className="bg-black text-center border-0 text-white"
              style={{ cursor: "not-allowed" }}
            >
              <Icon className="fs-1 text-danger" />
              <br />
              {link.label}
            </ListGroupItem>
          );
        }
        
        
        return (
          <ListGroupItem
            key={`${link.path}-${link.label}`}
            as={Link}
            href={link.path}
            className={`bg-black text-center border-0 ${
              isActive ? "text-danger bg-white" : "text-white bg-black"
            }`}
          >
            <Icon className="fs-1 text-danger" />
            <br />
            {link.label}
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
}