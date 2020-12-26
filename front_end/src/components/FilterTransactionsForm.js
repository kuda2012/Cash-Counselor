import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button, Input } from "reactstrap";
import Select from "react-select";
import { getTransactions } from "../helpers/actionCreators";
import "../styles/FilterTransactionsForm.css";

const FilterTransactionsForm = ({ setCurrentPage, test }) => {
  // const { account_id } = test || useParams();
  const { account_id } = useParams();
  const _token = useSelector((state) => state._token);
  const access_token = useSelector((state) => state.access_token);
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const INITIAL_STATE = {
    start_date: "",
    end_date: "",
    name: "",
    amount_floor: "",
    amount_ceiling: "",
    account_id,
    categoriesControlled: [],
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showReset, setShowReset] = useState(false);
  const handleChange = (e) => {
    let name;
    let value;
    if (e && !e.target) {
      setFormData((data) => ({
        ...data,
        categories: e.map((category) => category.value),
        categoriesControlled: categories.map((category) => {
          if (e.map((category) => category.value).includes(category.value)) {
            return category;
          }
        }),
      }));
    } else if (e === null) {
    } else if (e.target) {
      name = e.target.name;
      value = e.target.value;
      setFormData((data) => ({ ...data, [name]: value }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (_token && access_token && account_id) {
      setShowReset(true);
      dispatch(getTransactions(_token, access_token, account_id, formData));
      let paginationButtons = document.querySelectorAll(".pagination a");
      paginationButtons[1].addEventListener("click", (event) => {
        setCurrentPage(0);
      });
      paginationButtons[1].click();
    }
  };
  const reset = () => {
    window.location.href = `/${account_id}`;
    // setShowReset(false);
    // dispatch(getTransactions(_token, access_token, account_id));
    // setFormData(INITIAL_STATE);
    // let paginationButtons = document.querySelectorAll(".pagination a");
    // paginationButtons[1].addEventListener("click", (event) => {
    //   setCurrentPage(0);
    // });
    // paginationButtons[1].click();
  };

  return (
    <form onSubmit={handleSubmit} className="FilterTransactionsForm">
      <div className="FilterTransactions">
        <div className="FilterTransactions-top">
          <div>
            <label htmlFor="name">Transaction Name:</label>
            <Input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              value={formData.name}
            />
            {/* <input /> */}
          </div>
          <div>
            <label htmlFor="start_date">Between Dates (Begin): </label>
            <Input
              type="date"
              id="start_date"
              name="start_date"
              onChange={handleChange}
              value={formData.start_date}
            />
          </div>
          <div>
            <label htmlFor="end_date">Between Dates (End): </label>
            <Input
              type="date"
              id="end_date"
              name="end_date"
              onChange={handleChange}
              value={formData.end_date}
            />
          </div>
        </div>
        <div className="FilterTransactions-bottom">
          <div>
            <label
              htmlFor="categories"
              className="FilterTransactions-bottom-labels"
            >
              Categories
            </label>
            <Select
              isMulti
              isClearable={true}
              options={categories}
              id="categories"
              name="categories"
              onChange={handleChange}
              classNamePrefix="select"
            />
          </div>
          <div>
            <label
              htmlFor="amount_floor"
              className="FilterTransactions-bottom-labels"
            >
              Lowest Amount:
            </label>
            <Input
              type="number"
              id="amount_floor"
              name="amount_floor"
              step=".01"
              onChange={handleChange}
              value={formData.amount_floor}
            />
          </div>
          <div>
            <label
              htmlFor="amount_ceiling"
              className="FilterTransactions-bottom-labels"
            >
              Highest Amount:{" "}
            </label>
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
          <Button color="primary" className="FilterTransactions-submit">
            Submit
          </Button>
          {showReset && (
            <Button
              color="secondary"
              className="FilterTransactions-reset"
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
