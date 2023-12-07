import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { selectInvoiceList, updateInvoice } from "../redux/invoicesSlice";
import { useDispatch, useSelector } from "react-redux";
import EditableInvoices from "../components/EditableInvoices";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const BulkEdit = () => {
  const location = useLocation();
  const invoiceList = useSelector(selectInvoiceList);
  const filteredInvoices = invoiceList.filter((invoice) => {
    return location.state.includes(invoice.invoiceNumber);
  });
  const [selectedInvoice, setSelectedInvoice] = useState(filteredInvoices);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // To update multiple invoices in invoiceList.

  const handleBulkUpdate = () => {
    selectedInvoice.forEach((invoice) => {
      const invoiceItem = invoiceList.find((item) => item.id === invoice.id);

      if (invoiceItem) {
        const invoiceId = invoiceItem.id;
        const indexToUpdate = selectedInvoice.findIndex(
          (item) => item.id === invoiceId
        );
        dispatch(
          updateInvoice({
            id: invoiceId,
            updatedInvoice: selectedInvoice[indexToUpdate],
          })
        );
      }
    });
  };

  // To calculate total amount in the invoice whenever the item's cost, quantity, discount changes.

  const handleCalculateTotal = (invoiceNumber) => {
    setSelectedInvoice((prevFormData) => {
      const indexToUpdate = selectedInvoice.findIndex(
        (item) => item.invoiceNumber === invoiceNumber
      );
      let subTotal = 0;
      prevFormData[indexToUpdate].items.forEach((item) => {
        subTotal +=
          parseFloat(item.itemPrice).toFixed(2) * parseInt(item.itemQuantity);
      });

      const taxAmount = parseFloat(
        subTotal * (prevFormData[indexToUpdate].taxRate / 100)
      ).toFixed(2);
      const discountAmount = parseFloat(
        subTotal * (prevFormData[indexToUpdate].discountRate / 100)
      ).toFixed(2);
      const total = (
        subTotal -
        parseFloat(discountAmount) +
        parseFloat(taxAmount)
      ).toFixed(2);

      const updatedInvoice = {
        ...prevFormData[indexToUpdate],
        subTotal: parseFloat(subTotal).toFixed(2),
        taxAmount,
        discountAmount,
        total,
      };

      const updatedFormData = [...prevFormData];
      updatedFormData[indexToUpdate] = updatedInvoice;

      return updatedFormData;
    });
    alert("Edited all invoices successfuly 🥳");
    navigate("/");
  };

  // To delete invoice item of invoice with invoice number === invoiceNumber

  const handleDeleteInvoiceItem = (invoiceNumber, deletedItem) => {
    setSelectedInvoice((prevData) =>
      prevData.map((invoice) =>
        invoice.invoiceNumber === invoiceNumber
          ? {
              ...invoice,
              items: invoice.items.filter(
                (item) => item.itemId !== deletedItem.itemId
              ),
            }
          : invoice
      )
    );

    // Calculate total of the invoice after deletion of the item

    handleCalculateTotal(invoiceNumber);
  };

  // To add item in invoice with invoice number === invoiceNumber

  const handleAddInvoiceItem = (invoiceNumber) => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      itemId: id,
      itemName: "",
      itemDescription: "",
      itemPrice: "1.00",
      itemQuantity: 1,
    };
    setSelectedInvoice((prevData) => {
      const updatedData = prevData.map((invoice) => {
        if (invoice.invoiceNumber === invoiceNumber) {
          return {
            ...invoice,
            items: [...invoice.items, newItem],
          };
        }
        return invoice;
      });

      return updatedData;
    });

    // Calculate total amount in invoice after addition of item

    handleCalculateTotal(invoiceNumber);
  };

  // To edit invoice item of invoice with invoice number === invoiceNumber.

  const handleEditInvoiceItem = (field, invoiceNumber, itemId, value) => {
    setSelectedInvoice((prevData) =>
      prevData.map((invoice) =>
        invoice.invoiceNumber === invoiceNumber
          ? {
              ...invoice,
              items: invoice.items.map((item) =>
                item.itemId === itemId ? { ...item, [field]: value } : item
              ),
            }
          : invoice
      )
    );

    // Calculate total whenever the item price or quantity are changed

    handleCalculateTotal(invoiceNumber);
  };

  // To change the field of invoce with invoiceNumber with the given value

  const handleOnchange = (field, invoiceNumber, value) => {
    const indexToUpdate = selectedInvoice.findIndex(
      (item) => item.invoiceNumber === invoiceNumber
    );

    if (indexToUpdate !== -1) {
      const updatedData = [...selectedInvoice];

      const dataToUpdate = updatedData[indexToUpdate];
      const newData = { ...dataToUpdate, [field]: value };
      updatedData[indexToUpdate] = newData;
      setSelectedInvoice(updatedData);
      console.log(selectedInvoice);
    }

    // Calculate total when ever the discount percentage or tax rate is changed.

    handleCalculateTotal(invoiceNumber);
  };

  return (
    <div>
      <div className="d-flex align-items-center">
        <BiArrowBack size={18} />
        <div className="fw-bold mt-1 mx-2 cursor-pointer">
          <Link to="/">
            <h5>Go Back</h5>
          </Link>
        </div>
      </div>
      {selectedInvoice.map((invoice, index) => {
        return (
          <EditableInvoices
            key={index}
            invoice={invoice}
            handleOnchange={handleOnchange}
            handleEditInvoiceItem={handleEditInvoiceItem}
            handleAddInvoiceItem={handleAddInvoiceItem}
            handleDeleteInvoiceItem={handleDeleteInvoiceItem}
          />
        );
      })}
      <Button
        variant="primary"
        onClick={handleBulkUpdate}
        className="d-block w-25 m-auto mb-5"
      >
        Update
      </Button>
    </div>
  );
};

export default BulkEdit;
