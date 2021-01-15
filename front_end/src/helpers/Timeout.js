import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IdleModal from "../components/IdleModal";
import axios from "axios";
import { BASE_URL } from "../config";
import { deleteTransactions } from "./actionCreators";
const Timeout = ({ triggerModal, setTriggerModal }) => {
  const timerId = useRef(null);
  const timerId1 = useRef(null);
  const timerId2 = useRef(null);
  const timerId3 = useRef(null);
  const dispatch = useDispatch();
  const access_token = useSelector((state) => state.access_token);
  const logged_in = useSelector((state) => state.logged_in);
  const _token = useSelector((state) => state._token);
  const item_id = useSelector((state) => state.item_id);
  const [checkIdle, setCheckIdle] = useState(true);
  const [modalCountUp, setModalCountUp] = useState(0);
  const reset = async () => {
    if (item_id) {
      await axios.post(`${BASE_URL}api/transactions/delete`, {
        _token,
        access_token,
        item_id,
      });
      // dispatch(deleteTransactions(_token, access_token, item_id));
      dispatch({
        type: "HALF-RESET",
      });
      localStorage.removeItem("_token");
      localStorage.removeItem("accessToken");
      Array.from(document.getElementsByClassName("fade show")).forEach((item) =>
        item.classList.remove("show")
      );
      timerId2.current = setTimeout(() => {
        alert("Thanks for using Cash Counselor. See you soon!");
      }, 500);
      timerId3.current = setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      return () => {
        clearTimeout(timerId2.current);
      };
    }
  };

  const refreshToken = useCallback(() => {
    axios
      .post(`${BASE_URL}refreshPlaidToken`, { _token })
      .then((res) => {
        console.log("refreshing");
        clearTimeout(timerId.current);
        timerId.current = null;
        dispatch({ type: "SET_JWT", _token: res.data._token });
        setModalCountUp(0);
        setCheckIdle(true);
        localStorage.removeItem("_token");
        localStorage.setItem("_token", res.data._token);
      })
      .catch((err) => {
        reset();
      });
  }, [_token, dispatch, reset]);

  useEffect(() => {
    if (
      logged_in &&
      _token &&
      !checkIdle &&
      !triggerModal &&
      modalCountUp < 420
    ) {
      if (!timerId.current)
        timerId.current = setTimeout(() => {
          refreshToken();
        }, 10000);
    }
    if (
      logged_in &&
      _token &&
      !checkIdle &&
      !triggerModal &&
      modalCountUp >= 420 &&
      modalCountUp < 450
    ) {
      timerId.current = setTimeout(() => {
        refreshToken();
      }, 1000);
    }
    return () => {
      if (!timerId.current) clearTimeout(timerId.current);
      clearInterval(timerId1.current);
    };
  }, [_token, logged_in, checkIdle, triggerModal, refreshToken]);

  useEffect(() => {
    if (logged_in) {
      timerId1.current = setInterval(() => {
        return setModalCountUp((modal) => {
          return (modal = modal + 1);
        });
      }, 1000);
    }
    console.log(modalCountUp);
    if (modalCountUp === 450) {
      setCheckIdle(false);
      setTriggerModal(true);
    }
    if (modalCountUp === 570) {
      reset();
    }
    return () => {
      clearInterval(timerId1.current);
    };
  });

  window.addEventListener("scroll", () => {
    if (logged_in && checkIdle) {
      setCheckIdle(false);
    }
  });

  window.addEventListener("mousemove", () => {
    if (logged_in && checkIdle) {
      setCheckIdle(false);
    }
  });

  window.addEventListener("click", () => {
    if (logged_in && checkIdle) {
      setCheckIdle(false);
    }
  });

  return (
    <>
      {triggerModal && triggerModal && (
        <IdleModal
          setCheckIdle={setCheckIdle}
          setTriggerModal={setTriggerModal}
          refreshToken={refreshToken}
          setModalCountUp={setModalCountUp}
        />
      )}
    </>
  );
};

export default Timeout;
