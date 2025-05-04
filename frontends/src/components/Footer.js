import React from "react";

const styles = {
  footer: {
    backgroundColor: "#333",
    color: "white",
    textAlign: "center",
    padding: "10px 0",
    fontSize: "0.9rem",
    borderTop: "1px solid #555",
  },
};

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; {new Date().getFullYear()} My Drive. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
