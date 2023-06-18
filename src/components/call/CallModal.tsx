import { Modal } from "@mui/material";

export const Call = ({
  isCalling,
  setIsCalling,
}: {
  isCalling: boolean;
  setIsCalling: Function;
}) => {
  const leaveCall = () => {
    setIsCalling(false);
  };
  return (
    <Modal open={isCalling} onClose={leaveCall}>
      <div>Hello</div>
    </Modal>
  );
};
