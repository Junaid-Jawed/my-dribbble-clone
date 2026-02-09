import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Explore3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    if (mount) {
      mount.appendChild(renderer.domElement);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xff003c, 2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const loader = new GLTFLoader();
    let mixer = null;
    const clock = new THREE.Clock();

    loader.load('/dna_animation.glb', (gltf) => {
      const model = gltf.scene;
      model.rotation.set(0,0,Math.PI/2);
      model.position.set(0,0,-10)
      scene.add(model);

      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        mixer.timeScale = 0.3;
        const clip = THREE.AnimationClip.findByName(gltf.animations, 'KeyAction');
        if (clip) mixer.clipAction(clip).play();
        else mixer.clipAction(gltf.animations[0]).play();
      }
    });

    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      if (mount) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
};

export default Explore3D;