import React from 'react';

const Footer = () => {
  return (
    <footer className="raw_footer">
      
      <div className="giant_text">
        <span>SYS</span>
        <span className="outline">ROOT</span>
      </div>

      <div className="f_top_row">
        <div className="f_info_group">
          <span className="f_label">CONTACT</span>
          <a href="mailto:hello@sysroot.co">HELLO@SYSROOT.CO</a>
        </div>

        <div className="f_info_group">
          <span className="f_label">BASE</span>
          <span>NIT DURGAPUR, INDIA</span>
        </div>

        <div className="f_info_group">
          <span className="f_label">SOCIAL</span>
          <div className="social_links">
            <a href="#">LINKEDIN</a>
            <a href="#">GITHUB</a>
            <a href="#">INSTAGRAM</a>
          </div>
        </div>
      </div>

      <div className="f_center_void">
      </div>

      <div className="f_bottom_bar">
        <div className="nav_pill">
          <a href="#">HOME</a>
          <a href="#">WORK</a>
          <a href="#">SERVICES</a>
          <a href="#">ABOUT</a>
          <a href="#">CONTACT</a>
        </div>
        
        <div className="f_legal">
          <span>PRIVACY POLICY</span>
          <span>© 2026 SYS.ROOT</span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;