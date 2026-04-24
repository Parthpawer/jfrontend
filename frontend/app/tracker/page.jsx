// app/tracking/page.jsx
import InfoPage from "@/components/footer/InfoPage";

export default function TrackingPage() {
  return (
    <InfoPage
      eyebrow="Shipping"
      title="Tracking"
      intro="Once your order is shipped, you will receive a tracking link via email or WhatsApp."
      sections={[
        {
          paragraphs: [
            "Use the tracking link shared with you after dispatch to monitor your delivery status.",
            "If you have not received your tracking details yet, please allow 1–2 business days for order processing.",
          ],
        },
      ]}
    />
  );
}