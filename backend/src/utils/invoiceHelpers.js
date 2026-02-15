const generateTableRow = (
    doc,
    y,
    item,
    storeName,
    unitCost,
    quantity,
    total,
) => {
    doc.text(item, 50, y)
        .text(storeName, 150, y)
        .text(unitCost, 265, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(total, 0, y, { align: "right" });

    generateHr(doc, y + 15);
};

const generateHeader = (doc) => {
    doc.fillColor("#444444")
        .fontSize(20)
        .text("Marketly Inc.", 110, 57)
        .fontSize(10)
        .text("Marketly Inc.", 200, 50, { align: "right" })
        .text("Online Platform", 200, 65, { align: "right" })
        .text("Multi-Vendor E-Commerce", 200, 80, { align: "right" })
        .moveDown();
};

const generateCustomerInformation = (doc, invoice) => {
    const {
        order: {
            orderId,
            paymentId,
            shippingAddress: { city, state, country, fullname, addressLine1 },
            createdAt,
        },
    } = invoice;

    generateHr(doc, 145);

    doc.fillColor("#444444").fontSize(20).text("User Info", 50, 160).moveDown();

    let customerInformationTop = 200;

    doc.fontSize(13)
        .text("Order ID:", 50, customerInformationTop)
        .text("Payment ID:", 50, customerInformationTop + 20)
        .text("Invoice Date:", 50, customerInformationTop + 40)
        .font("Helvetica-Bold")
        .text(orderId, 150, customerInformationTop)
        .text(paymentId, 150, customerInformationTop + 20)
        .text(formatDate(new Date(createdAt)), 150, customerInformationTop + 40)
        .moveDown();

    doc.fillColor("#444444")
        .fontSize(20)
        .font("Helvetica")
        .text("Shipping Info", 50, 290)
        .moveDown();

    customerInformationTop = 330;

    doc.fontSize(13)
        .text("Fullname:", 50, customerInformationTop)
        .text("City:", 50, customerInformationTop + 20)
        .text("State:", 50, customerInformationTop + 40)
        .text("Country:", 50, customerInformationTop + 60)
        .text("Address Line:", 50, customerInformationTop + 80)
        .font("Helvetica-Bold")
        .text(fullname, 150, customerInformationTop)
        .text(city, 150, customerInformationTop + 20)
        .text(state, 150, customerInformationTop + 40)
        .text(country, 150, customerInformationTop + 60)
        .text(addressLine1, 150, customerInformationTop + 80);

    generateHr(doc, 427);
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

module.exports = {
    generateTableRow,
    generateHeader,
    generateCustomerInformation,
    generateHr,
    formatDate,
};
