import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import GuidePanel from "../components/GuidePanel";
import DatingTips from "../components/DatingTips";
import Footer from "../components/Footer";

import "../home.css";

function Home() {
  return (
    <main>
      <section className="hero-section" id="home">
        <Navbar />
        <Hero />
      </section>

      <GuidePanel />

      <DatingTips />
      <Footer />
    </main>
  );
}

export default Home;