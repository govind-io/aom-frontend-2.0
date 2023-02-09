import { Grid, Modal, Zoom } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CreateMeeting from "./CreateMeeting";
import { useRef, useState } from "react";
import SuccessPage from "./DisplaySuccessMeeting";

export default function ScheduleMeetingModal({ open, setOpen }) {
  const dispatch = useDispatch();

  const createMeetingRef = useRef();
  const user = useSelector((s) => s.user.data);

  const [page, setPage] = useState(1);

  const handleCloseModal = () => {
    createMeetingRef.current.resetFormValues();
    setOpen(false);
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
        >
          {page === 1 ? (
            <CreateMeeting
              handleCloseModal={handleCloseModal}
              ref={createMeetingRef}
              setPage={setPage}
            />
          ) : (
            <SuccSessPage
              setPage={setPage}
              handleCloseModal={handleCloseModal}
            />
          )}
        </Grid>
      </Zoom>
    </Modal>
  );
}
