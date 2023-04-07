import Head from 'next/head'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useEffect, useRef } from 'react'
import styles from '@/styles/Home.module.css'

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const viewWidth = 1200
    const viewHeight = 600
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(viewWidth, viewHeight)
    const threeModel = mountRef.current
    threeModel?.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xbfe3dd)

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    )
    camera.position.set(-5, 3, 10)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0.5, 0)
    controls.update()
    controls.enablePan = false
    controls.enableDamping = true

    const material = new THREE.LineBasicMaterial({ color: 0x0000ff })

    const points = []
    points.push(new THREE.Vector3(-10, 0, 0))
    points.push(new THREE.Vector3(0, 10, 0))
    points.push(new THREE.Vector3(10, 0, 0))

    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    const line = new THREE.Line(geometry, material)

    const loader = new GLTFLoader()
    loader.load(
      './model/house.glb',
      function (gltf) {
        scene.add(gltf.scene)
      },
      undefined,
      function (error) {
        console.error(error)
      }
    )

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0)
    const x = 597
    const y = 213

    const tick = () => {
      scene.add(line, directionalLight)
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
