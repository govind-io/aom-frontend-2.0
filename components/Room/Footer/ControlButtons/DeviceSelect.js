import { MenuItem, Select } from "@mui/material";
import { useRef } from "react";

export default function DeviceSelect({
  activeDevice,
  allDevices,
  setActiveDevice,
}) {
  const selectRef = useRef();

  return (
    <Select
      fullWidth
      inputProps={{
        "aria-label": "Without label",
      }}
      ref={selectRef}
      sx={{
        height: "30px",
        color: "#fff",
        font: "normal normal normal 14px/16px Work Sans",
        border: "1px solid white",
      }}
      value={activeDevice}
      MenuProps={{
        anchorReference: "anchorPosition",
        anchorPosition: {
          top: selectRef.current?.getBoundingClientRect()?.top || -1000,
          left: selectRef.current?.getBoundingClientRect()?.left || 1000,
        },
        transformOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        disablePortal: true,
      }}
      onChange={(e) => {
        setActiveDevice(e.target.value);
      }}
    >
      {allDevices.map((item) => {
        return (
          <MenuItem value={item.deviceId} key={item.deviceId}>
            {item.label}
          </MenuItem>
        );
      })}
    </Select>
  );
}
