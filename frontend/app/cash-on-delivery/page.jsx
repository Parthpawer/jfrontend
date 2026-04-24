// app/cash-on-delivery/page.jsx
import InfoPage from "@/components/footer/InfoPage";

export default function CashOnDeliveryPage() {
  return (
    <InfoPage
      eyebrow="Shipping"
      title="Cash on Delivery"
      sections={[
        {
          paragraphs: [
            "Cash on Delivery is available at ₹99 to ensure secure and reliable delivery.",
          ],
        },
      ]}
    />
  );
}