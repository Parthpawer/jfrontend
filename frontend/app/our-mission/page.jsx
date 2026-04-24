// app/our-mission/page.jsx
import InfoPage from "@/components/footer/InfoPage";

export default function OurMissionPage() {
  return (
    <InfoPage
      eyebrow="Brand"
      title="Our Mission"
      sections={[
        {
          paragraphs: [
            "To bring thoughtfully selected jewellery that combines lasting quality with effortless elegance, designed for everyday life.",
          ],
        },
      ]}
    />
  );
}