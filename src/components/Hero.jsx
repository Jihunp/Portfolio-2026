"use client";
import {useRef, useEffect, useState} from "react";
import {motion} from "framer-motion";
import * as THREE from "three";

class TouchTexture {
    constructor() {
        this.size = 64;
        this.maxAge = 64;
        this.radius = 0.15 * this.size;
        this.trail = [];
        this.last = null;
        this.canvas = null;
        this.ctx = null;
        this.texture = null;
    }

    init() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.canvas.height = this.size;
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.size, this.size);
        this.texture = new THREE.Texture(this.canvas);
    }

    update() {
        if (!this.ctx) return;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.size, this.size);
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const p = this.trail[i];
            const f = (p.force / this.maxAge) * (1 - p.age / this.maxAge);
            p.x += p.vx * f;
            p.y += p.vy * f;
            p.age++;
            if (p.age > this.maxAge) {
                this.trail.splice(i, 1);
                continue;
            }
            const pos = {x: p.x * this.size, y: (1 - p.y) * this.size};
            let intensity =
                p.age < this.maxAge * 0.3
                    ? Math.sin((p.age / (this.maxAge * 0.3)) * (Math.PI / 2))
                    : -(
                          (1 -
                              (p.age - this.maxAge * 0.3) /
                                  (this.maxAge * 0.7)) *
                          (1 -
                              (p.age - this.maxAge * 0.3) /
                                  (this.maxAge * 0.7) -
                              2)
                      );
            intensity *= p.force;
            const c = `${((p.vx + 1) / 2) * 255},${((p.vy + 1) / 2) * 255},${intensity * 255}`;
            const off = this.size * 5;
            this.ctx.shadowOffsetX = off;
            this.ctx.shadowOffsetY = off;
            this.ctx.shadowBlur = this.radius;
            this.ctx.shadowColor = `rgba(${c},${0.2 * intensity})`;
            this.ctx.beginPath();
            this.ctx.fillStyle = "rgba(255,0,0,1)";
            this.ctx.arc(pos.x - off, pos.y - off, this.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.texture.needsUpdate = true;
    }

    addTouch(pt) {
        let force = 0,
            vx = 0,
            vy = 0;
        if (this.last) {
            const dx = pt.x - this.last.x,
                dy = pt.y - this.last.y;
            if (!dx && !dy) return;
            const d = Math.sqrt(dx * dx + dy * dy);
            vx = dx / d;
            vy = dy / d;
            force = Math.min((dx * dx + dy * dy) * 20000, 2.0);
        }
        this.last = {x: pt.x, y: pt.y};
        this.trail.push({x: pt.x, y: pt.y, age: 0, force, vx, vy});
    }
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    vUv = uv;
  }
`;


const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColor1, uColor2, uColor3, uColor4, uColor5, uColor6;
  uniform float uSpeed, uIntensity;
  uniform sampler2D uTouchTexture;
  uniform float uGrainIntensity;
  uniform vec3 uDarkBase;
  uniform float uGradientSize, uColor1Weight, uColor2Weight;
  varying vec2 vUv;

  float grain(vec2 uv, float t) {
    vec2 g = uv * uResolution * 0.5;
    return fract(sin(dot(g + t, vec2(12.9898, 78.233))) * 43758.5453) * 2. - 1.;
  }

  void main() {
    vec2 uv = vUv;
    vec4 tt = texture2D(uTouchTexture, uv);
    float vx = -(tt.r * 2. - 1.), vy = -(tt.g * 2. - 1.), ti = tt.b;
    uv.x += vx * .7 * ti; uv.y += vy * .7 * ti;
    float dist = length(uv - .5);
    uv += vec2(sin(dist * 18. - uTime * 3.) * .035 * ti);

    float t = uTime, r = uGradientSize;
    vec2 c1  = vec2(.5+sin(t*uSpeed*.40)*.42, .5+cos(t*uSpeed*.50)*.42);
    vec2 c2  = vec2(.5+cos(t*uSpeed*.60)*.48, .5+sin(t*uSpeed*.45)*.48);
    vec2 c3  = vec2(.5+sin(t*uSpeed*.35)*.44, .5+cos(t*uSpeed*.55)*.44);
    vec2 c4  = vec2(.5+cos(t*uSpeed*.50)*.40, .5+sin(t*uSpeed*.40)*.40);
    vec2 c5  = vec2(.5+sin(t*uSpeed*.70)*.34, .5+cos(t*uSpeed*.60)*.34);
    vec2 c6  = vec2(.5+cos(t*uSpeed*.45)*.50, .5+sin(t*uSpeed*.65)*.50);
    vec2 c7  = vec2(.5+sin(t*uSpeed*.55)*.37, .5+cos(t*uSpeed*.48)*.41);
    vec2 c8  = vec2(.5+cos(t*uSpeed*.65)*.35, .5+sin(t*uSpeed*.52)*.43);
    vec2 c9  = vec2(.5+sin(t*uSpeed*.42)*.40, .5+cos(t*uSpeed*.58)*.38);
    vec2 c10 = vec2(.5+cos(t*uSpeed*.48)*.36, .5+sin(t*uSpeed*.62)*.42);
    vec2 c11 = vec2(.5+sin(t*uSpeed*.68)*.32, .5+cos(t*uSpeed*.44)*.45);
    vec2 c12 = vec2(.5+cos(t*uSpeed*.38)*.38, .5+sin(t*uSpeed*.56)*.40);

    #define INF(c) (1.-smoothstep(0.,r,length(uv-c)))
    vec3 col = vec3(0.);
    col += uColor1*INF(c1)*(.55+.45*sin(t*uSpeed))*uColor1Weight;
    col += uColor2*INF(c2)*(.55+.45*cos(t*uSpeed*1.2))*uColor2Weight;
    col += uColor3*INF(c3)*(.55+.45*sin(t*uSpeed*.8))*uColor1Weight;
    col += uColor4*INF(c4)*(.55+.45*cos(t*uSpeed*1.3))*uColor2Weight;
    col += uColor5*INF(c5)*(.55+.45*sin(t*uSpeed*1.1))*uColor1Weight;
    col += uColor6*INF(c6)*(.55+.45*cos(t*uSpeed*.9))*uColor2Weight;
    col += uColor1*INF(c7)*(.55+.45*sin(t*uSpeed*1.4))*uColor1Weight;
    col += uColor2*INF(c8)*(.55+.45*cos(t*uSpeed*1.5))*uColor2Weight;
    col += uColor3*INF(c9)*(.55+.45*sin(t*uSpeed*1.6))*uColor1Weight;
    col += uColor4*INF(c10)*(.55+.45*cos(t*uSpeed*1.7))*uColor2Weight;
    col += uColor5*INF(c11)*(.55+.45*sin(t*uSpeed*1.8))*uColor1Weight;
    col += uColor6*INF(c12)*(.55+.45*cos(t*uSpeed*1.9))*uColor2Weight;

    vec2 ru1=uv-.5; float a1=t*uSpeed*.15;
    ru1=vec2(ru1.x*cos(a1)-ru1.y*sin(a1),ru1.x*sin(a1)+ru1.y*cos(a1))+.5;
    vec2 ru2=uv-.5; float a2=-t*uSpeed*.12;
    ru2=vec2(ru2.x*cos(a2)-ru2.y*sin(a2),ru2.x*sin(a2)+ru2.y*cos(a2))+.5;
    col += mix(uColor1,uColor3,1.-smoothstep(0.,.8,length(ru1-.5)))*.12*uColor1Weight;
    col += mix(uColor2,uColor4,1.-smoothstep(0.,.8,length(ru2-.5)))*.10*uColor2Weight;

    col = clamp(col,0.,1.)*uIntensity;
    float lum = dot(col,vec3(.299,.587,.114));
    col = mix(vec3(lum),col,0.85);
    col = pow(col,vec3(1.2));
    col = mix(uDarkBase, col, max(length(col)*0.9, 0.18));
    col = clamp(col,0.,1.);
    col += grain(uv,uTime)*uGrainIntensity;
    col.r += sin(t*.5)*.015; col.g += cos(t*.7)*.015; col.b += sin(t*.6)*.01;
    gl_FragColor = vec4(clamp(col,0.,1.),1.);
  }
`;

export default function Hero() {
    const mountRef = useRef(null);
    const [cursorPos, setCursorPos] = useState({x: -100, y: -100});
    const [cursorBig, setCursorBig] = useState(false);
    const [insideHero, setInsideHero] = useState(false);

    useEffect(() => {
        const el = mountRef.current;
        if (!el) return;

        const touch = new TouchTexture();
        touch.init();

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        el.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(
            45,
            innerWidth / innerHeight,
            0.1,
            10000,
        );
        camera.position.z = 50;
        const scene = new THREE.Scene();

        const getViewSize = () => {
            const fov = (camera.fov * Math.PI) / 180;
            const h = Math.abs(camera.position.z * Math.tan(fov / 2) * 2);
            return {w: h * camera.aspect, h};
        };

        const uniforms = {
            uTime: {value: 0},
            uResolution: {value: new THREE.Vector2(innerWidth, innerHeight)},
            uColor1: {value: new THREE.Vector3(0.02, 0.38, 0.42)},
            uColor2: {value: new THREE.Vector3(0.92, 0.35, 0.22)},
            uColor3: {value: new THREE.Vector3(0.04, 0.55, 0.58)},
            uColor4: {value: new THREE.Vector3(0.02, 0.18, 0.2)},
            uColor5: {value: new THREE.Vector3(0.98, 0.55, 0.3)},
            uColor6: {value: new THREE.Vector3(0.01, 0.1, 0.12)},
            // uIntensity: {value: 0.82},
            uIntensity: {value: 1.05},
            uDarkBase: {value: new THREE.Vector3(0.01, 0.08, 0.1)},
            uSpeed: {value: 0.9},
            uTouchTexture: {value: touch.texture},
            uGrainIntensity: {value: 0.1},
            uGradientSize: {value: 0.35},
            uColor1Weight: {value: 1.0},
            uColor2Weight: {value: 1.0},
        };

        const {w, h} = getViewSize();
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(w, h, 1, 1),
            new THREE.ShaderMaterial({uniforms, vertexShader, fragmentShader}),
        );
        scene.add(mesh);

        const clock = new THREE.Timer();
        let animId;

        const tick = () => {
            animId = requestAnimationFrame(tick);
            clock.update();
            uniforms.uTime.value += Math.min(clock.getDelta(), 0.1);
            touch.update();
            renderer.render(scene, camera);
        };
        tick();

        const onMouseMove = (e) => {
            setCursorPos({x: e.clientX, y: e.clientY});
            touch.addTouch({
                x: e.clientX / innerWidth,
                y: 1 - e.clientY / innerHeight,
            });
        };

        let resizeTimer;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                camera.aspect = innerWidth / innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(innerWidth, innerHeight);
                uniforms.uResolution.value.set(innerWidth, innerHeight);
                const v = getViewSize();
                mesh.geometry.dispose();
                mesh.geometry = new THREE.PlaneGeometry(v.w, v.h, 1, 1);
            }, 100);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(animId);
            clearTimeout(resizeTimer);
            renderer.dispose();
            el.removeChild(renderer.domElement);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
            <div 
                className="relative h-screen overflow-hidden cursor-none"
                onMouseEnter={() => setInsideHero(true)}
                onMouseLeave={() => setInsideHero(false)}
                // onWheel={(e) => e.stopPropagation()}
            >
            {insideHero && (
            <div
                style={{
                    position: "fixed",
                    left: cursorPos.x,
                    top: cursorPos.y,
                    width: cursorBig ? 52 : 36,
                    height: cursorBig ? 52 : 36,
                    border: "1.5px solid rgba(255,255,255,0.7)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    zIndex: 999,
                    transform: "translate(-50%,-50%)",
                    transition: "width .15s ease, height .15s ease",
                }}>
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        width: 5,
                        height: 5,
                        background: "white",
                        borderRadius: "50%",
                    }}
                />
            </div>
            )}


            {/* Canvas */}
            <div ref={mountRef} className="absolute inset-0 z-0" />

            {/* Overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: "none",
                    background:
                        "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)",
                }}
            />

            {/* Main content */}
            <section className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-[8vw]">
                <motion.span
                    className="font-mono text-[0.9rem] tracking-[0.4em] uppercase mb-7"
                    initial={{opacity: 0, y: 16}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1, delay: 0.2}}
                    style={{
                        color: "rgba(255,255,255,0.92)",
                        background: "rgba(255,255,255,0.08)",
                        backdropFilter: "blur(16px) saturate(180%)",
                        WebkitBackdropFilter: "blur(16px) saturate(180%)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        borderRadius: "999px",
                        padding: "0.45rem 1.4rem",
                        boxShadow:
                            "0 2px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.15)",
                    }}>
                    Frontend Developer — Growing Full-Stack
                </motion.span>

                <motion.h1
                    className="font-serif font-normal leading-[0.95] tracking-tight mb-8"
                    style={{
                        fontSize: "clamp(4.5rem,10vw,9rem)",
                        color: "rgba(255,255,255,0.97)",
                    }}
                    initial={{opacity: 0, y: 16}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1, delay: 0.4}}>
                    Crafting
                    <br />
                    Digital
                    <br />
                    <em
                        style={{
                            color: "rgba(255,255,255,0.5)",
                            fontStyle: "italic",
                        }}>
                        Experiences
                    </em>
                </motion.h1>

                <motion.p
                    className="font-mono text-[1rem] tracking-wider leading-loose mb-10"
                    initial={{opacity: 0, y: 16}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1, delay: 0.6}}
                    style={{
                        color: "rgba(255,255,255,0.88)",
                        background: "rgba(255,255,255,0.06)",
                        backdropFilter: "blur(20px) saturate(160%)",
                        WebkitBackdropFilter: "blur(20px) saturate(160%)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "16px",
                        padding: "1.1rem 2rem",
                        boxShadow:
                            "0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.12)",
                        maxWidth: "340px",
                    }}>
                    Thoughtful interfaces.
                    <br />
                    Purposeful motion.
                    <br />
                    Work that speaks.
                </motion.p>

                <motion.div
                    className="flex gap-3"
                    initial={{opacity: 0, y: 16}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 1, delay: 0.8}}>
                    <button 
                    onClick={() => document.getElementById('projects').scrollIntoView({behavior: "smooth"})}
                    href="#projects"
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.62rem",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            padding: "0.75rem 2rem",
                            borderRadius: "4px",
                            border: "1px solid rgba(255,255,255,0.5)",
                            background: "rgba(255,255,255,0.15)",
                            backdropFilter: "blur(20px) saturate(180%)",
                            WebkitBackdropFilter: "blur(20px) saturate(180%)",
                            color: "rgba(255,255,255,0.95)",
                            boxShadow:
                                "0 2px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
                            cursor: "pointer",
                            transition:
                                "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, transform 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                                "rgba(180, 240, 245, 0.25)";
                            e.currentTarget.style.borderColor =
                                "rgba(180, 240, 245, 0.9)";
                            e.currentTarget.style.boxShadow =
                                "0 0 28px rgba(140, 230, 240, 0.7), 0 0 60px rgba(10, 200, 210, 0.35), inset 0 1px 0 rgba(255,255,255,0.4)";
                            e.currentTarget.style.color =
                                "rgba(220, 250, 255, 1)";
                            e.currentTarget.style.transform = "translateX(4px)";
                            setCursorBig(true);
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                                "rgba(255,255,255,0.15)";
                            e.currentTarget.style.borderColor =
                                "rgba(255,255,255,0.5)";
                            e.currentTarget.style.boxShadow =
                                "0 2px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)";
                            e.currentTarget.style.color =
                                "rgba(255,255,255,0.95)";
                            e.currentTarget.style.transform = "translateX(0)";
                            setCursorBig(false);
                        }}>
                        View Work
                    </button>
                    <button
                    onClick={() => document.getElementById('contact-form').scrollIntoView({behavior: "smooth"})}
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.62rem",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            padding: "0.75rem 2rem",
                            borderRadius: "4px",
                            border: "1px solid rgba(255,255,255,0.2)",
                            background: "rgba(255,255,255,0.05)",
                            backdropFilter: "blur(20px) saturate(180%)",
                            WebkitBackdropFilter: "blur(20px) saturate(180%)",
                            color: "rgba(255,255,255,0.7)",
                            boxShadow:
                                "0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
                            cursor: "pointer",
                            transition:
                                "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, transform 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                                "rgba(255, 200, 170, 0.15)";
                            e.currentTarget.style.borderColor =
                                "rgba(255, 200, 170, 0.7)";
                            e.currentTarget.style.boxShadow =
                                "0 0 28px rgba(255, 150, 100, 0.5), 0 0 60px rgba(235, 89, 56, 0.25), inset 0 1px 0 rgba(255,255,255,0.3)";
                            e.currentTarget.style.color =
                                "rgba(255, 230, 210, 1)";
                            e.currentTarget.style.transform = "translateX(4px)";
                            setCursorBig(true);
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                                "rgba(255,255,255,0.05)";
                            e.currentTarget.style.borderColor =
                                "rgba(255,255,255,0.2)";
                            e.currentTarget.style.boxShadow =
                                "0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)";
                            e.currentTarget.style.color =
                                "rgba(255,255,255,0.7)";
                            e.currentTarget.style.transform = "translateX(0)";
                            setCursorBig(false);
                        }}>
                        Get in Touch
                    </button>
                </motion.div>
            </section>
        </div>
    );
}
