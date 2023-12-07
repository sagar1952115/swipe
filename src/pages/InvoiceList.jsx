import React, { useState } from "react";
import { Button, Card, Col, Row, Table, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import InvoiceModal from "../components/InvoiceModal";
import { useNavigate } from "react-router-dom";
import { useInvoiceListData } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { deleteInvoice } from "../redux/invoicesSlice";

const InvoiceList = () => {
  const { invoiceList, getOneInvoice } = useInvoiceListData();
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const navigate = useNavigate();
  console.log(invoiceList);
  const handleCopyClick = () => {
    const invoice = getOneInvoice(copyId);
    if (!invoice) {
      alert("Please enter the valid invoice id.");
    } else {
      navigate(`/create/${copyId}`);
    }
  };
  const handleBulkEdit = () => {
    if (selectedInvoices.length === 0) {
      alert("Select at least one invoice");
      return;
    }
    navigate("edit/bulk", { state: selectedInvoices });
  };
  return (
    <Row>
      <Col className="mx-auto" xs={12} md={8} lg={9}>
        <h3 className="fw-bold pb-2 pb-md-4 text-center">Swipe Assignment</h3>
        <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
          {isListEmpty ? (
            <div className="d-flex flex-column align-items-center">
              <h3 className="fw-bold pb-2 pb-md-4">No invoices present</h3>
              <Link to="/create">
                <Button variant="primary">Create Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column">
              <div className="d-flex flex-row align-items-center justify-content-between">
                <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
                <Link to="/create">
                  <Button variant="primary mb-2 mb-md-4">Create Invoice</Button>
                </Link>
                {/* <Link to="/create"> */}
                {isBulkEditing ? (
                  <Button
                    onClick={() => setIsBulkEditing(!isBulkEditing)}
                    variant="danger mb-2 mb-md-4"
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsBulkEditing(!isBulkEditing)}
                    variant="primary mb-2 mb-md-4"
                  >
                    Bulk Edit
                  </Button>
                )}
                {/* </Link> */}

                <div className="d-flex gap-2">
                  <Button variant="dark mb-2 mb-md-4" onClick={handleCopyClick}>
                    Copy Invoice
                  </Button>

                  <input
                    type="text"
                    value={copyId}
                    onChange={(e) => setCopyId(e.target.value)}
                    placeholder="Enter Invoice ID to copy"
                    className="bg-white border"
                    style={{
                      height: "50px",
                    }}
                  />
                </div>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    {isBulkEditing && (
                      <th className="p-1 m-2">
                        <Form.Check
                          type="checkbox"
                          label="Select All"
                          checked={
                            selectedInvoices.length === invoiceList.length
                          }
                          onChange={() => {
                            setSelectedInvoices(
                              selectedInvoices.length === invoiceList.length
                                ? []
                                : invoiceList.map(
                                    (invoice) => invoice.invoiceNumber
                                  )
                            );
                          }}
                        />
                      </th>
                    )}
                    <th>Invoice No.</th>
                    <th>Bill To</th>
                    <th>Due Date</th>
                    <th>Total Amt.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceList.map((invoice) => (
                    <InvoiceRow
                      isBulkEditing={isBulkEditing}
                      setSelectedInvoices={setSelectedInvoices}
                      selectedInvoices={selectedInvoices}
                      key={invoice.id}
                      invoice={invoice}
                      navigate={navigate}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          {isBulkEditing && (
            <Button variant="dark mb-2 mb-md-4" onClick={handleBulkEdit}>
              Continue
            </Button>
          )}
        </Card>
      </Col>
    </Row>
  );
};

const InvoiceRow = ({
  invoice,
  navigate,
  setSelectedInvoices,
  isBulkEditing,
  selectedInvoices,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteClick = (invoiceId) => {
    dispatch(deleteInvoice(invoiceId));
  };

  const handleEditClick = () => {
    navigate(`/edit/${invoice.id}`);
  };

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <tr>
      {isBulkEditing && (
        <td className="p-2 m-2">
          <Form.Check
            type="checkbox"
            // label={invoice.invoiceNumber}
            checked={selectedInvoices.includes(invoice.invoiceNumber)}
            onChange={(event) => {
              if (!event.target.checked) {
                setSelectedInvoices(
                  selectedInvoices.filter((inv) => {
                    return inv !== invoice.invoiceNumber;
                  })
                );
              } else {
                setSelectedInvoices([
                  ...selectedInvoices,
                  invoice.invoiceNumber,
                ]);
              }
            }}
          />
        </td>
      )}
      <td>{invoice.invoiceNumber}</td>
      <td className="fw-normal">{invoice.billTo}</td>
      <td className="fw-normal">{invoice.dateOfIssue}</td>
      <td className="fw-normal">
        {invoice.currency}
        {invoice.total}
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="outline-primary" onClick={handleEditClick}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiSolidPencil />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="danger" onClick={() => handleDeleteClick(invoice.id)}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiTrash />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="secondary" onClick={openModal}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BsEyeFill />
          </div>
        </Button>
      </td>
      <InvoiceModal
        showModal={isOpen}
        closeModal={closeModal}
        info={{
          isOpen,
          id: invoice.id,
          currency: invoice.currency,
          currentDate: invoice.currentDate,
          invoiceNumber: invoice.invoiceNumber,
          dateOfIssue: invoice.dateOfIssue,
          billTo: invoice.billTo,
          billToEmail: invoice.billToEmail,
          billToAddress: invoice.billToAddress,
          billFrom: invoice.billFrom,
          billFromEmail: invoice.billFromEmail,
          billFromAddress: invoice.billFromAddress,
          notes: invoice.notes,
          total: invoice.total,
          subTotal: invoice.subTotal,
          taxRate: invoice.taxRate,
          taxAmount: invoice.taxAmount,
          discountRate: invoice.discountRate,
          discountAmount: invoice.discountAmount,
        }}
        items={invoice.items}
        currency={invoice.currency}
        subTotal={invoice.subTotal}
        taxAmount={invoice.taxAmount}
        discountAmount={invoice.discountAmount}
        total={invoice.total}
      />
    </tr>
  );
};

export default InvoiceList;
