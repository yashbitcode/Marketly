const generateTableRow = (
    doc,
    y,
    item,
    storeName,
    unitCost,
    quantity,
    total,
    isHeader = false
) => {
    doc.fontSize(isHeader ? 10 : 9)
       .font(isHeader ? "Helvetica-Bold" : "Helvetica")
       .fillColor(isHeader ? "#2C3E50" : "#444444");

    doc.text(item, 50, y, { width: 140, height: 15, ellipsis: true })
        .text(storeName, 195, y, { width: 100, height: 15, ellipsis: true })
        .text(unitCost, 300, y, { width: 80, align: "right" })
        .text(quantity, 385, y, { width: 50, align: "right" })
        .text(total, 440, y, { width: 110, align: "right" });

    if (!isHeader) {
        generateHr(doc, y + 15);
    } else {
        doc.lineWidth(1.5);
        generateHr(doc, y + 20);
        doc.lineWidth(1);
    }
};

const generateHeader = (doc) => {
    doc.fillColor("#2C3E50")
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("Marketly", 50, 45)
        .fillColor("#7F8C8D")
        .fontSize(10)
        .font("Helvetica")
        .text("Marketly Inc.", 200, 50, { align: "right" })
        .text("123 Business Avenue", 200, 65, { align: "right" })
        .text("support@marketly.com", 200, 80, { align: "right" })
        .moveDown();
};

const generateCustomerInformation = (doc, invoice) => {
    const {
            orderId,
            paymentId,
            shippingAddress: { city, state, country, fullname, addressLine1 },
            createdAt,
    } = invoice;

    doc.fillColor("#2C3E50")
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("Invoice Information", 50, 130);

    generateHr(doc, 155);

    const customerInformationTop = 175;

    doc.fontSize(10)
        .fillColor("#7F8C8D")
        .font("Helvetica")
        .text("Order ID:", 50, customerInformationTop)
        .text("Payment ID:", 50, customerInformationTop + 15)
        .text("Invoice Date:", 50, customerInformationTop + 30)
        .fillColor("#2C3E50")
        .font("Helvetica-Bold")
        .text(orderId, 150, customerInformationTop)
        .text(paymentId || "N/A", 150, customerInformationTop + 15)
        .text(formatDate(new Date(createdAt)), 150, customerInformationTop + 30)
        
        .fillColor("#7F8C8D")
        .font("Helvetica")
        .text("Bill To:", 330, customerInformationTop)
        .fillColor("#2C3E50")
        .font("Helvetica-Bold")
        .text(fullname, 400, customerInformationTop)
        .font("Helvetica")
        .text(`${addressLine1}`, 400, customerInformationTop + 15)
        .text(`${city}, ${state}`, 400, customerInformationTop + 30)
        .text(country, 400, customerInformationTop + 45);

    generateHr(doc, 250);
};

const generateHr = (doc, y) => {
    doc.strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
};

const formatDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
};

export {
    generateTableRow,
    generateHeader,
    generateCustomerInformation,
    generateHr,
    formatDate,
};
