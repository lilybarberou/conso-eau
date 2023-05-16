const fs = require('fs');
const PDFDocument = require('pdfkit');

export default function createInvoice(invoice, path) {
    let doc = new PDFDocument({ size: 'A4', margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);

    doc.end();
    doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
    doc.fillColor('#444444')
        .fontSize(20)
        .text('Water Inc.', 50, 57)
        .fontSize(10)
        .text('Water Inc.', 200, 50, { align: 'right' })
        .text('20 rue des prairies', 200, 65, { align: 'right' })
        .text('68200, Mulhouse', 200, 80, { align: 'right' })
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc.fillColor('#444444').fontSize(20).text('Facture', 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc.fontSize(10)
        .font('Helvetica')
        .text('Date de facture :', 50, customerInformationTop)
        .text(formatDate(new Date()), 150, customerInformationTop)
        .text('Montant :', 50, customerInformationTop + 15)
        .text(invoice.items[0].amount + '€', 150, customerInformationTop + 15)

        .font('Helvetica-Bold')
        .text(invoice.shipping.name, 300, customerInformationTop)
        .font('Helvetica')
        .text(invoice.shipping.address, 300, customerInformationTop + 15)
        .text(invoice.shipping.postal_code + ', ' + invoice.shipping.city, 300, customerInformationTop + 30)
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;

    doc.font('Helvetica-Bold');
    generateTableRow(doc, invoiceTableTop, 'Libellé', 'Quantité', 'Total');
    generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');

    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(doc, position, item.title, `${item.quantity}L`, invoice.items[0].amount + '€');

        generateHr(doc, position + 20);
    }

    const duePosition = invoiceTableTop + (i + 1) * 30;
    doc.font('Helvetica-Bold');
    generateTableRow(doc, duePosition, '', 'Montant total', invoice.items[0].amount + '€');
    doc.font('Helvetica');
}

function generateTableRow(doc, y, title, quantity, lineTotal) {
    doc.fontSize(10).text(title, 50, y).text(quantity, 370, y, { width: 90, align: 'right' }).text(lineTotal, 0, y, { align: 'right' });
}

function generateHr(doc, y) {
    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return day + '/' + month + '/' + year;
}
