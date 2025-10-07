"use client";

import Image from "next/image";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function KambazNavigation() {
  const pathname = usePathname();

  
  const getLinkClasses = (link: string, isAccount = false) => {
    const isActive = pathname.startsWith(link);
    if (isActive) {
      return "d-block text-decoration-none text-center bg-white text-danger";
    }
    return `d-block text-decoration-none text-center bg-black ${
      isAccount ? "text-white" : "text-white"
    }`;
  };

  const getIconClasses = (link: string, isAccount = false) => {
    const isActive = pathname.startsWith(link);
    if (isActive) {
      return "fs-1 text-danger";
    }
    return isAccount ? "fs-1 text-white" : "fs-1 text-danger";
  };

  return (
    <ListGroup
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
      style={{ width: 110 }}
      id="wd-kambaz-navigation"
    >
      {/* Northeastern University Logo */}
      <ListGroupItem
        className="bg-black border-0 text-center"
        as="a"
        target="_blank"
        href="https://www.northeastern.edu/"
        id="wd-neu-link"
      >
        <Image
          src="/images/NEU.png"
          alt="Northeastern University"
          width={70}
          height={70}
          priority
        />
      </ListGroupItem>

      {/* Account */}
      <ListGroupItem className="border-0 p-0">
        <Link href="/Account" id="wd-account-link" className={getLinkClasses("/Account", true)}>
          <FaRegCircleUser className={getIconClasses("/Account", true)} />
          <div className="fw-medium">Account</div>
        </Link>
      </ListGroupItem>

      {/* Dashboard */}
      <ListGroupItem className="border-0 p-0">
        <Link href="/Dashboard" id="wd-dashboard-link" className={getLinkClasses("/Dashboard")}>
          <AiOutlineDashboard className={getIconClasses("/Dashboard")} />
          <div className="fw-medium">Dashboard</div>
        </Link>
      </ListGroupItem>

      {/* Courses - Now redirects to Dashboard */}
      <ListGroupItem className="border-0 p-0">
        <Link href="/Dashboard" id="wd-courses-link" className={getLinkClasses("/Courses")}>
          <LiaBookSolid className={getIconClasses("/Courses")} />
          <div className="fw-medium">Courses</div>
        </Link>
      </ListGroupItem>

      {/* Calendar */}
      <ListGroupItem className="border-0 p-0">
        <Link href="/Calendar" id="wd-calendar-link" className={getLinkClasses("/Calendar")}>
          <IoCalendarOutline className={getIconClasses("/Calendar")} />
          <div className="fw-medium">Calendar</div>
        </Link>
      </ListGroupItem>

      {/* Inbox */}
      <ListGroupItem className="border-0 p-0">
        <Link href="/Inbox" id="wd-inbox-link" className={getLinkClasses("/Inbox")}>
          <FaInbox className={getIconClasses("/Inbox")} />
          <div className="fw-medium">Inbox</div>
        </Link>
      </ListGroupItem>

      {/* Labs */}
      <ListGroupItem className="border-0 p-0">
        <Link href="/Labs" id="wd-labs-link" className={getLinkClasses("/Labs")}>
          <LiaCogSolid className={getIconClasses("/Labs")} />
          <div className="fw-medium">Labs</div>
        </Link>
      </ListGroupItem>
    </ListGroup>
  );
}