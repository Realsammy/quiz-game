import React from 'react';
import styles from '../styles/Home.module.css';

// Main component for the home page
const Banner = () => {
  return (
    <div className={styles.container}>
      {/* Left section with banner, text, and button */}
      <div className={styles.leftSection}>
        <h1>Banner Text</h1>
        <p>This is a responsive banner with text and a button on the left.</p>
        <button>Click Me</button>
      </div>

      {/* Right section with an image */}
      <div className={styles.rightSection}>
        <img src="/images/banner_image.jpg" alt="Banner Image" />
      </div>
    </div>
  );
};

export default Banner;
