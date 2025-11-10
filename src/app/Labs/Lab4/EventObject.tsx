import { useState, type MouseEvent } from "react";

export default function EventObject() {
  const [event, setEvent] = useState<Record<string, unknown> | null>(null);
  
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const evt = {
      "_reactName": "onClick",
      "_targetInst": null,
      "type": "click",
      "nativeEvent": {},
      "isTrusted": true,
    };
    
    
    const targetElement = e.currentTarget;
    const targetObj = {
      "target": `<button id=\"event-button\" class=\"btn btn-primary\">Display Event Object</button>`,
      "currentTarget": null,
      "eventPhase": 3,
      "bubbles": true,
      "cancelable": true,
      "timeStamp": e.timeStamp,
      "defaultPrevented": false,
      "isTrusted": true,
      "detail": 1,
      "screenX": e.screenX,
      "screenY": e.screenY
    };
    
    
    setEvent({
      ...evt,
      ...targetObj
    });
  };
  
  return (
    <div>
      <h2>Event Object</h2>
      <button 
        onClick={(e) => handleClick(e)}
        className="btn btn-primary"
        id="wd-display-event-obj-click">
        Display Event Object
      </button>
      <pre>{JSON.stringify(event, null, 2)}</pre>
      <hr/>
    </div>
  );
}