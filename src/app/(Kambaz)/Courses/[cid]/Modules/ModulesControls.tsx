
import { useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch } from "react-redux";
import ModuleEditor from "./ModuleEditor";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { IoBanOutline } from "react-icons/io5";
import { addModule } from "./reducer";

export default function ModulesControls() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  
  const [show, setShow] = useState(false);
  const [moduleName, setModuleName] = useState("");
  
  const handleClose = () => {
    setShow(false);
    setModuleName(""); // Reset module name when closing
  };
  
  const handleShow = () => setShow(true);
  
  const handleAddModule = () => {
    if (moduleName.trim()) {
      dispatch(addModule({
        name: moduleName,
        course: cid as string
      }));
      setModuleName("");
      handleClose();
    }
  };

  return (
    <div id="wd-modules-controls" className="text-nowrap">
      <Button
        variant="danger"
        onClick={handleShow}
        size="lg"
        className="me-1 float-end"
        id="wd-add-module-btn"
      >
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Module
      </Button>
      
      <Dropdown className="float-end me-2">
        <DropdownToggle variant="secondary" size="lg" id="wd-publish-all-btn">
          <GreenCheckmark /> Publish All
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem id="wd-publish-all-modules-and-items">
            <GreenCheckmark /> Publish all modules and items
          </DropdownItem>
          <DropdownItem id="wd-publish-modules-only">
            <GreenCheckmark /> Publish modules only
          </DropdownItem>
          <DropdownItem id="wd-unpublish-all-modules-and-items">
            <IoBanOutline /> Unpublish all modules and items
          </DropdownItem>
          <DropdownItem id="wd-unpublish-modules-only">
            <IoBanOutline /> Unpublish modules only
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      
      <Button
        variant="secondary"
        size="lg"
        className="me-1 float-end"
        id="wd-view-progress"
      >
        View Progress
      </Button>
      
      <Button
        variant="secondary"
        size="lg"
        className="me-1 float-end"
        id="wd-collapse-all"
      >
        Collapse All
      </Button>
      
      <ModuleEditor 
        show={show} 
        handleClose={handleClose} 
        dialogTitle="Add Module"
        moduleName={moduleName} 
        setModuleName={setModuleName} 
        addModule={handleAddModule} 
      />
    </div>
  );
}