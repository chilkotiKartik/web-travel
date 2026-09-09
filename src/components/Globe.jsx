import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import landRings from '../data/worldLand.json'

const RADIUS = 1

/** Lat/lng in degrees to a point on a sphere of the given radius. */
function toVector(lat, lng, radius = RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

/** The rotation that brings a given lat/lng to the front of the camera. */
function rotationFor(lat, lng) {
  return { x: THREE.MathUtils.degToRad(lat) * 0.6, y: -THREE.MathUtils.degToRad(lng + 90) }
}

function buildLandLines() {
  const positions = []
  for (const ring of landRings) {
    for (let i = 0; i < ring.length - 1; i++) {
      const a = toVector(ring[i][1], ring[i][0], RADIUS * 1.002)
      const b = toVector(ring[i + 1][1], ring[i + 1][0], RADIUS * 1.002)
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({ color: 0x6ee7a8, transparent: true, opacity: 0.85 })
  )
}

function buildGraticule() {
  const positions = []
  const step = 4
  for (let lat = -60; lat <= 60; lat += 30) {
    for (let lng = -180; lng < 180; lng += step) {
      const a = toVector(lat, lng, RADIUS * 1.001)
      const b = toVector(lat, lng + step, RADIUS * 1.001)
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
    }
  }
  for (let lng = -180; lng < 180; lng += 30) {
    for (let lat = -90; lat < 90; lat += step) {
      const a = toVector(lat, lng, RADIUS * 1.001)
      const b = toVector(lat + step, lng, RADIUS * 1.001)
      positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({ color: 0x2b5fb8, transparent: true, opacity: 0.28 })
  )
}

const ATMOSPHERE_VERT = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const ATMOSPHERE_FRAG = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
    gl_FragColor = vec4(0.31, 0.62, 1.0, 1.0) * intensity;
  }
`

/**
 * An interactive WebGL globe: real coastlines, one marker per journey, drag to
 * spin, click a marker to select. Falls back to null (the page shows its list
 * instead) when WebGL is unavailable.
 */
export function Globe({ points, selectedId, onSelect, onHover, zoom = 3.15, className = '' }) {
  const mountRef = useRef(null)
  const stateRef = useRef({})
  const handlersRef = useRef({ onSelect, onHover })
  const zoomRef = useRef(zoom)
  const [failed, setFailed] = useState(false)

  zoomRef.current = zoom

  handlersRef.current = { onSelect, onHover }

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      setFailed(true)
      return undefined
    }

    const width = mount.clientWidth || 480
    const height = mount.clientHeight || 480
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    camera.position.z = zoomRef.current

    const globe = new THREE.Group()
    // Open on South Asia — that is where almost every marker is.
    const home = rotationFor(24, 82)
    globe.rotation.x = home.x
    globe.rotation.y = home.y
    scene.add(globe)

    const ocean = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x081634 })
    )
    globe.add(ocean)
    globe.add(buildGraticule())
    globe.add(buildLandLines())

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.16, 48, 48),
      new THREE.ShaderMaterial({
        vertexShader: ATMOSPHERE_VERT,
        fragmentShader: ATMOSPHERE_FRAG,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      })
    )
    scene.add(atmosphere)

    // Markers
    const markerGeometry = new THREE.SphereGeometry(0.016, 12, 12)
    const markers = points.map((point) => {
      const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(point.color), transparent: true })
      const mesh = new THREE.Mesh(markerGeometry, material)
      mesh.position.copy(toVector(point.lat, point.lng, RADIUS * 1.015))
      mesh.userData.point = point
      globe.add(mesh)

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 12, 12),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(point.color), transparent: true, opacity: 0 })
      )
      halo.position.copy(mesh.position)
      globe.add(halo)

      return { mesh, halo, point }
    })

    const pointer = new THREE.Vector2()
    const projected = new THREE.Vector3()
    const state = {
      dragging: false,
      lastX: 0,
      lastY: 0,
      velocity: 0.0016,
      dragDistance: 0,
      pressPoint: null,
      targetRotation: null,
      hoveredId: null,
      pointerInside: false,
    }
    stateRef.current = { globe, state, markers, camera, renderer }

    function setPointerFromEvent(event) {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    /** Nearest marker to the pointer in screen space, front hemisphere only.
     * Screen-space picking rather than a raycast: the markers are small and
     * cluster tightly in the Himalaya, so "closest to where you aimed" is both
     * more forgiving and steadier than hitting a 16px sphere exactly. */
    function pick() {
      const rect = renderer.domElement.getBoundingClientRect()
      const px = ((pointer.x + 1) / 2) * rect.width
      const py = ((1 - pointer.y) / 2) * rect.height
      const tolerance = Math.max(14, rect.width * 0.035)

      let best = null
      let bestDistance = Infinity
      for (const { mesh, point } of markers) {
        mesh.getWorldPosition(projected)
        if (projected.clone().normalize().z < 0.12) continue // behind the globe
        projected.project(camera)
        const sx = ((projected.x + 1) / 2) * rect.width
        const sy = ((1 - projected.y) / 2) * rect.height
        const distance = Math.hypot(sx - px, sy - py)
        if (distance < tolerance && distance < bestDistance) {
          bestDistance = distance
          best = point
        }
      }
      return best
    }

    function onPointerDown(event) {
      state.dragging = true
      state.lastX = event.clientX
      state.lastY = event.clientY
      state.dragDistance = 0
      state.targetRotation = null
      // Remember what was under the pointer when it went down: a click resolves
      // to that, so a marker can't drift out from under a tap between press and
      // release.
      setPointerFromEvent(event)
      state.pressPoint = pick()
      renderer.domElement.setPointerCapture?.(event.pointerId)
    }

    function onPointerMove(event) {
      state.pointerInside = true
      setPointerFromEvent(event)
      if (state.dragging) {
        const dx = event.clientX - state.lastX
        const dy = event.clientY - state.lastY
        state.dragDistance += Math.abs(dx) + Math.abs(dy)
        globe.rotation.y += dx * 0.005
        globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + dy * 0.005, -1.1, 1.1)
        state.velocity = dx * 0.0004
        state.lastX = event.clientX
        state.lastY = event.clientY
        return
      }
      const hit = pick()
      const id = hit?.id ?? null
      if (id !== state.hoveredId) {
        state.hoveredId = id
        renderer.domElement.style.cursor = id ? 'pointer' : 'grab'
        handlersRef.current.onHover?.(hit)
      }
    }

    function onPointerUp() {
      state.dragging = false
      renderer.domElement.style.cursor = state.hoveredId ? 'pointer' : 'grab'
    }

    function onPointerLeave() {
      state.dragging = false
      state.pointerInside = false
      if (state.hoveredId) {
        state.hoveredId = null
        handlersRef.current.onHover?.(null)
      }
    }

    function onClick(event) {
      if (state.dragDistance > 6) return // that was a spin, not a pick
      setPointerFromEvent(event)
      const hit = pick() || state.pressPoint
      if (hit) handlersRef.current.onSelect?.(hit)
    }

    const el = renderer.domElement
    el.style.cursor = 'grab'
    el.style.touchAction = 'pan-y'
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointerleave', onPointerLeave)
    el.addEventListener('click', onClick)

    const resize = new ResizeObserver(() => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (!w || !h) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    resize.observe(mount)

    const cameraDirection = new THREE.Vector3()
    const worldPosition = new THREE.Vector3()
    let frame

    function animate(time) {
      frame = requestAnimationFrame(animate)

      if (state.targetRotation) {
        globe.rotation.x += (state.targetRotation.x - globe.rotation.x) * 0.08
        globe.rotation.y += (state.targetRotation.y - globe.rotation.y) * 0.08
        if (
          Math.abs(state.targetRotation.x - globe.rotation.x) < 0.002 &&
          Math.abs(state.targetRotation.y - globe.rotation.y) < 0.002
        ) {
          state.targetRotation = null
        }
      } else if (!state.dragging && !reduced && !state.pointerInside) {
        // Hold still while the pointer is over the globe, so a marker stays put
        // long enough to be aimed at and tapped.
        globe.rotation.y += state.velocity
        state.velocity += (0.0016 - state.velocity) * 0.02
      }

      // Fade markers that have rotated behind the globe, and pulse the selected one.
      camera.getWorldDirection(cameraDirection)
      const pulse = reduced ? 1 : 1 + Math.sin(time / 320) * 0.35
      for (const { mesh, halo, point } of markers) {
        mesh.getWorldPosition(worldPosition)
        const facing = worldPosition.clone().normalize().dot(cameraDirection.clone().negate())
        const visible = THREE.MathUtils.clamp((facing + 0.15) * 2.2, 0, 1)
        const active = point.id === state.selectedId || point.id === state.hoveredId
        mesh.material.opacity = visible * (active ? 1 : 0.82)
        mesh.scale.setScalar(active ? 1.7 : 1)
        halo.material.opacity = active ? visible * 0.34 : 0
        halo.scale.setScalar(active ? pulse * 1.4 : 1)
      }

      // Ease toward the requested distance — filtering to one region zooms in.
      camera.position.z += (zoomRef.current - camera.position.z) * 0.06

      renderer.render(scene, camera)
    }
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointerleave', onPointerLeave)
      el.removeEventListener('click', onClick)
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((m) => m.dispose())
        }
      })
      renderer.dispose()
      if (el.parentNode === mount) mount.removeChild(el)
    }
  }, [points])

  // Spin the selected marker to the front, and let the render loop read the selection.
  useEffect(() => {
    const { state, markers } = stateRef.current
    if (!state) return
    state.selectedId = selectedId
    const target = markers?.find((m) => m.point.id === selectedId)
    if (target) state.targetRotation = rotationFor(target.point.lat, target.point.lng)
  }, [selectedId])

  if (failed) return null
  return <div ref={mountRef} className={className} />
}
