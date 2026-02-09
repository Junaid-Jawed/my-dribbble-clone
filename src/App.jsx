import { useEffect, useRef, useState } from 'react';
import './App.css';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { IoHeart, IoEye, IoFlash } from "react-icons/io5";
import { SpeedInsights } from '@vercel/speed-insights/react';
import Raw3D from './Raw3D';
import db from './fake_db.json';
import TopBar from './TopBar';
import Footer from './Footer';
import Explore3D from './Explore3d';


gsap.registerPlugin(ScrollTrigger);




const TextDiv = ({ children, className }) => {
  return (
    <span className={className} style={{ display: 'inline-block', overflow: 'hidden' }}>
      {children.split("").map((char, index) => (
        <span
          key={index}
          className="char1"
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        > 
          {char}
        </span>
      ))}
    </span>
  );
};



function MainView() {
  const containerRef = useRef(null);
  const [view, setView] = useState('feed');
  
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerFn);
    };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".char1", {
      duration: 1.2,
      y: -300,
      rotation: -180,
      opacity: 0,
      ease: "bounce.out",
      stagger: 0.05
    })
    .from(".t2", {
      duration: 1,
      scale: 0,
      opacity: 0,
      ease: "elastic.out(1, 0.3)"
    }, "-=0.5");

    gsap.to(".grid1", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.from(".ibox", {
      scrollTrigger: {
        trigger: ".cont4",
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      y: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out"
    });

  }, { scope: containerRef });

  useGSAP(() => {
    if (view === 'explore') {
      gsap.utils.toArray(".explore_text").forEach((el) => {
        gsap.from(el, {
          y: 50,
          opacity: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        });
      });
    } else if (view === 'feed') {
      gsap.set(".p_card", { opacity: 0 });
      
      ScrollTrigger.batch(".p_card", {
        start: "top 90%",
        onEnter: batch => gsap.fromTo(batch, 
          { scale: 0, opacity: 0 },
          {
            opacity: 1, 
            scale: 1, 
            duration: 1.5, 
            stagger: 0.1, 
            ease: "elastic.out(1, 0.5)",
            overwrite: true
          }
        ),
        onLeaveBack: batch => gsap.to(batch, {
          opacity: 0, 
          scale: 0, 
          duration: 0.5,
          overwrite: true
        })
      });
      ScrollTrigger.refresh();
    }
  }, { scope: containerRef, dependencies: [view] });

  return (
    <div className="contbig" ref={containerRef}>
      
      <TopBar setView={setView} />
      <Raw3D />
      <div className="grid1"></div>

      <div className="contf">
        
        <div className="box1">
          <div className="shape1"></div>
          <div className="sbox1"></div>
        </div>

        <div className="box2">
          <h1 className="t1">
            <TextDiv className="ttext">DRIBBBLE</TextDiv>
            <br />
            <span className="t2">
              MAKE IT ALIVE<span className="acc">//</span>
            </span>
          </h1>
          <div className="bar1"></div>
        </div>

        <div className="cont4">
          <div className="ibox s1"></div>
          <div className="ibox"></div>
          <div className="ibox s2"></div>
        </div>

        <div className="boxz3">
          <div className="tgt">
            <div className="c1"></div>
            <div className="c2"></div>
            <div className="c3"></div>
            <div className="c4"></div>
          </div>
        </div>

        <div className="box3">
          <div className="shape2"></div>
          <div className="flabels">
            <span>EPS 10</span>
            <span>AI 10</span>
            <span>PNG IN HIGH RES</span>
          </div>
        </div>

        <div className="box4">
          <div className="shape3"></div>
          <div className="tdet">
            <div className="cbox">
              <div className="cline"></div>
            </div>
            <div className="xmk">X</div>
          </div>
        </div>
      </div>
      

      {view === 'feed' && (
        <div className="feed_zone">
          <h2 className="feed_title"><IoFlash style={{ marginRight: '10px', color: 'var(--accent-color)' }} /> LATEST SHOTS</h2>
          <div className="feed_grid">
            
            {db.map((item) => (
              <div className="p_card" key={item.id}>
                <div className="img_hold">
                  <img src={item.image} alt={item.post_title} className="p_img" />
                  <div className="hover_stuff">
                    <span>{item.post_title}</span>
                  </div>
                </div>
                
                <div className="p_dets">
                  <div className="p_auth">
                    <div className="avt"></div>
                    <span>{item.post_author}</span>
                  </div>
                  <div className="p_stats">
                    <span><IoHeart /> {Math.floor(item.post_viewcount / 100)}</span>
                    <span><IoEye /> {Math.floor(item.post_viewcount / 1000)}k</span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}

      {view === 'explore' && (
        <div className="dummycontent">
          <Explore3D />
          <div className="explore_text">
            <p>
              <span className="first_word">UNBOUNDED CREATIVITY</span> Explore a universe where imagination knows no limits. 
              From pixel-perfect icons to sprawling architectural visualizations, witness the raw output of the world's top designers. 
              This is where trends are born and standards are shattered.
            </p>
          </div>
          <div className="explore_text right">
            <p>
              <span className="first_word">GLOBAL COLLECTIVE</span> Connect with a network of visionaries. 
              Every shot tells a story of process, passion, and precision. Engage with the minds shaping the digital landscape 
              and find the spark for your next breakthrough.
            </p>
          </div>
          <div className="explore_text bottom_left">
            <p>
              <span className="first_word">FUTURE INTERFACES</span> Peel back the layers of tomorrow's web. 
              We showcase the bleeding edge of UI/UX, where aesthetics meet utility in perfect harmony. 
              Don't just observe the evolution of design; become part of it.
            </p>
          </div>
        </div>
      )}

      <Footer />
      <SpeedInsights />
    </div>
  );
}

export default MainView;
