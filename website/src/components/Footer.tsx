function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "1.5rem",
        backgroundColor: "#f5f5f5",
        color: "#555",
        fontSize: "0.9rem",
      }}
    >
      <p>
        &copy; {new Date().getFullYear()} The Green Resourcerers LLC. All rights
        reserved.
      </p>
      <p>Satellite Dish Removal &amp; Environmental Recycling</p>
    </footer>
  );
}

export default Footer;
