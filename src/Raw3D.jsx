import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Raw3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const currentMount = mountRef.current;
    if (currentMount) {
      currentMount.appendChild(renderer.domElement);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xff003c, 2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const loader = new GLTFLoader();
    let model = null;
    const mixers = [];
    const clock = new THREE.Clock();

    loader.load('/model.glb', (gltf) => {
      model = gltf.scene;
      
      model.scale.set(1, 1, 1);
      model.position.set(4, -0.5, 0);
      model.rotation.set(0.5, -Math.PI/2,2 )
      
      scene.add(model);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "15% bottom",
          scrub: 1.5
        }
      });

      tl.to(model.position, { x: -8, z: 2 }, 0)

    }, undefined, (error) => {
      console.error('ERROR LOADING MODEL:', error);
    });

    // Load Footer Model (possiblior.glb)
    loader.load('/possiblior.glb', (gltf) => {
      const footerModel = gltf.scene;
      footerModel.scale.set(1.5, 1.5, 1.5); 
      footerModel.position.set(4, -19, 0);
      scene.add(footerModel);

      if (gltf.animations && gltf.animations.length > 0) {
        const m = new THREE.AnimationMixer(footerModel);
        const clip = THREE.AnimationClip.findByName(gltf.animations, 'Animation');
        if (clip) m.clipAction(clip).play();
        mixers.push(m);
      }

      gsap.to(footerModel.position, {
        y: -3.5,
        scrollTrigger: {
          trigger: "body",
          start: "95% bottom",
          end: "bottom bottom",
          scrub: 1
        }
      });
    });


    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      mixers.forEach(m => m.update(delta));

      if (model) {
        model.rotation.z = Math.sin(Date.now() * 0.001) * 0.15;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed', // Lock to screen
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    />
  );
};

export default Raw3D;