"use client"

import React, { useRef, useEffect } from "react"
import * as THREE from "three"

interface ShaderAnimationProps {
  className?: string
}

export const ShaderAnimation = ({ className }: ShaderAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() },
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;

        void main() {
          vec2 uv = gl_FragCoord.xy / resolution.xy;
          float noise = sin(uv.x * 10.0 + time * 0.5) * cos(uv.y * 10.0 + time * 0.5);
          vec3 color = mix(vec3(0.08, 0.08, 0.08), vec3(1.0, 0.55, 0.26), noise * 0.05);
          gl_FragColor = vec4(color, 0.3);
        }
      `,
      transparent: true,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const animate = (t: number) => {
      material.uniforms.time.value = t * 0.001
      material.uniforms.resolution.value.set(
        containerRef.current?.clientWidth || 0,
        containerRef.current?.clientHeight || 0
      )
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!containerRef.current) return
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)
    requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className={className} />
}
