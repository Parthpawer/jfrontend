// app/about-us/page.jsx
import InfoPage from "@/components/footer/InfoPage";

export default function AboutUsPage() {
  return (
    <InfoPage
      eyebrow="Brand"
      title="About Us"
      intro="Tvisaa_for You was created to bring everyday luxury within reach."
      sections={[
        {
          paragraphs: [
            "Crafted in premium stainless steel, our jewellery is designed to be worn effortlessly — tarnish-resistant, waterproof, and made to last.",
            "Simple, refined, and made for you.",
          ],
        },
      ]}
    />
  );
}