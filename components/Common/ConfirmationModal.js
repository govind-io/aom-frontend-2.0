import { Grid, IconButton, Modal, Typography, Zoom } from "@mui/material";

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
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%) !important",
            background: "#1B1A1D",
            border: "1px solid #FFFFFF4D",
            borderRadius: "16px",
            padding: "32px",
            display: "flex",
            width: "fit-content",
            justifyContent: "flex-start",
            width: "50%",
            maxWidth: "600px",
          }}
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
              sx={{
                background: "#7AB788 0% 0% no-repeat padding-box",
                borderRadius: "8px",
                padding: "10px 15px",
                font: "normal normal 600 14px/16px Work Sans",
                color: "#F5F5F5",
              }}
              variant={"contained"}
              disableRipple={true}
              onClick={reject}
            >
              {rejectText}
            </IconButton>
            <IconButton
              sx={{
                marginLeft: "20px",
                background: "#BC4130 0% 0% no-repeat padding-box",
                borderRadius: "8px",
                padding: "10px 15px",
                font: "normal normal 600 14px/16px Work Sans",
                color: "#F5F5F5",
              }}
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
