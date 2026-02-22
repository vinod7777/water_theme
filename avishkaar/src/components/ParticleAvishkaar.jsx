import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleAvishkaar = ({ text = "AVISHKAAR" }) => {
    const mountRef = useRef(null);
    const textRef = useRef(text);

    // Keep ref in sync so animation loop reads latest without re-running useEffect
    useEffect(() => {
        textRef.current = text;
    }, [text]);

    useEffect(() => {
        let animationFrameId;

        const container = mountRef.current;
        if (!container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x020617, 0.005);

        const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
        camera.position.set(0, 0, 120); // Proper distance to maintain size

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        let particles;
        const particleCount = 30000; // Increased massively for extreme density on big text
        let positions, colors, targets, velocities;
        const colorBase = new THREE.Color(0xd0f8ff); // Extremely bright cyan-white
        const colorActive = new THREE.Color(0xffffff); // Pure white for impact
        const clock = new THREE.Clock();

        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const mouse3D = new THREE.Vector3(0, 0, 0);
        let isMouseActive = false;

        const onMouseMove = (event) => {
            const rect = container.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            raycaster.ray.intersectPlane(mousePlane, mouse3D);
            isMouseActive = true;
        };
        const onMouseOut = () => { isMouseActive = false; };

        window.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseleave', onMouseOut);

        const texCanvas = document.createElement('canvas');
        texCanvas.width = 20;
        texCanvas.height = 20;
        const context = texCanvas.getContext('2d');
        const gradient = context.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(52, 195, 200, 1)'); // Pure white core for maximum brightness
        gradient.addColorStop(0.3, 'rgba(34, 154, 175, 0.8)'); // Light blue glow
        gradient.addColorStop(1, 'rgba(56,189,248,0)'); // Fade
        context.fillStyle = gradient;
        context.fillRect(0, 0, 16, 16);
        const particleTexture = new THREE.CanvasTexture(texCanvas);

        const geometry = new THREE.BufferGeometry();
        positions = new Float32Array(particleCount * 3);
        targets = new Float32Array(particleCount * 3);
        velocities = new Float32Array(particleCount * 3);
        colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            targets[i * 3] = positions[i * 3];
            targets[i * 3 + 1] = positions[i * 3 + 1];
            targets[i * 3 + 2] = positions[i * 3 + 2];
            velocities[i * 3] = 0; velocities[i * 3 + 1] = 0; velocities[i * 3 + 2] = 0;
            colors[i * 3] = colorBase.r; colors[i * 3 + 1] = colorBase.g; colors[i * 3 + 2] = colorBase.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 2.5, // Increased size for even more luminous presence
            vertexColors: true,
            map: particleTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // 2D Canvas for text sampling (expanded for larger text)
        const canvas2d = document.createElement('canvas');
        canvas2d.width = 2048; // Increased significantly to fit huge text without cropping
        canvas2d.height = 512;
        const ctx2d = canvas2d.getContext('2d', { willReadFrequently: true });

        let lastText = "";

        const updateTargets = (newTextStr) => {
            if (!newTextStr || newTextStr.length === 0) {
                // If text is empty, gather particles in random small sphere or just hide
                for (let i = 0; i < particleCount; i++) {
                    targets[i * 3] = (Math.random() - 0.5) * 100;
                    targets[i * 3 + 1] = (Math.random() - 0.5) * 100;
                    targets[i * 3 + 2] = (Math.random() - 0.5) * 100;
                }
                return;
            }

            ctx2d.clearRect(0, 0, canvas2d.width, canvas2d.height);
            ctx2d.fillStyle = '#FFFFFF';

            // Apply massive scaling changes based on screen width
            const isMobile = window.innerWidth < 768;
            const fontSize = isMobile ? 110 : 250; // Slightly smaller more
            const scaleFactor = isMobile ? 0.14 : 0.22; // Reduced multiplier for better balance

            ctx2d.font = `900 ${fontSize}px "Outfit", "Inter", sans-serif`;
            ctx2d.textAlign = 'center';
            ctx2d.textBaseline = 'middle';
            ctx2d.lineJoin = 'round';
            ctx2d.lineWidth = isMobile ? 12 : 24; // Thicker outline for text
            ctx2d.strokeStyle = '#FFFFFF';
            // Adjusted slightly up to ensure perfect visual center
            ctx2d.strokeText(newTextStr, canvas2d.width / 2, canvas2d.height / 2);
            ctx2d.fillText(newTextStr, canvas2d.width / 2, canvas2d.height / 2);

            const imageData = ctx2d.getImageData(0, 0, canvas2d.width, canvas2d.height).data;
            const validPixels = [];

            // Step size restricts max particle count needed (skip pixels)
            for (let y = 0; y < canvas2d.height; y += 2) { // Decreased step to 2 to gather vastly more target pixels
                for (let x = 0; x < canvas2d.width; x += 2) {
                    const idx = (y * canvas2d.width + x) * 4;
                    if (imageData[idx + 3] > 128) { // if alpha > 128
                        validPixels.push({
                            x: (x - canvas2d.width / 2) * scaleFactor,
                            // Added an offset to raise the text perfectly center in the 3D viewport
                            y: -(y - canvas2d.height / 2) * scaleFactor + (isMobile ? 3 : 6)
                        });
                    }
                }
            }

            if (validPixels.length === 0) return;

            // Assign pixels to targets randomly so particle density is perfectly even across the whole word
            for (let i = 0; i < particleCount; i++) {
                const p = validPixels[Math.floor(Math.random() * validPixels.length)];
                targets[i * 3] = p.x + (Math.random() - 0.5) * 0.3;
                targets[i * 3 + 1] = p.y + (Math.random() - 0.5) * 0.3;
                targets[i * 3 + 2] = (Math.random() - 0.5) * 1;
            }
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();

            if (textRef.current !== lastText) {
                lastText = textRef.current;
                updateTargets(lastText);
            }

            if (particles) {
                const posAttr = particles.geometry.attributes.position;
                const colAttr = particles.geometry.attributes.color;

                for (let i = 0; i < particleCount; i++) {
                    const i3 = i * 3;

                    let px = posAttr.array[i3];
                    let py = posAttr.array[i3 + 1];
                    let pz = posAttr.array[i3 + 2];

                    let tx = targets[i3];
                    let ty = targets[i3 + 1];
                    let tz = targets[i3 + 2];

                    // Subtle continuous float
                    ty += Math.sin(tx * 0.3 + time * 1.5) * 0.2;
                    tz += Math.cos(tx * 0.3 + time * 1.5) * 0.2;

                    // Mouse Interaction
                    let distToMouse = 999;
                    if (isMouseActive) {
                        const dx = px - mouse3D.x;
                        const dy = py - mouse3D.y;
                        const dz = pz - mouse3D.z;
                        distToMouse = Math.sqrt(dx * dx + dy * dy + dz * dz);

                        const repelRadius = 10;
                        if (distToMouse < repelRadius) {
                            const force = (repelRadius - distToMouse) / repelRadius;
                            tx += (dx / distToMouse) * force * 15;
                            ty += (dy / distToMouse) * force * 15;
                            tz += (dz / distToMouse) * force * 15;
                        }
                    }

                    // Faster and more snappy transitions (increased from 0.12 to 0.2)
                    velocities[i3] += (tx - px) * 0.2;
                    velocities[i3 + 1] += (ty - py) * 0.2;
                    velocities[i3 + 2] += (tz - pz) * 0.2;

                    velocities[i3] *= 0.75;
                    velocities[i3 + 1] *= 0.75;
                    velocities[i3 + 2] *= 0.75;

                    posAttr.array[i3] += velocities[i3];
                    posAttr.array[i3 + 1] += velocities[i3 + 1];
                    posAttr.array[i3 + 2] += velocities[i3 + 2];

                    let currentColor = new THREE.Color(colAttr.array[i3], colAttr.array[i3 + 1], colAttr.array[i3 + 2]);
                    let targetColor = distToMouse < 15 ? colorActive : colorBase;

                    currentColor.lerp(targetColor, 0.15);
                    colAttr.array[i3] = currentColor.r;
                    colAttr.array[i3 + 1] = currentColor.g;
                    colAttr.array[i3 + 2] = currentColor.b;
                }

                posAttr.needsUpdate = true;
                colAttr.needsUpdate = true;
            }

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            if (!container) return;
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
            updateTargets(textRef.current); // Font size might change on resize
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            if (container) {
                container.removeEventListener('mouseleave', onMouseOut);
                if (container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
            }
            renderer.dispose();
            scene.clear();
        };
    }, []);

    // We keep styling and boundaries for the text
    return (
        <div className="relative z-10 w-full h-[110px] md:h-[220px] flex items-center justify-center pointer-events-none">
            <div ref={mountRef} className="w-full h-full cursor-crosshair" />
        </div>
    );
};

export default ParticleAvishkaar;
