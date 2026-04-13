import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>
          &copy; {year} The Green Resourcerers LLC — Free satellite dish removal &amp;
          responsible metal recycling.
        </p>
        <p className="footer-contact">
          <a href="mailto:info@greenresourcerers.com">info@greenresourcerers.com</a>
        </p>
      </div>
    </footer>
  )
}
