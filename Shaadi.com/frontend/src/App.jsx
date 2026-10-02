import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import Matches from "./pages/Matches";
import SuccessStories from "./pages/SuccessStories";
import About from "./pages/About";
import ChatHub from "./pages/ChatHub";
import ChatHistory from "./pages/ChatHistory";
import Dashboard from "./pages/Dashboard";
import ProfileDetails from "./pages/ProfileDetails";

import "./pages.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/pricing"
          element={<Pricing />}
        />

        <Route
          path="/payment/:planName"
          element={<Payment />}
        />

        <Route
          path="/matches"
          element={<Matches />}
        />

        <Route
          path="/success-stories"
          element={<SuccessStories />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/chat"
          element={<ChatHub />}
        />

        <Route
          path="/chat/history"
          element={<ChatHistory />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/profile/:id"
          element={<ProfileDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;