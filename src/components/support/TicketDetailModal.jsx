import React, { useState } from 'react';
import Button from '../ui/Button';
import { format } from 'date-fns';
import { User, Calendar, Paperclip, Send } from 'lucide-react';

const TicketDetailModal = ({ isOpen, ticket, onClose, onReply, onCloseTicket }) => {
  const [replyText, setReplyText] = useState('');

  if (!isOpen || !ticket) return null;

  const sendReply = () => {
    if (!replyText.trim()) return;
    onReply(ticket.ticketId, replyText);
    setReplyText('');
  };

  const closeTicketHandler = () => {
    if (window.confirm('Are you sure you want to close this ticket?')) {
      onCloseTicket(ticket.ticketId);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="card card-elevated w-full max-w-4xl bg-[var(--bg-card)] rounded-xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-white/10 flex justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{ticket.subject}</h2>
              <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> {ticket.customerName}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {format(new Date(ticket.createdAt), 'dd MMM yyyy')}</span>
                {ticket.orderId && <span>Order ID: {ticket.orderId}</span>}
              </div>
            </div>
            <Button variant="inactive" onClick={onClose}>×</Button>
          </div>

          <div className="p-6 space-y-8">
            {ticket.conversation.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xl rounded-lg p-4 ${msg.sender === 'admin' ? 'bg-primary text-white' : 'bg-white/10 text-white'}`}>
                  <p className="text-sm font-semibold mb-2">{msg.sender === 'admin' ? 'You (Admin)' : ticket.customerName}</p>
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                  {msg.attachments?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.attachments.map((_, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs bg-black/30 px-3 py-1 rounded">
                          <Paperclip className="w-4 h-4" /> Attachment {i + 1}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs mt-3 opacity-70">
                    {format(new Date(msg.timestamp), 'dd MMM yyyy HH:mm')}
                  </p>
                </div>
              </div>
            ))}

            {['open', 'pending'].includes(ticket.status) && (
              <div className="border-t border-white/10 pt-6">
                <h3 className="font-semibold mb-4">Reply to Customer</h3>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="input w-full h-32 resize-none mb-4"
                  placeholder="Type your reply here..."
                />
                <div className="flex justify-end gap-3">
                  <Button variant="destructive" onClick={closeTicketHandler}>
                    Close Ticket
                  </Button>
                  <Button variant="primary" onClick={sendReply} disabled={!replyText.trim()}>
                    <Send className="w-4 h-4 mr-2" /> Send Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketDetailModal;