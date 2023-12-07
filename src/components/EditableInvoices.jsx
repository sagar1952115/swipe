import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import InputGroup from "react-bootstrap/InputGroup";

const EditableInvoices = ({
  invoice,
  handleOnchange,
  handleEditInvoiceItem,
  handleAddInvoiceItem,
  handleDeleteInvoiceItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { invoiceNumber } = invoice;

  const handleEdit = (name, value) => {
    handleOnchange(name, invoiceNumber, value);
  };

  const onItemizedItemEdit = (e, itemId) => {
    console.log("This is console", e.target.name, e.target.value);
    handleEditInvoiceItem(e.target.name, invoiceNumber, itemId, e.target.value);
  };

  const addItemRow = () => {
    handleAddInvoiceItem(invoiceNumber);
  };

  const deleteItemRow = (item) => {
    handleDeleteInvoiceItem(invoiceNumber, item);
  };

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Form onSubmit={openModal}>
        <Row>
          <Col md={8} lg={9}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4">
              <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                <div className="d-flex flex-column">
                  <div className="d-flex flex-column">
                    <div className="mb-2">
                      <span className="fw-bold">Current&nbsp;Date:&nbsp;</span>
                      <span className="current-date">
                        {invoice.currentDate}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold d-block me-2">Due&nbsp;Date:</span>
                    <Form.Control
                      type="date"
                      value={invoice.dateOfIssue}
                      name="dateOfIssue"
                      onChange={(e) =>
                        handleEdit(e.target.name, e.target.value)
                      }
                      style={{ maxWidth: "150px" }}
                      required
                    />
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold me-2">
                    Invoice&nbsp;Number:&nbsp;
                  </span>
                  <Form.Control
                    type="number"
                    value={invoice.invoiceNumber}
                    name="invoiceNumber"
                    onChange={(e) => handleEdit(e.target.name, e.target.value)}
                    min="1"
                    style={{ maxWidth: "70px" }}
                    required
                  />
                </div>
              </div>
              <hr className="my-4" />
              <Row className="mb-5">
                <Col>
                  <Form.Label className="fw-bold">Bill to:</Form.Label>
                  <Form.Control
                    placeholder="Who is this invoice to?"
                    rows={3}
                    // value={invoice.billTo}
                    value={invoice.billTo}
                    type="text"
                    name="billTo"
                    className="my-2"
                    onChange={(e) => handleEdit(e.target.name, e.target.value)}
                    autoComplete="name"
                    required
                  />
                  <Form.Control
                    placeholder="Email address"
                    value={invoice.billToEmail}
                    type="email"
                    name="billToEmail"
                    className="my-2"
                    onChange={(e) => handleEdit(e.target.name, e.target.value)}
                    autoComplete="email"
                    required
                  />
                  <Form.Control
                    placeholder="Billing address"
                    value={invoice.billToAddress}
                    type="text"
                    name="billToAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={(e) => handleEdit(e.target.name, e.target.value)}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Bill from:</Form.Label>
                  <Form.Control
                    placeholder="Who is this invoice from?"
                    rows={3}
                    value={invoice.billFrom}
                    type="text"
                    name="billFrom"
                    className="my-2"
                    onChange={(e) => handleEdit(e.target.name, e.target.value)}
                    autoComplete="name"
                    required
                  />
                  <Form.Control
                    placeholder="Email address"
                    value={invoice.billFromEmail}
                    type="email"
                    name="billFromEmail"
                    className="my-2"
                    onChange={(e) => handleEdit(e.target.name, e.target.value)}
                    autoComplete="email"
                    required
                  />
                  <Form.Control
                    placeholder="Billing address"
                    value={invoice.billFromAddress}
                    type="text"
                    name="billFromAddress"
                    className="my-2"
                    autoComplete="address"
                    onChange={(e) => handleEdit(e.target.name, e.target.value)}
                    required
                  />
                </Col>
              </Row>
              <InvoiceItem
                onItemizedItemEdit={onItemizedItemEdit}
                onRowAdd={addItemRow}
                onRowDel={deleteItemRow}
                currency={invoice.currency}
                items={invoice.items}
              />
              <Row className="mt-4 justify-content-end">
                <Col lg={6}>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <span className="fw-bold">Subtotal:</span>
                    <span>
                      {invoice.currency}
                      {invoice.subTotal}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Discount:</span>
                    <span>
                      <span className="small">
                        ({invoice.discountRate || 0}%)
                      </span>
                      {invoice.currency}
                      {invoice.discountAmount || 0}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Tax:</span>
                    <span>
                      <span className="small">({invoice.taxRate || "0"}%)</span>
                      {invoice.currency}
                      {invoice.taxAmount || 0}
                    </span>
                  </div>
                  <hr />
                  <div
                    className="d-flex flex-row align-items-start justify-content-between"
                    style={{ fontSize: "1.125rem" }}
                  >
                    <span className="fw-bold">Total:</span>
                    <span className="fw-bold">
                      {invoice.currency}
                      {invoice.total || 0}0
                    </span>
                  </div>
                </Col>
              </Row>
              <hr className="my-4" />
              <Form.Label className="fw-bold">Notes:</Form.Label>
              <Form.Control
                placeholder="Thanks for your business!"
                name="notes"
                value={invoice.notes}
                onChange={(e) => handleEdit(e.target.name, e.target.value)}
                as="textarea"
                className="my-2"
                rows={1}
              />
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <div className="sticky-top pt-md-3 pt-xl-4">
              <Button variant="primary" type="submit" className="d-block w-100">
                Review Invoice
              </Button>
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
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Tax rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control
                    name="taxRate"
                    type="number"
                    value={invoice.taxRate}
                    onChange={(e) => handleEdit(e.target.name, e.target.value)}
                    className="bg-white border"
                    placeholder="0.0"
                    min="0.00"
                    step="0.01"
                    max="100.00"
                  />
                  <InputGroup.Text className="bg-light fw-bold text-secondary small">
                    %
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Discount rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control
                    name="discountRate"
                    type="number"
                    value={invoice.discountRate}
                    onChange={(e) => handleEdit(e.target.name, e.target.value)}
                    className="bg-white border"
                    placeholder="0.0"
                    min="0.00"
                    step="0.01"
                    max="100.00"
                  />
                  <InputGroup.Text className="bg-light fw-bold text-secondary small">
                    %
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EditableInvoices;
