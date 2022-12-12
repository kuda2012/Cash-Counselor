import React, { useState } from "react";
import SlideToggleContent from "./SlideToggleContent";
import FilterAllTransactionsForm from "./FilterAllTransactionsForm";

const AccountTrendsFilterer = ({ accounts, setShowCharts }) => {
  const [isVisible, setIsVisible] = useState(true);
  const accountMasks = accounts
    ? accounts.map((account, i) => {
        return {
          value: `${accounts[i].account_id}`,
          label: `${accounts[i].name}  ...${account.mask}`,
        };
      })
    : undefined;
  return (
    <>
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
    </>
  );
};
export default AccountTrendsFilterer;
