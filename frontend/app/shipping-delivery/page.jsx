// app/shipping-delivery/page.jsx
import InfoPage from "@/components/footer/InfoPage";

export default function ShippingDeliveryPage() {
  return (
    <InfoPage
      eyebrow="Shipping"
      title="Shipping & Delivery"
      intro="We aim to deliver your order as quickly and safely as possible."
      sections={[
        {
          list: [
            "Orders are processed within 1–2 business days",
            "Delivery typically takes 3–7 business days, depending on your location",
            "You will receive a tracking link once your order is shipped",
            "We ensure every piece is carefully packaged to reach you in perfect condition.",
          ],
        },
      ]}
    />
  );
}