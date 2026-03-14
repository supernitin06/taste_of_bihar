// src/utils/normalizeTicket.js

export const normalizeTicket = (ticket) => {
    return {
        ticketId: ticket.ticketId,
        subject: ticket.columns.subject,
        customerName: ticket.columns.customerName,
        customerEmail: ticket.columns.customerEmail,
        priority: ticket.columns.priority.toLowerCase(), // high, medium, low, urgent
        status: ticket.columns.status.toLowerCase(), // open, pending, resolved, closed
        createdAt: ticket.columns.createdAt,
        // Detail fields
        orderId: ticket.ticketDetail.orderId || null,
        message: ticket.ticketDetail.message,
        conversation: ticket.ticketDetail.conversation || [],
        updatedAt: ticket.ticketDetail.updatedAt || ticket.ticketDetail.createdAt,
        actions: ticket.actions,
        raw: ticket
    };
};