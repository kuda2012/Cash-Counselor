import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import moment from "moment";
const IdleModal = ({
  setCheckIdle,
  setTriggerModal,
  refreshToken,
  setModalCountUp,
}) => {
  const [modal, setModal] = useState(true);
  const [logoutTime, setLogoutTIme] = useState(null);
  if (!logoutTime) {
    setLogoutTIme(moment().add(2, "m").format("LT"));
  }

  const toggle = () => setModal(!modal);
  return (
    <Modal
      id="idleModal"
      isOpen={modal}
      toggle={toggle}
      backdrop="static"
      keyboard={false}
    >
      <ModalBody>
        Your session will time out at {logoutTime}. Click to extend your
        session.
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={() => {
            setCheckIdle(true);
            setTriggerModal(false);
            setModalCountUp(0);
            refreshToken();
            toggle();
          }}
        >
          Extend Session
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default IdleModal;
