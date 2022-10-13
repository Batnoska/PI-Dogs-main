import React from "react";
import { NavLink } from "react-router-dom";
import Slider from "../Slider/Slider";
import styles from "./LandingPage.module.css";

function LandingPage() {
    return (
        <div className={styles.landingPage}>
          <Slider/>
          <div className={styles.container_text}>
            <h1 className={styles.title}>DogBook</h1>
            
              <NavLink to="/home" className={styles.btn}>
                <span>Start</span>
              </NavLink>
          </div>
        </div>
      )
}

export default LandingPage