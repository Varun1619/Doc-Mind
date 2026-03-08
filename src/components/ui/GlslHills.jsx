import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function GlslHills({ width = '100%', height = '100%', cameraZ = 125, planeSize = 256, speed = 0.5 }) {
  const canvasRef = useRef(null)
  const frameRef  = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true })
    renderer.setClearColor(0x000000, 0)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 1, 10000)
    const clock  = new THREE.Clock()

    camera.position.set(0, 16, cameraZ)
    camera.lookAt(new THREE.Vector3(0, 28, 0))

    // ── Plane mesh with GLSL noise ────────────────────────────────────────
    const uniforms = { time: { type: 'f', value: 0 } }

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(planeSize, planeSize, planeSize, planeSize),
      new THREE.RawShaderMaterial({
        uniforms,
        transparent: true,
        vertexShader: `
          #define GLSLIFY 1
          attribute vec3 position;
          uniform mat4 projectionMatrix;
          uniform mat4 modelViewMatrix;
          uniform float time;
          varying vec3 vPosition;

          mat4 rotateMatrixX(float r) {
            return mat4(1,0,0,0, 0,cos(r),-sin(r),0, 0,sin(r),cos(r),0, 0,0,0,1);
          }
          vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
          vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
          vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
          vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
          vec3 fade(vec3 t){return t*t*t*(t*(t*6.-15.)+10.);}

          float cnoise(vec3 P){
            vec3 Pi0=floor(P); vec3 Pi1=Pi0+1.;
            Pi0=mod289v3(Pi0); Pi1=mod289v3(Pi1);
            vec3 Pf0=fract(P); vec3 Pf1=Pf0-1.;
            vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
            vec4 iy=vec4(Pi0.yy,Pi1.yy);
            vec4 iz0=Pi0.zzzz, iz1=Pi1.zzzz;
            vec4 ixy=permute(permute(ix)+iy);
            vec4 ixy0=permute(ixy+iz0), ixy1=permute(ixy+iz1);
            vec4 gx0=ixy0*(1./7.);
            vec4 gy0=fract(floor(gx0)*(1./7.))-.5; gx0=fract(gx0);
            vec4 gz0=vec4(.5)-abs(gx0)-abs(gy0);
            vec4 sz0=step(gz0,vec4(0.));
            gx0-=sz0*(step(0.,gx0)-.5); gy0-=sz0*(step(0.,gy0)-.5);
            vec4 gx1=ixy1*(1./7.);
            vec4 gy1=fract(floor(gx1)*(1./7.))-.5; gx1=fract(gx1);
            vec4 gz1=vec4(.5)-abs(gx1)-abs(gy1);
            vec4 sz1=step(gz1,vec4(0.));
            gx1-=sz1*(step(0.,gx1)-.5); gy1-=sz1*(step(0.,gy1)-.5);
            vec3 g000=vec3(gx0.x,gy0.x,gz0.x), g100=vec3(gx0.y,gy0.y,gz0.y);
            vec3 g010=vec3(gx0.z,gy0.z,gz0.z), g110=vec3(gx0.w,gy0.w,gz0.w);
            vec3 g001=vec3(gx1.x,gy1.x,gz1.x), g101=vec3(gx1.y,gy1.y,gz1.y);
            vec3 g011=vec3(gx1.z,gy1.z,gz1.z), g111=vec3(gx1.w,gy1.w,gz1.w);
            vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
            g000*=norm0.x; g010*=norm0.y; g100*=norm0.z; g110*=norm0.w;
            vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
            g001*=norm1.x; g011*=norm1.y; g101*=norm1.z; g111*=norm1.w;
            float n000=dot(g000,Pf0), n100=dot(g100,vec3(Pf1.x,Pf0.yz));
            float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)), n110=dot(g110,vec3(Pf1.xy,Pf0.z));
            float n001=dot(g001,vec3(Pf0.xy,Pf1.z)), n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
            float n011=dot(g011,vec3(Pf0.x,Pf1.yz)), n111=dot(g111,Pf1);
            vec3 fade_xyz=fade(Pf0);
            vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
            vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
            return 2.2*mix(n_yz.x,n_yz.y,fade_xyz.x);
          }

          void main(void){
            vec3 up=(rotateMatrixX(radians(90.))*vec4(position,1.)).xyz;
            float s=sin(radians(up.x/128.*90.));
            vec3 np=up+vec3(0.,0.,time*-30.);
            float n1=cnoise(np*.08), n2=cnoise(np*.06), n3=cnoise(np*.4);
            vec3 lp=up+vec3(0.,
              n1*s*8.+n2*s*8.+n3*(abs(s)*2.+.5)+pow(s,2.)*40.,0.);
            vPosition=lp;
            gl_Position=projectionMatrix*modelViewMatrix*vec4(lp,1.);
          }
        `,
        fragmentShader: `
          precision highp float;
          #define GLSLIFY 1
          varying vec3 vPosition;
          void main(void){
            float opacity=(96.-length(vPosition))/256.*.6;
            gl_FragColor=vec4(vec3(0.6),opacity);
          }
        `,
      })
    )

    scene.add(mesh)

    // ── Resize ────────────────────────────────────────────────────────────
    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement)
    resize()

    // ── Render loop ───────────────────────────────────────────────────────
    const loop = () => {
      uniforms.time.value += clock.getDelta() * speed
      renderer.render(scene, camera)
      frameRef.current = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(frameRef.current)
      ro.disconnect()
      renderer.dispose()
      mesh.geometry.dispose()
      mesh.material.dispose()
    }
  }, [cameraZ, planeSize, speed])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
    />
  )
}
