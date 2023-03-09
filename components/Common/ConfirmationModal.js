import { Grid, IconButton, Modal, Typography, Zoom } from "@mui/material";
import { ConfirmationModalStyle } from "../../styles/Common/ConfirmationModal";

export default function ConfirmationModal({
  open,
  handleCloseModal,
  title,
  text,
  confirm,
  reject,
  confirmText,
  rejectText,
  extraButton,
}) {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleCloseModal}
      closeAfterTransition
      componentsProps={{
        backdrop: {
          style: {
            backgroundColor: "rgba(43, 43, 43, 0.8)",
          },
        },
      }}
    >
      <Zoom in={open}>
        <Grid
          container
          sx={ConfirmationModalStyle.container}
        >
          <Grid item xs={12}>
            <Typography
              sx={{
                font: "normal normal 600 24px/28px Work Sans",
                color: "#F5F5F5",
              }}
            >
              {title}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              marginTop: "36px",
            }}
          >
            <Typography
              sx={{
                font: "normal normal normal 16px/19px Work Sans",
                color: "#CECECE",
              }}
            >
              {text}
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              marginTop: "50px",
              justifyContent: "flex-start",
            }}
          >
            <IconButton
              sx={[ConfirmationModalStyle.iconButton, ConfirmationModalStyle.iconRejectButton]}
              variant={"contained"}
              disableRipple={true}
              onClick={reject}
            >
              {rejectText}
            </IconButton>
            <IconButton
              sx={[ConfirmationModalStyle.iconButton, ConfirmationModalStyle.iconConfirmButton]}
              variant={"contained"}
              disableRipple={true}
              onClick={confirm}
            >
              {confirmText}
            </IconButton>
            {extraButton}
          </Grid>
        </Grid>
      </Zoom>
    </Modal>
  );
}
