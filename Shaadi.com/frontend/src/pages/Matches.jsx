import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileCard from "../components/ProfileCard";
import { profiles as profilesApi } from "../services/api";

function Matches() {
  const [profiles, setProfiles] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [updatingWishlistId, setUpdatingWishlistId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const [profileData, wishlistData] = await Promise.all([
          profilesApi.getAll(),
          profilesApi.getWishlist().catch(() => ({ wishlist: [] })),
        ]);
        setProfiles(profileData.profiles);
        setWishlistIds(new Set(wishlistData.wishlist.map((item) =>
          typeof item.profileId === "object" ? item.profileId._id : item.profileId
        )));
      } catch (err) {
        console.error("Failed to fetch profiles:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  async function handleToggleWishlist(profileId) {
    setUpdatingWishlistId(profileId);
    try {
      const data = await profilesApi.toggleWishlist(profileId);
      setWishlistIds((current) => {
        const next = new Set(current);
        if (data.shortlisted) next.add(profileId);
        else next.delete(profileId);
        return next;
      });
    } catch (err) {
      console.error("Failed to update wishlist:", err);
    } finally {
      setUpdatingWishlistId(null);
    }
  }

  return (
    <>
      <section className="inner-hero small-inner-hero">
        <Navbar />

        <div className="container inner-hero-content">
          <span>DISCOVER</span>

          <h1>Your potential matches</h1>

          <p>
            Explore genuine profiles and discover people
            who share your values.
          </p>
        </div>
      </section>

      <section className="matches-section">
        <div className="container">
          <div className="match-toolbar">
            <div>
              <h2>Recommended for you</h2>

              <p>{loading ? "Loading..." : `${profiles.length} profiles found`}</p>
            </div>

            <button className="filter-btn">
              <i className="bi bi-sliders"></i>
              Filters
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {profiles.map((profile) => (
                <div
                  className="col-lg-4 col-md-6"
                  key={profile._id}
                >
                  <ProfileCard
                    profile={profile}
                    isWishlisted={wishlistIds.has(profile._id)}
                    onToggleWishlist={handleToggleWishlist}
                    isUpdatingWishlist={updatingWishlistId === profile._id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Matches;
