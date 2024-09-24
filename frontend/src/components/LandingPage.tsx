import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h2>LANDING PAGE</h2>
      <div>
        <button>
          <Link to={"/login"}>Login</Link>
        </button>
        <button>
          <Link to={"/signup"}>Sign Up</Link>
        </button>
      </div>
    </div>
  );
};

export default Home;
