import { render, screen } from "@testing-library/react";
import TicketFilter from "./ticket.filter";

const mockUsers = [
  { id: 1, name: "Nhan" },
  { id: 2, name: "Nguyen" },
];

describe("TicketFilter Component", () => {
  it("renders status filter buttons correctly", () => {
    const mockStatusChange = jest.fn();
    const mockUserChange = jest.fn();

    render(
      <TicketFilter
        selectedStatus={null}
        onStatusChange={mockStatusChange}
        users={mockUsers}
        selectedUser={null}
        onUserChange={mockUserChange}
      />
    );

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Incomplete")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("All Users")).toBeInTheDocument();
    expect(screen.getByText("Unassigned")).toBeInTheDocument();
    expect(screen.getByText("Nhan Nguyen")).toBeInTheDocument();
    expect(screen.getByText("Vo Thien")).toBeInTheDocument();
  });
});
