import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function RobotScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0.8, 4.5);

    const ambient = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(3, 5, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xaaddff, 1);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x00ff46, 0.4, 10);
    rimLight.position.set(0, 2, -2);
    scene.add(rimLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 4;
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;

    // Stop auto-rotate after 3 seconds
    setTimeout(() => {
      controls.autoRotate = false;
    }, 3000);

    let isDragging = false;
    let isResetting = false;
    let resetProgress = 0;
    let resetDuration = 0;
    let resetStartPos = new THREE.Vector3();
    let resetStartTarget = new THREE.Vector3();

    const originPos = new THREE.Vector3(0, 0.8, 4.5);
    const originTarget = new THREE.Vector3(0, 0, 0);

    const onMouseDown = () => {
      isDragging = true;
      isResetting = false; // cancel any ongoing reset
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;

      // Capture exact position at moment of release
      resetStartPos.copy(camera.position);
      resetStartTarget.copy(controls.target);
      resetProgress = 0;

      // Duration based on distance — further away = longer return
      const dist = camera.position.distanceTo(originPos);
      resetDuration = Math.max(80, dist * 60);

      isResetting = true;
    };

    mount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    let robot: THREE.Group | null = null;
    let head: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let bouncing = false;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMouseMove);

    const loader = new GLTFLoader();
    loader.load(
      "/mini_robot.glb",
      (gltf) => {
        robot = gltf.scene;

        const box = new THREE.Box3().setFromObject(robot);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxDim;
        robot.scale.setScalar(scale);
        robot.position.sub(center.multiplyScalar(scale));
        robot.position.y -= 0.2;

        robot.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        robot.traverse((child) => {
          const name = child.name.toLowerCase();
          if (name.includes("head") || name.includes("skull")) {
            head = child;
          }
        });

        scene.add(robot);

        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(robot);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }
      },
      undefined,
      (err) => console.error("GLB load error:", err)
    );

    const handleClick = () => {
      if (!robot || bouncing) return;
      bouncing = true;

      let t = 0;
      const baseY = robot.position.y;
      const bounce = setInterval(() => {
        t += 0.15;
        if (robot) {
          robot.position.y = baseY + Math.abs(Math.sin(t)) * 0.35;
        }
        if (t > Math.PI * 2) {
          clearInterval(bounce);
          if (robot) robot.position.y = baseY;
          bouncing = false;
        }
      }, 16);
    };

    mount.addEventListener("click", handleClick);

    let clock = 0;
    const threeClock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = threeClock.getDelta();
      clock += delta;

      if (mixer) mixer.update(delta);

      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      if (robot && !bouncing) {
        robot.position.y = -0.2 + Math.sin(clock * 1.1) * 0.08;
      }

      if (head) {
        head.rotation.y = currentMouseX * 0.4;
        head.rotation.x = -currentMouseY * 0.2;
      }

      rimLight.intensity = 0.3 + Math.sin(clock * 2) * 0.15;

      if (isResetting && !isDragging) {
        resetProgress += 1;
        const t = Math.min(resetProgress / resetDuration, 1);

        // Ease in-out cubic
        const eased = t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // Disable damping during reset so controls don't fight us
        controls.enableDamping = false;

        camera.position.lerpVectors(resetStartPos, originPos, eased);
        controls.target.lerpVectors(resetStartTarget, originTarget, eased);

        if (t >= 1) {
          isResetting = false;
          camera.position.copy(originPos);
          controls.target.copy(originTarget);
          controls.enableDamping = true;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const W2 = mount.clientWidth;
      const H2 = mount.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      mount.removeEventListener("mousedown", onMouseDown);
      mount.removeEventListener("click", handleClick);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ cursor: "grab" }}
    />
  );
}