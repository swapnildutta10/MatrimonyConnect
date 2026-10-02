import { Link } from "react-router-dom";

function ProfileCard({ profile, isWishlisted, onToggleWishlist, isUpdatingWishlist }) {
  return (
    <article className="profile-card">
      <div className="profile-image">
        <img src={profile.image} alt={profile.name} />

        <button
          className={`shortlist-btn ${isWishlisted ? "shortlisted" : ""}`}
          type="button"
          onClick={() => onToggleWishlist?.(profile._id)}
          disabled={isUpdatingWishlist || !onToggleWishlist}
          aria-label={isWishlisted ? `Remove ${profile.name} from wishlist` : `Add ${profile.name} to wishlist`}
          aria-pressed={isWishlisted}
        >
          <i className={`bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}`}></i>
        </button>

        {profile.isVerified && (
          <span className="verified-badge">
            <i className="bi bi-patch-check-fill"></i>
            Verified
          </span>
        )}
      </div>

      <div className="profile-content">
        <h3>{profile.name}</h3>

        <p>
          {profile.age} years · {profile.city}
        </p>

        <p>
          {profile.profession} · {profile.education}
        </p>

        <Link
          to={`/profile/${profile._id}`}
          className="view-profile-btn"
        >
          View Profile
        </Link>
      </div>
    </article>
  );
}

export default ProfileCard;
