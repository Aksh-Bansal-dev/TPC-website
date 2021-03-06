import React from "react";
import styles from "./style.module.css";
import HomeNav from "../../components/Navs/homeNav";
import Shortcuts from "../../components/shortcuts";
import AboutUs from "../../components/aboutUs";
import ContactUs from "src/components/aboutUs/ContactUs";
import Nav from "../../components/Navs/homeNavMobile";

const HomePage: React.FC = () => {
  return (
    <>
      <Nav />
      <div>
        <div className={styles.home}>
          <div className={styles.container}>
            <span className={styles.heading}>The Programming Club IIITDMJ</span>
            <img
              className={styles.svgimg}
              src="/images/other/ComponentTMP_0-image.png"
              alt="The Programming Club"
            />
            <span className={styles.text}>
              An Open Coding Community to explore and do a lot more with your
              friends and members.
            </span>
            <button className={styles.primaryBtn}>Explore Now</button>
          </div>
          <HomeNav />
          <Shortcuts />
        </div>
        <AboutUs />
        <ContactUs />
      </div>
    </>
  );
};

export default HomePage;
