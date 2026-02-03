import React from "react";
import {
  PhoneCall,
  Mail,
  MessageCircle,
  Clock,
  HelpCircle,
} from "lucide-react";

export default function Help() {
  return (
    <div className="help-page">
      {/* Header */}
      <div className="help-header">
        <div className="help-header-left">
          <HelpCircle size={40} className="help-icon" />
          <div>
            <h2>Help & Support</h2>
            <p>
              If you face any issues regarding orders, delivery, payment,
              refund, or complaints — contact our support team.
            </p>
          </div>
        </div>
      </div>

      {/* Support Card */}
      <div className="support-card">
        <h3>📞 Customer Support</h3>

        <div className="support-info">
          <div className="info-row">
            <PhoneCall size={20} />
            <p>
              Call Us:{" "}
              <a href="tel:+919876543210" className="link">
                +91 98765 43210
              </a>
            </p>
          </div>

          <div className="info-row">
            <Mail size={20} />
            <p>
              Email:{" "}
              <a href="mailto:support@yourwebsite.com" className="link">
                support@yourwebsite.com
              </a>
            </p>
          </div>

          <div className="info-row">
            <Clock size={20} />
            <p>Working Hours: Mon - Sat (9AM - 7PM)</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="btn-group">
          <a href="tel:+919876543210" className="btn call-btn">
            <PhoneCall size={18} /> Call Now
          </a>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="btn whatsapp-btn"
          >
            <MessageCircle size={18} /> WhatsApp
          </a>

          <a href="mailto:support@yourwebsite.com" className="btn email-btn">
            <Mail size={18} /> Email
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h3>Frequently Asked Questions</h3>

        <div className="faq-grid">
          <div className="faq-card">
            <h4>📦 Where is my order?</h4>
            <p>Go to Orders page → Track your order status.</p>
          </div>

          <div className="faq-card">
            <h4>💳 Payment issue</h4>
            <p>If payment got deducted but not confirmed, contact support.</p>
          </div>

          <div className="faq-card">
            <h4>↩️ Refund / Return</h4>
            <p>Refunds are processed within 5-7 working days.</p>
          </div>

          <div className="faq-card">
            <h4>🚚 Delivery delay</h4>
            <p>Delivery may delay during peak hours. Please wait 24hrs.</p>
          </div>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .help-page{
          padding: 30px;
          max-width: 1000px;
          margin: auto;
          font-family: Arial, sans-serif;
        }

        .help-header{
          background: linear-gradient(135deg, #2563eb, #1e40af);
          padding: 25px;
          border-radius: 16px;
          color: white;
          margin-bottom: 25px;
          box-shadow: 0px 10px 25px rgba(0,0,0,0.15);
        }

        .help-header-left{
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .help-header h2{
          margin: 0;
          font-size: 28px;
        }

        .help-header p{
          margin-top: 6px;
          opacity: 0.9;
          font-size: 15px;
        }

        .support-card{
          background: #fff;
          padding: 25px;
          border-radius: 16px;
          box-shadow: 0px 8px 25px rgba(0,0,0,0.08);
          margin-bottom: 30px;
        }

        .support-card h3{
          margin-bottom: 15px;
          font-size: 22px;
        }

        .support-info{
          margin-bottom: 20px;
        }

        .info-row{
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 0;
          color: #333;
        }

        .link{
          color: #2563eb;
          font-weight: bold;
          text-decoration: none;
        }
        .link:hover{
          text-decoration: underline;
        }

        .btn-group{
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        .btn{
          flex: 1;
          min-width: 160px;
          text-decoration: none;
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          transition: 0.3s;
          color: white;
        }

        .btn:hover{
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .call-btn{ background: #2563eb; }
        .whatsapp-btn{ background: #16a34a; }
        .email-btn{ background: #f97316; }

        .faq-section h3{
          margin-bottom: 15px;
          font-size: 22px;
        }

        .faq-grid{
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .faq-card{
          background: #f9fafb;
          padding: 18px;
          border-radius: 14px;
          border: 1px solid #eee;
          transition: 0.2s;
        }

        .faq-card:hover{
          transform: scale(1.02);
          box-shadow: 0 6px 16px rgba(0,0,0,0.08);
        }

        .faq-card h4{
          margin: 0 0 8px;
          font-size: 16px;
        }

        .faq-card p{
          margin: 0;
          font-size: 14px;
          color: #555;
        }

        /* Responsive */
        @media(max-width: 768px){
          .faq-grid{
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
