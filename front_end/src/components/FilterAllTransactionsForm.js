import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "reactstrap";
import Select from "react-select";
import { setTrends } from "../helpers/actionCreators";
import "../styles/FilterAllTransactionsForm.css";
import { timePeriods } from "../TimePeriods";

const FilterTransactionsForm = ({ setShowCharts }) => {
  const _token = useSelector((state) => state._token);
  const access_token = useSelector((state) => state.access_token);
  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts);

  const accountMasks = accounts
    ? accounts.map((account, i) => {
        return {
          value: `${accounts[i].account_id}`,
          label: `${accounts[i].name}  ...${account.mask}`,
        };
      })
    : undefined;
  const INITIAL_STATE = {
    amount_floor: "",
    amount_ceiling: "",
    account_ids: [],
    periodControlled: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showReset, setShowReset] = useState(false);
  const handleChange = (e) => {
    let name;
    let value;
    if (e && !e.target) {
      if (!e.label) {
        setFormData((data) => ({
          ...data,
          account_ids: e.map((account) => account.value),
        }));
      } else {
        setFormData((data) => ({
          ...data,
          period: e.value,
          periodControlled: e.value,
        }));
      }
    } else if (e === null) {
    } else if (e.target) {
      name = e.target.name;
      value = e.target.value;
      setFormData((data) => ({ ...data, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (document.getElementsByClassName("select__single-value").length === 0) {
      alert("Select time period");
      return;
    }

    if (
      document.getElementsByClassName("select__multi-value").length === 0 &&
      formData.account_ids.length !== 0
    ) {
      dispatch(
        setTrends(_token, access_token, { ...formData, account_ids: [] })
      );
      setShowCharts(true);
      return;
    }
    setShowCharts(true);
    setShowReset(true);
    dispatch(setTrends(_token, access_token, formData));
  };
  const reset = () => {
    window.location.href = "/accounts/trends";
  };
  return (
    <form onSubmit={handleSubmit} className="FilterAllTransactionsForm">
      <div className="FilterAllTransactions">
        <div className="FilterAllTransactions-top">
          <div id="FilterAllTransactions-top-left">
            <label htmlFor="accountMask">Select Time Period:</label>
            <Select
              isClearable={true}
              options={timePeriods}
              name="time_period"
              onChange={handleChange}
              classNamePrefix="select"
            />

            <input
              tabIndex={-1}
              autoComplete="off"
              style={{ opacity: 0, height: 0 }}
              value={formData.period}
              required={true}
            />
          </div>
          <div id="FilterAllTransactions-top-right">
            <label htmlFor="accountMask" id="accountMask-label">
              Select an Account: (Default selects all accounts)
            </label>
            <Select
              isMulti
              name="account_ids"
              onChange={handleChange}
              options={accountMasks}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
        </div>
        <div className="FilterAllTransactions-bottom">
          <div className="FilterAllTransactions-bottom-label-input">
            <label htmlFor="amount_floor">Lowest Amount: </label>
            <Input
              type="number"
              id="amount_floor"
              name="amount_floor"
              step=".01"
              onChange={handleChange}
              value={formData.amount_floor}
            />
          </div>
          <div className="FilterAllTransactions-bottom-label-input">
            <label htmlFor="amount_ceiling">Highest Amount: </label>
            <Input
              type="number"
              id="amount_ceiling"
              name="amount_ceiling"
              step=".01"
              onChange={handleChange}
              value={formData.amount_ceiling}
            />
          </div>
        </div>
        <div>
          <Button color="primary" className="FilterAllTransactions-submit">
            Submit
          </Button>
          {showReset && (
            <Button
              color="secondary"
              className="FilterAllTransactions-reset"
              type="button"
              onClick={() => reset()}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};
export default FilterTransactionsForm;
