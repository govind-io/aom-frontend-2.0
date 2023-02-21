import { Grid } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Box, Stack } from "@mui/system";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function CustomDatePicker({ value, setValue }) {
  return (
    <Grid container>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack
          sx={{
            marginTop: "20px",
          }}
        >
          <DatePicker
            value={value}
            onChange={(newDate) => setValue(newDate)}
            minDate={new Date()}
            inputFormat="dd/MM/yyyy"
            components={{
              OpenPickerIcon: KeyboardArrowDownIcon,
            }}
            closeOnSelect={true}
            PopperProps={{
              sx: {
                "& .MuiButtonBase-root": {
                  fontWeight: "bold",
                  fontSize: "12px",
                  width: "40px",
                },
                "& .MuiButtonBase-root.Mui-disabled": {
                  border: "transparent",
                },
                "& .MuiPaper-root": {
                  borderRadius: "10px",
                  marginLeft: "200px",
                  marginTop: "15px",
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
                "& .MuiTypography-root": {
                  fontWeight: "bold",
                  color: "#63779c",
                  marginLeft: "3px",
                },
                "& .MuiIconButton-edgeEnd": {
                  color: "#000000",
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
                }}
              >
                <input
                  style={{
                    border: "transparent",
                    width: "100%",
                    color: "#f5f5f5",
                    font: "normal normal normal 12px/19px Work Sans",
                    backgroundColor: "#1B1A1D",
                  }}
                  ref={inputRef}
                  {...inputProps}
                />
                {InputProps?.endAdornment}
              </Box>
            )}
          />
        </Stack>
      </LocalizationProvider>
    </Grid>
  );
}
