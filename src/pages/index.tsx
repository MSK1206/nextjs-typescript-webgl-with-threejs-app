import Head from 'next/head'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useEffect, useRef } from 'react'
import styles from '@/styles/Home.module.css'

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const viewWidth = 660
    const viewHeight = 350
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(viewWidth, viewHeight)
    const threeModel = mountRef.current
    threeModel?.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xbfe3dd)

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      1,
      600
    )
    camera.position.set(0, 0, 40)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0.5, 0)
    controls.update()
    controls.enablePan = false
    controls.enableDamping = true

    const frontlight = new THREE.PointLight(0xffffff)
    frontlight.position.set(0, 0, 40)
    scene.add(frontlight)

    const backlight = new THREE.PointLight(0xffffff)
    backlight.position.set(0, 0, -40)
    scene.add(backlight)

    const loader = new GLTFLoader()
    loader.load(
      './model/Totoro.glb',
      function (gltf) {
        scene.add(gltf.scene)
      },
      undefined,
      function (error) {
        console.error(error)
      }
    )

    const tick = () => {
      renderer.render(scene, camera)

      requestAnimationFrame(tick)
    }

    tick()

    return () => {
      threeModel?.removeChild(renderer.domElement)
    }
  }, [])
  return (
    <>
      <Head>
        <title>Next.js + TypeScript + WebGL with Threejs App</title>
        <meta
          name="description"
          content="Next.js + TypeScript + WebGL with Threejs App"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* Three.js Model View. */}
        <div ref={mountRef} />
      </main>
    </>
  )
}
