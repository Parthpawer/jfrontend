// app/our-vision/page.jsx
import InfoPage from "@/components/footer/InfoPage";

export default function OurVisionPage() {
  return (
    <InfoPage
      eyebrow="Brand"
      title="Our Vision"
      sections={[
        {
          paragraphs: [
            "To become a trusted destination for everyday luxury jewellery, known for quality, simplicity, and timeless style.",
          ],
        },
      ]}
    />
  );
}