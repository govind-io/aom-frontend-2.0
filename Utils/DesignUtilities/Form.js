import { Input, Typography } from "@mui/material";

//Form generator here
export const DesignForms = (form, error) => {
  return form.map((elem) => {
    return (
      <div key={elem.name}>
        <Input
          placeholder={elem.placeholder}
          fullWidth
          name={elem.name}
          error={error}
          style={{
            marginTop: "30px",
            ...elem.style,
          }}
          id={elem.id}
        />
        <Typography
          textAlign="left"
          style={{
            color: "rgba(0, 0, 0, 0.7)",
            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
            fontWeight: "400",
            fontSize: "0.75rem",
            lineHeight: "1.66",
            letterSpacing: "0.03333em",
            textAlign: "left",
            margin: "3px 14px 0px",
          }}
          variant="h3"
        >
          {elem.helperText}
        </Typography>
      </div>
    );
  });
};

//Form fields here

export const JoinRoomForm = [
  {
    name: "meetingid",
    placeholder: "Meet Id",
    helperText: "Please enter meeting Id",
    id: "meetinf-id-field",
  },
  {
    name: "name",
    placeholder: "Your name",
    helperText: "Please enter your name",
    id: "name-field",
  },
];
