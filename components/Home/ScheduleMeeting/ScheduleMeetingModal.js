import { ClickAwayListener, Grid, Modal, Zoom } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CreateMeeting from "./CreateMeeting";
import { useRef, useState } from "react";
import SuccessPage from "./DisplaySuccessMeeting";

export default function ScheduleMeetingModal({ open, setOpen }) {
  const createMeetingRef = useRef();

  const [page, setPage] = useState(1);

  const handleCloseModal = () => {
    createMeetingRef.current?.resetFormValues();
    setOpen(false);
    setPage(1);
  };

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
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
          }}
          onClick={(e) => {
            if (e.target.id === "outer-container") return handleCloseModal();
          }}
          id="outer-container"
        >
          <>
            {page === 1 ? (
              <CreateMeeting
                handleCloseModal={handleCloseModal}
                ref={createMeetingRef}
                setPage={setPage}
              />
            ) : (
              <SuccessPage
                setPage={setPage}
                handleCloseModal={handleCloseModal}
              />
            )}
          </>
        </Grid>
      </Zoom>
    </Modal>
  );
}
