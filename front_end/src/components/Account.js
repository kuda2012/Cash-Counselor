import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getTransactions, getAccounts } from "../helpers/actionCreators";
import Transaction from "./Transaction";
import FilterTransactionsForm from "./FilterTransactionsForm";
import ReactPaginate from "react-paginate";
import "../styles/Transactions.css";
import { bool, node } from "prop-types";
import { useTransition, animated } from "react-spring";
import styled from "styled-components";
import "../styles/Account.css";

//Toggle Form
const Inner = styled.div`
  &:before,
  &:after {
    content: "";
    display: table;
  }
`;

const visibleStyle = { height: "auto", opacity: 1, overflow: "visible" };
const hiddenStyle = { opacity: 0, height: 0, overflow: "hidden" };

function getElementHeight(ref) {
  return ref.current ? ref.current.getBoundingClientRect().height : 0;
}

/** The children of this component will slide down on mount and will slide up on unmount */
const SlideToggleContent = ({ isVisible, children, forceSlideIn }) => {
  const isVisibleOnMount = useRef(isVisible && !forceSlideIn);
  const containerRef = useRef(null);
  const innerRef = useRef(null);

  const transitions = useTransition(isVisible, null, {
    enter: () => async (next, cancel) => {
      const height = getElementHeight(innerRef);

      cancel();

      await next({ height, opacity: 1, overflow: "hidden" });
      await next(visibleStyle);
    },
    leave: () => async (next, cancel) => {
      const height = getElementHeight(containerRef);

      cancel();

      await next({ height, overflow: "hidden" });
      await next(hiddenStyle);

      isVisibleOnMount.current = false;
    },
    from: isVisibleOnMount.current ? visibleStyle : hiddenStyle,
    unique: true,
  });

  return transitions.map(({ item: show, props: springProps, key }) => {
    if (show) {
      return (
        <animated.div ref={containerRef} key={key} style={springProps}>
          <Inner ref={innerRef}>{children}</Inner>
        </animated.div>
      );
    }

    return null;
  });
};

SlideToggleContent.defaultProps = {
  forceSlideIn: false,
};

SlideToggleContent.propTypes = {
  /** Should the component mount it's childeren and slide down */
  isVisible: bool.isRequired,
  /** Makes sure the component always slides in on mount. Otherwise it will be immediately visible if isVisible is true on mount */
  forceSlideIn: bool,
  /** The slidable content elements */
  children: node.isRequired,
};

const Account = ({ test }) => {
  // Transaction info
  // const { account_id } = test || useParams();
  const { account_id } = useParams();
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts);
  const accountSpecificTransactions = useSelector(
    (state) => state.accountTransactions[`${account_id}`]
  );
  const item_id = useSelector((state) => state.item_id);
  const institution_id = useSelector((state) => state.institution_id);
  const token = useSelector((state) => state.token);
  const _token = useSelector((state) => state._token);
  const access_token = useSelector((state) => state.access_token);
  const logged_in = useSelector((state) => state.logged_in);
  const [clearedOnce, setClearedOnce] = useState(false);
  const [account, setAccount] = useState();
  useEffect(() => {
    if (!clearedOnce && accountSpecificTransactions) {
      setClearedOnce(true);
      dispatch({ type: "RESET_ACCOUNT_TRANSACTIONS" });
    } else if (
      !accountSpecificTransactions &&
      logged_in &&
      _token &&
      access_token
    ) {
      dispatch({
        type: "SET_CURRENT_LOCATION",
        currentLocation: window.location.pathname,
      });
      dispatch(getTransactions(_token, access_token, account_id));
    }
    if (
      !accounts &&
      _token &&
      access_token &&
      item_id &&
      institution_id &&
      token
    ) {
      dispatch(getAccounts(_token, access_token, false));
    }
    if (accounts) {
      setAccount(
        (account) =>
          accounts.filter((account) => account.account_id === account_id)[0]
      );
    }
  });
  ///Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const PER_PAGE = 25;
  const offset = currentPage * PER_PAGE;
  let currentTransactions;
  let pageCount;
  if (accountSpecificTransactions) {
    currentTransactions = accountSpecificTransactions
      .slice(offset, offset + PER_PAGE)
      .map((transaction, index) => {
        return <Transaction key={index} transaction={transaction} />;
      });
    pageCount = Math.ceil(accountSpecificTransactions.length / PER_PAGE);
  }
  function handlePageClick({ selected: selectedPage }) {
    setCurrentPage(selectedPage);
  }

  // ToggleForm
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div className="Account">
      <h4 className="Account-title">
        Transactions for Account ...{account && account.mask}
      </h4>
      <button
        type="button"
        className="btn btn-secondary Account-filter-button"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? "Close filters" : "Filter Transactions"}
      </button>
      <SlideToggleContent isVisible={isVisible}>
        <>
          <FilterTransactionsForm setCurrentPage={setCurrentPage} />
        </>
      </SlideToggleContent>
      <div className="Transactions">
        {accountSpecificTransactions && (
          <>
            {accountSpecificTransactions.length === 0 && (
              <div>
                <h5>
                  There are no transactions for this account or filter request
                </h5>
              </div>
            )}
            {currentTransactions}

            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={`pagination ${
                accountSpecificTransactions.length === 0 ? "d-none" : ""
              }`}
              previousLinkClassName={"pagination__link"}
              nextLinkClassName={"pagination__link"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Account;
