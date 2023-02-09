import { Grid } from "@mui/material";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { Box } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function TimePicker({ value, setValue }) {
  return (
    <Grid container>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileTimePicker
          value={value}
          onChange={(newTime) => setValue(newTime)}
          closeOnSelect={true}
          componentsProps={{
            leftArrowButton: KeyboardArrowLeftIcon,
            rightArrowButton: ChevronRightIcon,
          }}
          DialogProps={{
            sx: {
              "& .MuiButtonBase-root": {
                fontWeight: "bold",
                fontSize: "14px",
                width: "40px",
              },
              "& .MuiButtonBase-root.Mui-disabled": {
                border: "transparent",
              },
              "& .MuiPaper-root": {
                borderRadius: "10px",
                marginLeft: "70px",
                marginTop: "-150px",
              },
              "& .MuiIconButton-sizeSmall.MuiIconButton-edgeEnd, .MuiIconButton-sizeSmall.MuiIconButton-edgeStart":
                {
                  border: "1px solid #e4e9f0",
                  width: "auto",
                },
              "& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected": {
                color: "#fff",
                backgroundColor: "#66b984",
                fontWeight: "bold",
                border: "1px solid var(--muted-gray-color)",
                borderRadius: "10px",
              },
              "& .MuiButtonBase-root.MuiPickersDay-root:not(.Mui-selected):not(.Mui-disabled)":
                {
                  borderRadius: "10px",
                },
              "& .MuiTimePickerToolbar-ampmLabel.Mui-selected": {
                color: "#fff",
                backgroundColor: "#66b984",
                fontWeight: "bold",
                border: "1px solid var(--muted-gray-color)",
                borderRadius: "18px",
                padding: "5px",
              },
              "& .MuiDialogActions-root": {
                display: "none",
              },
              "& .MuiClockPicker-root": {
                marginTop: "-16px",
              },
              "& .MuiBackdrop-root": {
                backgroundColor: "transparent",
              },
            },
          }}
          renderInput={({ inputRef, inputProps, InputProps }) => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid rgba(211, 214, 219, 1)",
                borderRadius: "0.5rem",
                padding: "0.7rem 0.6rem",
                height: "40px",
                marginTop: "14px",
              }}
            >
              <input
                style={{
                  border: "transparent",
                  width: "5rem",
                  color: "#f5f5f5",
                  font: "normal normal normal 16px/19px Work Sans",
                  backgroundColor: "#1B1A1D",
                }}
                ref={inputRef}
                {...inputProps}
              />
              <KeyboardArrowDownIcon ref={inputRef} {...inputProps} />
              {InputProps?.endAdornment}
            </Box>
          )}
        />
      </LocalizationProvider>
    </Grid>
  );
}
