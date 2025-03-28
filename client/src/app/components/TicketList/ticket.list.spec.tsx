import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TicketList from "./ticket.list";
import { TicketProvider } from "../../context/ticket.context";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockTickets = [
  { id: 1, description: "Test ticket 1", completed: false, assigneeId: 1 },
  { id: 2, description: "Test ticket 2", completed: true, assigneeId: null },
];

const mockUsers = [{ id: 1, name: "John Doe" }];

jest.mock("../../context/ticket.context", () => ({
  ...jest.requireActual("../../context/ticket.context"),
  useTickets: () => ({
    tickets: mockTickets,
    users: mockUsers,
    loading: false,
    error: null,
    fetchTickets: jest.fn(),
    completeTicket: jest.fn(),
    incompleteTicket: jest.fn(),
    filterTicketsByCompletion: (status: boolean | null) => {
      if (status === null) return mockTickets;
      return mockTickets.filter((ticket) => ticket.completed === status);
    },
  }),
}));

describe("TicketList Component", () => {
  const renderTicketList = () => {
    return render(
      <MemoryRouter>
        <TicketProvider>
          <TicketList />
        </TicketProvider>
      </MemoryRouter>
    );
  };

  it("displays tickets and navigates to detail page when clicked", async () => {
    renderTicketList();

    expect(screen.getByText("Test ticket 1")).toBeInTheDocument();
    expect(screen.getByText("Test ticket 2")).toBeInTheDocument();

    expect(screen.getByText("Incomplete")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();

    expect(screen.getByText("Assigned to: John Doe")).toBeInTheDocument();
    expect(screen.getByText("Unassigned")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Test ticket 1"));

    expect(mockNavigate).toHaveBeenCalledWith("/ticket/1");

    fireEvent.click(screen.getByText("Add New Ticket"));

    expect(mockNavigate).toHaveBeenCalledWith("/ticket/new");
  });
});
