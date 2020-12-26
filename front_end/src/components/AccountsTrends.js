import React, { useEffect, useState, useRef } from "react";
import { bool, node } from "prop-types";
import { useTransition, animated } from "react-spring";
import styled from "styled-components";
import FilterAllTransactionsForm from "./FilterAllTransactionsForm";
import { useDispatch, useSelector } from "react-redux";
import { getAccounts } from "../helpers/actionCreators";
import { v4 as uuid } from "uuid";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import "../styles/AccountTrends.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import PieChart, {
  Series,
  Label,
  Connector,
  Size,
  SmallValuesGrouping,
  Legend as Leg,
  Export,
} from "devextreme-react/pie-chart";
import { Pie } from "react-chartjs-2";
import { Table } from "reactstrap";
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

const AccountsTrends = () => {
  const dispatch = useDispatch();
  const _token = useSelector((state) => state._token);
  const access_token = useSelector((state) => state.access_token);
  const item_id = useSelector((state) => state.item_id);
  const institution_id = useSelector((state) => state.institution_id);
  const token = useSelector((state) => state.token);
  const trendTransactions = useSelector((state) => state.trendTransactions);
  const accounts = useSelector((state) => state.accounts);
  const [showBar, setShowBar] = useState(true);
  const [showCharts, setShowCharts] = useState(false);
  const [activeBar, setActiveBar] = useState("active");
  const [activePie, setActivePie] = useState("");
  const COLORS = [
    "#3a3f44",
    "#375a7f",
    "#aaaaaa",
    "#FFBB28",
    "#FF8042",
    "#0088FE",
    "#00C49F",
    "#AF19FF",
  ];

  useEffect(() => {
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
  });
  dispatch({
    type: "SET_CURRENT_LOCATION",
    currentLocation: window.location.pathname,
  });
  const accountMasks = accounts
    ? accounts.map((account, i) => {
        return {
          value: `${accounts[i].account_id}`,
          label: `${accounts[i].name}  ...${account.mask}`,
        };
      })
    : undefined;

  const [isVisible, setIsVisible] = useState(true);
  let crossedOver = false;
  // console.log(trendTransactions.categories);
  function formatLabel(arg) {
    console.log(Number(arg.valueText).toFixed(2));
    return `${arg.argumentText}: $${arg.valueText}`;
  }
  return (
    <div className="AccountTrends">
      <h2 className="AccountTrends-title">
        Transactions for Multiple Accounts
      </h2>
      <ul style={{ listStylePosition: "inside" }}>
        <li>Positive amounts indicate money spent</li>
        <li>Negative amounts indicate money deposited into your account(s)</li>
        <li>Note: Pie Chart does not include deposited amounts</li>
      </ul>
      <button
        type="button"
        className="btn btn-secondary AccountTrends-filter-button"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible
          ? "Close Filters"
          : "Want to see trends for your transactions?"}
      </button>
      {!accounts && <div>...loading</div>}
      <SlideToggleContent isVisible={isVisible}>
        <>
          {accountMasks && (
            <>
              <FilterAllTransactionsForm setShowCharts={setShowCharts} />
            </>
          )}
        </>
      </SlideToggleContent>
      <div className="Transactions">
        {trendTransactions && showCharts && (
          <>
            {trendTransactions.transactions.length === 0 && (
              <div>
                <h5>
                  There are no transactions for this account or filter request
                </h5>
              </div>
            )}

            {trendTransactions.transactions.length !== 0 && (
              <>
                <div className="Transactions-changeCharts">
                  <button
                    className={`btn btn-primary ${activeBar}`}
                    onClick={(e) => {
                      setShowBar(true);
                      setActiveBar("active");
                      setActivePie("");
                    }}
                  >
                    {trendTransactions.labels.months
                      ? "Show Month to Month"
                      : "Show Date to Date"}
                  </button>
                  <button
                    style={{ backgroundColor: "#2C3E50" }}
                    className={`btn  ${activePie} category`}
                    onClick={() => {
                      setShowBar(false);
                      setActivePie("active");
                      setActiveBar("");
                    }}
                  >
                    Show By Category
                  </button>
                </div>
                <h3 className="Transactions-title">
                  {/* Date Periods for Date by Date*/}
                  {/* Datas in same month*/}
                  {showBar &&
                    trendTransactions.labels.dates &&
                    trendTransactions.labels.monthYear[0][0] ===
                      trendTransactions.labels.monthYear[1][0] &&
                    `${trendTransactions.labels.monthYear[0][0]} ${trendTransactions.labels.monthYear[0][1]}`}
                  {/* Dates in different months */}
                  {showBar &&
                    trendTransactions.labels.dates &&
                    trendTransactions.labels.monthYear[0][1] !==
                      trendTransactions.labels.monthYear[1][1] &&
                    `${trendTransactions.labels.monthYear[0][0]} ${trendTransactions.labels.monthYear[0][1]} - ${trendTransactions.labels.monthYear[1][0]} ${trendTransactions.labels.monthYear[1][1]} `}
                  {/* One Month */}
                  {showBar &&
                    trendTransactions.labels.dates &&
                    trendTransactions.labels.monthYear[0][1] ===
                      trendTransactions.labels.monthYear[1][1] &&
                    trendTransactions.labels.monthYear[0][0] !==
                      trendTransactions.labels.monthYear[1][0] &&
                    `${trendTransactions.labels.monthYear[0][0]} - ${trendTransactions.labels.monthYear[1][0]} ${trendTransactions.labels.monthYear[0][1]}`}
                  {/* Month Periods */}
                  {/* Month to given month except for Jan-dec */}
                  {(showBar || !showBar) &&
                    trendTransactions.labels.months &&
                    trendTransactions.labels.monthYear[0][1] ===
                      trendTransactions.labels.monthYear[1][1] &&
                    trendTransactions.labels.monthYear[0][0].concat(
                      trendTransactions.labels.monthYear[1][0]
                    ) !== "JanDec" &&
                    `${trendTransactions.labels.monthYear[0][0]} - ${trendTransactions.labels.monthYear[1][0]} ${trendTransactions.labels.monthYear[0][1]}`}
                  {/* Full Year */}
                  {(showBar || !showBar) &&
                    trendTransactions.labels.months &&
                    trendTransactions.labels.monthYear[0][1] ===
                      trendTransactions.labels.monthYear[1][1] &&
                    trendTransactions.labels.monthYear[0][0] === "Jan" &&
                    `${trendTransactions.labels.monthYear[0][1]}`}
                  {/* Month to given month if they have different years */}
                  {(showBar || !showBar) &&
                    trendTransactions.labels.months &&
                    trendTransactions.labels.monthYear[0][1] !==
                      trendTransactions.labels.monthYear[1][1] &&
                    `${trendTransactions.labels.monthYear[0][0]} ${trendTransactions.labels.monthYear[0][1]} - ${trendTransactions.labels.monthYear[1][0]} ${trendTransactions.labels.monthYear[1][1]}`}
                  {/* Date Periods for Categories*/}
                  {/* Last 7 or last 15 days */}
                  {!showBar &&
                    trendTransactions.labels.dates &&
                    trendTransactions.labels.dates.length < 15 &&
                    `${trendTransactions.labels.monthYear[0][0]} ${
                      trendTransactions.labels.dates[0].name
                    } - ${trendTransactions.labels.monthYear[1][0]} ${
                      trendTransactions.labels.dates[
                        trendTransactions.labels.dates.length - 1
                      ].name
                    } `}
                  {/* Full Month */}
                  {!showBar &&
                    trendTransactions.labels.dates &&
                    trendTransactions.labels.dates.length > 15 &&
                    `${trendTransactions.labels.monthYear[0][0]} ${trendTransactions.labels.monthYear[0][1]}  `}
                </h3>

                <div className="Graph-Table">
                  <div>
                    {showBar && (
                      <BarChart
                        width={600}
                        height={600}
                        data={
                          trendTransactions.labels.months ||
                          trendTransactions.labels.dates
                        }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis
                          dataKey="amount"
                          type="number"
                          domain={[
                            Math.ceil(
                              (trendTransactions.labels.minVal - 200) / 100
                            ) * 100,
                            Math.ceil(
                              (trendTransactions.labels.maxVal + 200) / 100
                            ) * 100,
                          ]}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="amount" fill="#375a7f" />
                      </BarChart>
                    )}
                    {!showBar && (
                      // <Pie
                      //   width={400}
                      //   height={400}
                      //   data={{
                      //     datasets: [
                      //       {
                      //         data: trendTransactions.categories.categories.map(
                      //           (category) => category.value
                      //         ),
                      //         backgroundColor: COLORS,
                      //       },
                      //     ],
                      //     labels: trendTransactions.categories.categories.map(
                      //       (category) => category.name
                      //     ),
                      //   }}
                      //   options={{
                      //     legend: {
                      //       position: "bottom",
                      //     },
                      //   }}
                      // />
                      <PieChart
                        id="pie"
                        dataSource={trendTransactions.categories.categories.map(
                          (category) => {
                            category.value = Number(category.value);
                            return category;
                          }
                        )}
                        palette="Soft Pastel"
                        resolveLabelOverlapping="shift"
                      >
                        <Size height={400} width={600} />
                        <Series argumentField="name" valueField="value">
                          <Label
                            visible={true}
                            customizeText={formatLabel}
                            format="fixedPoint"
                          >
                            <Connector visible={true} width={1} />
                          </Label>
                          {/* <SmallValuesGrouping
                            threshold={30}
                            mode="smallValueThreshold"
                          /> */}
                        </Series>
                        <Leg
                          horizontalAlignment="center"
                          verticalAlignment="bottom"
                        />
                      </PieChart>
                    )}
                  </div>
                  <div>
                    {trendTransactions && showBar && (
                      <Table>
                        <thead>
                          <tr>
                            <th scope="col">
                              {trendTransactions.labels.dates
                                ? "Dates"
                                : "Months"}
                            </th>
                            <th scope="col">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trendTransactions.labels.dates &&
                            trendTransactions.labels.dates.map(
                              (item, i, elements) => {
                                if (i < elements.length - 1 && !crossedOver) {
                                  if (item.name < elements[i + 1].name) {
                                    return (
                                      <tr key={uuid()}>
                                        <td>
                                          {`${trendTransactions.labels.monthYear[0][0]} ${item.name}`}
                                        </td>
                                        <td>${item.amount}</td>
                                      </tr>
                                    );
                                  } else {
                                    crossedOver = true;
                                    return (
                                      <tr>
                                        <td>
                                          {`${trendTransactions.labels.monthYear[0][0]} ${item.name}`}
                                        </td>
                                        <td>${item.amount}</td>
                                      </tr>
                                    );
                                  }
                                } else {
                                  return (
                                    <tr>
                                      <td>
                                        {`${trendTransactions.labels.monthYear[1][0]} ${item.name}`}
                                      </td>
                                      <td>${item.amount}</td>
                                    </tr>
                                  );
                                }
                              }
                            )}
                          {trendTransactions.labels.dates && (
                            <tr>
                              <td>
                                <b>Total</b>
                              </td>
                              <td>${trendTransactions.labels.total}</td>
                            </tr>
                          )}
                          {trendTransactions.labels.months &&
                            trendTransactions.labels.months.map(
                              (item, i, elements) => {
                                if (i < elements.length - 1 && !crossedOver) {
                                  if (item.name < elements[i + 1].name) {
                                    return (
                                      <tr>
                                        <td>{`${item.name}`}</td>
                                        <td>${item.amount}</td>
                                      </tr>
                                    );
                                  } else {
                                    crossedOver = true;
                                    return (
                                      <tr>
                                        <td>{`${item.name}`}</td>
                                        <td>${item.amount}</td>
                                      </tr>
                                    );
                                  }
                                } else {
                                  return (
                                    <tr>
                                      <td>{`${item.name}`}</td>
                                      <td>${item.amount}</td>
                                    </tr>
                                  );
                                }
                              }
                            )}
                          {trendTransactions.labels.months && (
                            <tr>
                              <td>
                                <b>Total</b>
                              </td>
                              <td>${trendTransactions.labels.total}</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    )}
                    {trendTransactions && !showBar && (
                      <Table>
                        <thead>
                          <tr>
                            <th scope="col">Categories</th>
                            <th scope="col">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trendTransactions.categories.categories &&
                            trendTransactions.categories.categories.map(
                              (item) => {
                                return (
                                  <tr>
                                    <td>{item.name}</td>
                                    <td>${item.value.toFixed(2)}</td>
                                  </tr>
                                );
                              }
                            )}
                          {trendTransactions.categories.total && (
                            <tr>
                              <td>
                                <b>Total</b>
                              </td>
                              <td>${trendTransactions.categories.total}</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AccountsTrends;
