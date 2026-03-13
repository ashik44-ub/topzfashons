import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order) => {
    const doc = new jsPDF();

    // ১. ব্র্যান্ডিং ও টাইটেল
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text("TOPZ FASHIONS", 105, 15, { align: "center" }); 
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text("Premium Quality Clothing", 105, 20, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 25, 196, 25); // ডিভাইডার লাইন

    // ২. কাস্টমার এবং শিপিং ইনফো
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text("Order Details:", 14, 40);
    doc.setFont(undefined, 'normal');
    doc.text(`Order ID: ${order._id}`, 14, 46);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 52);
    doc.text(`Status: ${order.status?.toUpperCase()}`, 14, 58);
    doc.text(`Transaction ID: ${order.transactionId || 'N/A'}`, 14, 64);

    doc.setFont(undefined, 'bold');
    doc.text("Shipping To:", 130, 40);
    doc.setFont(undefined, 'normal');
    
    // নাম
    doc.text(`${order.shippingInfo?.firstName} ${order.shippingInfo?.lastName}`, 130, 46);
    // মোবাইল নাম্বার
    doc.text(`Phone: ${order.shippingInfo?.phone}`, 130, 52);
    // আপনার রিকোয়েস্ট অনুযায়ী ইমেইল ফোন নাম্বারের নিচে
    doc.text(`Email: ${order.email || 'admin@gmail.com'}`, 130, 58);
    // অ্যাড্রেস সবার শেষে
    doc.text(`Address: ${order.shippingInfo?.address}, ${order.shippingInfo?.district}`, 130, 64);

    // ৩. প্রোডাক্ট টেবিল ডাটা তৈরি
    const tableColumn = ["Product Name", "Size", "Qty", "Unit Price", "Total"];
    const tableRows = order.products.map(p => {
        const unitPrice = p.price || 0;
        const qty = p.quantity || 0;
        const total = unitPrice * qty;

        return [
            p.name || "Unknown Product",
            p.size?.toUpperCase() || 'N/A',
            qty,
            `Tk. ${unitPrice.toLocaleString()}`,
            `Tk. ${total.toLocaleString()}`
        ];
    });

    // ৪. টেবিল রেন্ডার করা
    autoTable(doc, {
        startY: 75,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [40, 40, 40], fontSize: 10, halign: 'center' },
        columnStyles: {
            2: { halign: 'center' },
            3: { halign: 'right' },
            4: { halign: 'right' }
        },
        styles: { fontSize: 9 },
    });

    // ৫. ক্যালকুলেশন সেকশন
    let currentY = doc.lastAutoTable.finalY + 10;
    const rightAlignX = 196;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    // সাবটোটাল
    const subtotal = order.products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    doc.text(`Subtotal: Tk. ${subtotal.toLocaleString()}`, rightAlignX, currentY, { align: "right" });
    currentY += 6;

    // শিপিং চার্জ
    const shippingCharge = order.shippingInfo?.deliveryCharge || 0;
    doc.text(`Shipping Charge: Tk. ${shippingCharge.toLocaleString()}`, rightAlignX, currentY, { align: "right" });
    currentY += 6;

    // ডিসকাউন্ট
    const discountAmount = Number(order.discount) || 0;
    if (discountAmount > 0) {
        doc.setTextColor(200, 0, 0); 
        doc.text(`Discount: - Tk. ${discountAmount.toLocaleString()}`, rightAlignX, currentY, { align: "right" });
        currentY += 8;
    } else {
        currentY += 2;
    }

    // গ্র্যান্ড টোটাল
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text(`Grand Total: Tk. ${Number(order.amount).toLocaleString()}`, rightAlignX, currentY, { align: "right" });

    // ৬. ফুটার
    doc.setFontSize(10);
    doc.setFont(undefined, 'italic');
    doc.setTextColor(150);
    doc.text("Thank you for choosing Topz Fashions!", 105, 280, { align: "center" });

    // ৭. পিডিএফ সেভ
    doc.save(`Invoice_${order.transactionId || order._id.slice(-6)}.pdf`);
};