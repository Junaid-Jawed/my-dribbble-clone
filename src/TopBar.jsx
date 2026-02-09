import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import db from './fake_db.json'; 
import { IoSearch } from "react-icons/io5";

const TopBar = ({ setView }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  
  const menuRef = useRef(null);

  useGSAP(() => {
    if (searchOpen) {
      gsap.from(".s_overlay", { opacity: 0, duration: 0.2, ease: "rough" });
      gsap.from(".s_top_bar", { y: -50, opacity: 0, duration: 0.4, delay: 0.1 });
    }

    if (menuOpen) {
      const tl = gsap.timeline();
      
      tl.to(".nav_drawer", { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1, duration: 0.1 })
        .to(".nav_drawer", { backgroundColor: "#ff003c", duration: 0.05 })
        .to(".nav_drawer", { backgroundColor: "#0a0a0a", duration: 0.05 })
        .fromTo(".nav_drawer", { skewX: 20, x: -50 }, { skewX: 0, x: 0, duration: 0.2 });
      
      gsap.from(".m_link", { 
        x: -100, 
        opacity: 0, 
        stagger: 0.1,
        duration: 0.3,
        ease: "power2.out"
      });

      gsap.from(".d_line", { height: 0, duration: 1, ease: "power4.out" });

    } else {
      gsap.to(".nav_drawer", { 
        clipPath: "polygon(0 45%, 100% 45%, 100% 55%, 0 55%)", 
        duration: 0.1, 
        onComplete: () => {
          gsap.set(".nav_drawer", { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", opacity: 0 });
        }
      });
    }
  }, [searchOpen, menuOpen]);

  const handleSearch = (e) => {
    const q = e.target.value.toLowerCase();
    setQuery(q);
    if (q.length > 1) {
      const filtered = db.filter(item => 
        item.post_title.toLowerCase().includes(q) || 
        item.post_author.toLowerCase().includes(q)
      ).slice(0, 8);
      setResults(filtered);
      gsap.fromTo(".res_card", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.3, overwrite: true });
    } else {
      setResults([]);
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
  };

  const handleSearchClick = () => {
    setMenuOpen(false);
    setTimeout(() => setSearchOpen(true), 300);
  };

  const scrollToFeed = () => {
    setMenuOpen(false);
    if (setView) setView('feed');
    const feed = document.querySelector('.feed_zone');
    if (feed) feed.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExplore = () => {
    setMenuOpen(false);
    if (setView) setView('explore');
  };

  return (
    <>
      <div className="cyb_nav">
        <div className="ham_btn" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={`h_line hl1 ${menuOpen ? 'rot1' : ''}`}></div>
          <div className={`h_line hl2 ${menuOpen ? 'vanish' : ''}`}></div>
          <div className={`h_line hl3 ${menuOpen ? 'rot2' : ''}`}></div>
        </div>
        <div className="nav_logo">SYS.<span className="r_acc">ROOT</span></div>
        <div className="s_trig" onClick={() => setSearchOpen(true)}>
          <span className="s_txt">FIND // DATA</span>
          <IoSearch className="s_icon" />
        </div>
      </div>

      <div className="nav_drawer" ref={menuRef}>
        <div className="scanlines"></div>
        <div className="d_line"></div>
        
        <div className="menu_content">
          <div className="m_header">
            <span className="blink_txt">SYSTEM_OVERRIDE</span> // V.2.0
          </div>
          
          <ul className="m_list">
            
            <li className="m_link" onClick={scrollToFeed}>
              <span className="idx">01</span> LATEST POSTS 
              <div className="hover_bar"></div>
            </li>
            
            <li className="m_link" onClick={handleExplore}>
              <span className="idx">02</span> EXPLORE 
              <div className="hover_bar"></div>
            </li>
            
            <li className="m_link" onClick={handleSearchClick}>
              <span className="idx">03</span> SEARCH DATABASE 
              <div className="hover_bar"></div>
            </li>
            
            <li className="m_link">
              <span className="idx">04</span> ABOUT US 
              <div className="hover_bar"></div>
            </li>
            
            <li className="m_link">
              <span className="idx">05</span> CONTACT 
              <div className="hover_bar"></div>
            </li>

          </ul>

          <div className="m_footer">
            MEM: 4096TB <br/> 
            STATUS: <span className="r_acc">UNSTABLE</span>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="s_overlay">
          <div className="s_grid"></div>
          
          <div className="s_top_bar">
            <div className="inp_wrap">
              <span className="prompt">{">"}</span>
              <input 
                type="text" 
                className="s_input_small" 
                placeholder="ENTER_QUERY..." 
                autoFocus 
                value={query}
                onChange={handleSearch}
              />
            </div>
            <div className="s_close_btn" onClick={closeSearch}>[ ESC ]</div>
          </div>

          <div className="res_grid">
            {results.length > 0 ? (
              results.map(item => (
                <div key={item.id} className="res_card">
                  <div className="res_img_box">
                    <img src={item.image} alt={item.post_title} />
                  </div>
                  <div className="res_info">
                    <div className="res_title">{item.post_title}</div>
                    <div className="res_meta">ID: {item.id} // {item.post_author}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no_res">
                {query ? "NO DATA FOUND" : "WAITING FOR INPUT..."}
              </div>
            )}
          </div>

        </div>
      )}
    </>
  );
};

export default TopBar;