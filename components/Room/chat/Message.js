import { Grid, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";

export default function Message(props) {
  const { content, date, by, showBy } = props;

  const selfId = useSelector((state) => state.user.data);

  const formatDateString = (d) => {
    const dat = new Date(d);
    return `${dat.getHours()}:${dat.getMinutes()}:${dat.getSeconds()}`;
  };

  return (
    <Paper
      elevation={5}
      style={{
        backgroundColor: selfId.uid === by ? "#e0ffc6" : "#ffffff",
        width: "fit-content",
        maxWidth: "90%",
        padding: "10px",
        marginTop: showBy ? "30px" : "10px",
        borderRadius: "5px",
        marginLeft: selfId.uid === by && "auto",
      }}
    >
      <Grid
        container
        style={{
          width: "fit-content",
          maxWidth: "100%",
        }}
      >
        {selfId.uid !== by && showBy && (
          <Grid item xs={12}>
            <Typography
              style={{
                fontSize: "18px",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                {by}:
              </span>
            </Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography
            style={{
              fontSize: "22px",
            }}
          >
            {content}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography textAlign={"right"}>{formatDateString(date)}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
