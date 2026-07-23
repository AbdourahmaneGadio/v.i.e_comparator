import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(cleanup);

const getBodyRows = () =>
  within(screen.getByRole("table")).getAllByRole("row").slice(1);

const getFirstCountryName = () =>
  within(getBodyRows()[0]).getAllByRole("cell")[1].textContent;

describe("V.I.E Comparator", () => {
  it("shows ten countries per page by default", () => {
    render(<App />);

    expect(getBodyRows()).toHaveLength(10);
    expect(screen.getByText("Page 1 of 14")).toBeInTheDocument();
  });

  it("filters countries by name and zone", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole("searchbox"), "Allemagne");
    expect(screen.getByText("ALLEMAGNE (Berlin)")).toBeInTheDocument();
    expect(screen.queryByText("AFGHANISTAN")).not.toBeInTheDocument();

    await user.clear(screen.getByRole("searchbox"));
    await user.selectOptions(screen.getByRole("combobox"), "AFRIQUE DU NORD");

    expect(screen.getByText("ALGERIE (autres villes)")).toBeInTheDocument();
    expect(screen.getByText("EGYPTE")).toBeInTheDocument();
    expect(screen.queryByText("ALLEMAGNE (Berlin)")).not.toBeInTheDocument();
  });

  it("sorts the table when a column header is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    const nameHeader = screen.getByRole("button", { name: /Name/ });
    await user.click(nameHeader);
    expect(getFirstCountryName()).toBe("LIBERIA");

    await user.click(nameHeader);
    expect(getFirstCountryName()).toBe("AFGHANISTAN");
  });

  it("moves to the next page", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Page 2 of 14")).toBeInTheDocument();
    expect(getFirstCountryName()).toBe("ANDORRE");
  });
});
