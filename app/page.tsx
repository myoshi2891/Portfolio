import { site } from "../data/site";
import { HomeMotion } from "../components/home/home-motion";
import { AboutSection, ContactSection, DomainsSection, HeroSection, MoreWorkSection, PhilosophySection, SelectedWorkSection, StudiesSection } from "../components/home/home-sections";
import { pageMetadata } from "../lib/metadata";
import { SiteJsonLd } from "../components/seo/json-ld";
import "./home.css";

export function generateMetadata() { return pageMetadata("/", site.title, site.description); }

export default function Home() {
  return <main id="main" tabIndex={-1} className="container home-page">
    <SiteJsonLd />
    <HomeMotion />
    <HeroSection />
    <SelectedWorkSection />
    <DomainsSection />
    <StudiesSection />
    <MoreWorkSection />
    <AboutSection />
    <PhilosophySection />
    <ContactSection />
  </main>;
}
