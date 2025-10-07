
import { BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";

export default function ModuleControlButtons() {
  return (
    <div className="d-flex align-items-center gap-1">
      <GreenCheckmark />
      <BsPlus className="fs-4" />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}