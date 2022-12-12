import React, { useEffect, useState } from "react";
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
  Legend as Leg,
} from "devextreme-react/pie-chart";
import { Table } from "reactstrap";
import AccountTrendsFilterer from "./AccountTrendsFilterer";
import { graphTitles } from "../helpers/graphTitles.js";

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

  let crossedOver = false;
  function formatLabel(arg) {
    return `${arg.argumentText}: $${arg.valueText}`;
  }
  return (
    <div className="AccountTrends">
      <AccountTrendsFilterer
        accounts={accounts}
        setShowCharts={setShowCharts}
      />
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
                  {graphTitles(showBar, trendTransactions)}
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
