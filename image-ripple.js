import * as THREE from 'three';

const VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform vec4 winResolution;
varying vec2 vUv;
float PI = 3.141592653589793238;

void main() {
  vec2 vUvScreen = gl_FragCoord.xy / winResolution.xy;

  vec4 displacement = texture2D(uDisplacement, vUvScreen);
  float theta = displacement.r * 2.0 * PI;

  vec2 dir = vec2(sin(theta), cos(theta));
  vec2 uv = vUvScreen + dir * displacement.r * 0.075;
  vec4 color = texture2D(uTexture, uv);

  gl_FragColor = color;
}
`;

function loadAnimatedGif(src) {
  return new Promise((resolve, reject) => {
    if (typeof window.gifler !== 'function') {
      reject(new Error('gifler is not loaded'));
      return;
    }

    const gifCanvas = document.createElement('canvas');
    const texture = new THREE.CanvasTexture(gifCanvas);
    texture.colorSpace = THREE.NoColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const timeout = window.setTimeout(() => {
      reject(new Error(`GIF load timeout: ${src}`));
    }, 10000);

    window.gifler(src).get((animator) => {
      window.clearTimeout(timeout);
      gifCanvas.width = animator.width;
      gifCanvas.height = animator.height;
      animator.animateInCanvas(gifCanvas);
      texture.needsUpdate = true;
      resolve({
        texture,
        width: animator.width,
        height: animator.height,
      });
    });
  });
}

function getCoverScale(containerW, containerH, mediaW, mediaH) {
  const containerAspect = containerW / containerH;
  const mediaAspect = mediaW / mediaH;

  if (mediaAspect > containerAspect) {
    return { width: containerH * mediaAspect, height: containerH };
  }

  return { width: containerW, height: containerW / mediaAspect };
}

class ImageRippleEffect {
  constructor(container, gifSrc, fallbackImage) {
    this.container = container;
    this.gifSrc = gifSrc;
    this.fallbackImage = fallbackImage;
    this.width = 0;
    this.height = 0;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.mouse = { x: 0, y: 0 };
    this.prevMouse = { x: 0, y: 0 };
    this.currentWave = 0;
    this.maxWaves = 100;
    this.waveMeshes = [];
    this.rafId = null;
    this.isDestroyed = false;
    this.rippleEnabled = true;
    this.renderer = null;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'avatar-ripple__canvas';
    this.canvas.setAttribute('aria-hidden', 'true');

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onResize = this.onResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  async start() {
    try {
      THREE.ColorManagement.enabled = false;

      const [brushTexture, gifData] = await Promise.all([
        this.loadTexture('images/brush.png'),
        loadAnimatedGif(this.gifSrc),
      ]);

      this.brushTexture = brushTexture;
      this.brushTexture.colorSpace = THREE.NoColorSpace;
      this.imageTexture = gifData.texture;
      this.mediaWidth = gifData.width;
      this.mediaHeight = gifData.height;

      this.container.appendChild(this.canvas);
      this.setupRenderer();
      this.setupScene();
      this.setupWaves();
      this.setupImageScene();
      this.setupShaderPlane();
      this.bindEvents();
      this.resize();
      this.rafId = requestAnimationFrame(this.animate);
    } catch (error) {
      console.warn('Ripple effect unavailable, showing animated GIF instead.', error);
      this.showPlainGifFallback();
    }
  }

  showPlainGifFallback() {
    if (this.fallbackImage) {
      this.fallbackImage.classList.add('avatar-ripple__source--visible');
    }
  }

  loadTexture(src) {
    return new Promise((resolve, reject) => {
      new THREE.TextureLoader().load(src, resolve, undefined, reject);
    });
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
    this.camera.position.z = 2;

    this.waveScene = new THREE.Scene();

    this.fboBase = new THREE.WebGLRenderTarget(1, 1);
    this.fboTexture = new THREE.WebGLRenderTarget(1, 1);
    this.fboTexture.texture.colorSpace = THREE.NoColorSpace;
    this.fboBase.texture.colorSpace = THREE.NoColorSpace;
  }

  setupWaves() {
    const geometry = new THREE.PlaneGeometry(60, 60, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: this.brushTexture,
      transparent: true,
    });

    for (let i = 0; i < this.maxWaves; i++) {
      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.visible = false;
      mesh.rotation.z = Math.random();
      this.waveMeshes.push(mesh);
    }
  }

  setupImageScene() {
    this.imageScene = new THREE.Scene();
    this.imageCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
    this.imageCamera.position.z = 2;
    this.imageScene.add(this.imageCamera);

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: this.imageTexture,
      toneMapped: false,
    });
    this.imagePlane = new THREE.Mesh(geometry, material);
    this.imagePlane.position.z = 1;
    this.imageScene.add(this.imagePlane);
  }

  setupShaderPlane() {
    this.uniforms = {
      uDisplacement: { value: null },
      uTexture: { value: null },
      winResolution: { value: new THREE.Vector2(1, 1) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      toneMapped: false,
      uniforms: this.uniforms,
    });

    this.shaderPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    this.scene.add(this.shaderPlane);
  }

  bindEvents() {
    this.container.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('resize', this.onResize);
  }

  onMouseMove(event) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = event.clientX - rect.left;
    this.mouse.y = event.clientY - rect.top;
  }

  onResize() {
    this.resize();
  }

  resize() {
    if (!this.renderer) return;

    const rect = this.container.getBoundingClientRect();
    this.width = Math.max(1, Math.round(rect.width));
    this.height = Math.max(1, Math.round(rect.height));
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(this.width, this.height, false);

    const renderWidth = this.width * this.pixelRatio;
    const renderHeight = this.height * this.pixelRatio;

    this.fboBase.setSize(renderWidth, renderHeight);
    this.fboTexture.setSize(renderWidth, renderHeight);

    this.camera.left = this.width / -2;
    this.camera.right = this.width / 2;
    this.camera.top = this.height / 2;
    this.camera.bottom = this.height / -2;
    this.camera.updateProjectionMatrix();

    this.imageCamera.left = this.width / -2;
    this.imageCamera.right = this.width / 2;
    this.imageCamera.top = this.height / 2;
    this.imageCamera.bottom = this.height / -2;
    this.imageCamera.updateProjectionMatrix();

    this.shaderPlane.scale.set(this.width, this.height, 1);
    this.updateImagePlaneScale();

    this.uniforms.winResolution.value.set(renderWidth, renderHeight);
  }

  updateImagePlaneScale() {
    if (!this.imagePlane || !this.mediaWidth || !this.mediaHeight) return;

    const { width, height } = getCoverScale(
      this.width,
      this.height,
      this.mediaWidth,
      this.mediaHeight
    );

    this.imagePlane.scale.set(width, height, 1);
  }

  setNewWave(x, y, waveIndex) {
    const mesh = this.waveMeshes[waveIndex];
    if (!mesh) return;

    mesh.position.set(x, y, 0);
    mesh.visible = true;
    mesh.material.opacity = 1;
    mesh.scale.set(1.75, 1.75, 1);
  }

  trackMouse() {
    if (!this.rippleEnabled) return;

    const x = this.mouse.x - this.width / 2;
    const y = -this.mouse.y + this.height / 2;

    if (Math.abs(x - this.prevMouse.x) > 0.1 || Math.abs(y - this.prevMouse.y) > 0.1) {
      this.setNewWave(x, y, this.currentWave);
      this.currentWave = (this.currentWave + 1) % this.maxWaves;
    }

    this.prevMouse.x = x;
    this.prevMouse.y = y;
  }

  updateWaves() {
    this.waveMeshes.forEach((mesh) => {
      if (!mesh.visible) return;

      mesh.rotation.z += 0.025;
      mesh.material.opacity *= 0.95;
      mesh.scale.x = 0.98 * mesh.scale.x + 0.155;
      mesh.scale.y = 0.98 * mesh.scale.y + 0.155;

      if (mesh.material.opacity < 0.01) {
        mesh.visible = false;
      }
    });
  }

  animate() {
    if (this.isDestroyed) return;

    this.imageTexture.needsUpdate = true;
    this.trackMouse();
    this.updateWaves();

    if (this.rippleEnabled) {
      this.renderer.setRenderTarget(this.fboBase);
      this.renderer.clear();
      this.waveMeshes.forEach((mesh) => {
        if (mesh.visible) {
          this.waveScene.add(mesh);
        }
      });
      this.renderer.render(this.waveScene, this.camera);
      this.waveMeshes.forEach((mesh) => {
        if (mesh.visible) {
          this.waveScene.remove(mesh);
        }
      });

      this.uniforms.uTexture.value = this.fboTexture.texture;
      this.renderer.setRenderTarget(this.fboTexture);
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.clear();
      this.renderer.render(this.imageScene, this.imageCamera);

      this.uniforms.uDisplacement.value = this.fboBase.texture;
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.scene, this.camera);
    } else {
      this.renderer.setRenderTarget(null);
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.clear();
      this.renderer.render(this.imageScene, this.imageCamera);
    }

    this.rafId = requestAnimationFrame(this.animate);
  }

  destroy() {
    this.isDestroyed = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.container.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('resize', this.onResize);
    if (this.renderer) {
      this.renderer.dispose();
      this.fboBase.dispose();
      this.fboTexture.dispose();
      this.canvas.remove();
    }
  }
}

function initAvatarRipple() {
  const container = document.getElementById('avatarRipple');
  const sourceImage = document.getElementById('avatarGif');
  if (!container || !sourceImage) return;

  const gifSrc = sourceImage.getAttribute('src') || 'images/giphy.gif';
  const effect = new ImageRippleEffect(container, gifSrc, sourceImage);
  effect.start();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAvatarRipple);
} else {
  initAvatarRipple();
}
