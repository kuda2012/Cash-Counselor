import React from "react";
import { render, fireEvent } from "../test-utils";
import Login from "../../components/Login";
import Signup from "../../components/Signup";
import Account from "../../components/Account";
import "@testing-library/jest-dom";
import AccountTrends from "../../components/AccountsTrends";
import DeleteUser from "../../components/DeleteUser";
import EditPassword from "../../components/EditPassword";
import EditUsername from "../../components/EditUsername";
import FilterTransactionsForm from "../../components/FilterTransactionsForm";
import FilterAllTransactionsForm from "../../components/FilterAllTransactionsForm";
import IdleModal from "../../components/IdleModal";
import LinkLoggedIn from "../../components/LinkLoggedIn";
import NavBar from "../../components/NavBar";
import { BrowserRouter } from "react-router-dom";
// Component to be tested

describe("<Login />", () => {
  describe("render()", () => {
    test("renders the login component", () => {
      const { asFragment } = render(<Login />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});

describe("<Signup />", () => {
  describe("render()", () => {
    test("renders the Signup component", () => {
      const { asFragment } = render(<Signup />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});

describe("<Login /> And <Signup/>", () => {
  describe("onClick()", () => {
    test("successfully calls the onClick handler and toggles between the two components", () => {
      const { getAllByText, getByText } = render(<Login />);
      const signupButton = getByText("Signup");
      const titles = getAllByText("Login");
      expect(titles[1]).toBeInTheDocument();
      fireEvent.click(signupButton);
      expect(titles[1]).not.toBeInTheDocument();
    });
  });
});
describe("<Account />", () => {
  describe("render()", () => {
    test("renders the Account component", () => {
      const { asFragment } = render(<Account test={true} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
describe("<AccountTrends />", () => {
  describe("render()", () => {
    test("renders the AccountTrends component", () => {
      const { asFragment } = render(<AccountTrends />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});

describe("<DeleteUser />", () => {
  describe("render()", () => {
    test("renders the Delete User component", () => {
      const { asFragment } = render(<DeleteUser />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
describe("<EditPassword />", () => {
  describe("render()", () => {
    test("renders the Edit Password component", () => {
      const { asFragment } = render(<EditPassword />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
describe("<EditUsername />", () => {
  describe("render()", () => {
    test("renders the Edit Username component", () => {
      const { asFragment } = render(<EditUsername />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
describe("<FilterTransactions />", () => {
  describe("render()", () => {
    test("renders the Filter Transactions component", () => {
      const { asFragment } = render(<FilterTransactionsForm test={true} />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
describe("<FilterAllTransactions />", () => {
  describe("render()", () => {
    test("renders the Filter All Transactions component", () => {
      const { asFragment } = render(<FilterAllTransactionsForm />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
describe("<IdleModal />", () => {
  describe("render()", () => {
    test("renders the IdleModal component", () => {
      const { asFragment } = render(<IdleModal />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
describe("<LinkLoggedIn />", () => {
  describe("render()", () => {
    test("renders the LinkLoggedIn component", () => {
      const { asFragment } = render(<LinkLoggedIn />);
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
describe("<Navbar />", () => {
  describe("render()", () => {
    test("renders the Navbar component", () => {
      const { asFragment } = render(
        <BrowserRouter>
          <NavBar />
        </BrowserRouter>
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
