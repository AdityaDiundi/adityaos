import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export interface PixelSpriteOptions {
  width?: number;
  height?: number;
  alphaTest?: number;
  position?: THREE.Vector3;
  rotationY?: number;
}

export interface ModelLoadOptions {
  targetHeight?: number;
  flatShading?: boolean;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  castShadow?: boolean;
  receiveShadow?: boolean;
}

export class StationAssetLoader {
  private static gltfLoader: GLTFLoader | null = null;
  private static textureLoader: THREE.TextureLoader | null = null;
  private static modelCache: Map<string, THREE.Group> = new Map();
  private static textureCache: Map<string, THREE.Texture> = new Map();

  private static getGLTFLoader(): GLTFLoader {
    if (!this.gltfLoader) {
      this.gltfLoader = new GLTFLoader();
    }
    return this.gltfLoader;
  }

  private static getTextureLoader(): THREE.TextureLoader {
    if (!this.textureLoader) {
      this.textureLoader = new THREE.TextureLoader();
    }
    return this.textureLoader;
  }

  /**
   * Loads a pixel-perfect 2D sprite texture with nearest-neighbor filtering and 0.5 alphaTest.
   */
  public static async loadPixelSprite(
    url: string,
    options: PixelSpriteOptions = {}
  ): Promise<THREE.Mesh> {
    const {
      width = 2.0,
      height = 2.0,
      alphaTest = 0.5,
      position = new THREE.Vector3(0, 0, 0),
      rotationY = 0,
    } = options;

    let texture = this.textureCache.get(url);
    if (!texture) {
      texture = await this.getTextureLoader().loadAsync(url);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      texture.generateMipmaps = false;
      this.textureCache.set(url, texture);
    }

    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: false,
      alphaTest,
      side: THREE.DoubleSide,
      depthWrite: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.rotation.y = rotationY;
    return mesh;
  }

  /**
   * Loads a 3D GLTF / GLB model, enforces pixel palette texture filtering,
   * centers the pivot, normalizes bounding scale, and caches the geometry.
   */
  public static async loadStationModel(
    url: string,
    options: ModelLoadOptions = {}
  ): Promise<THREE.Group> {
    const {
      targetHeight = 2.5,
      flatShading = true,
      position = new THREE.Vector3(0, 0, 0),
      rotation = new THREE.Euler(0, 0, 0),
    } = options;

    let baseGroup = this.modelCache.get(url);

    if (!baseGroup) {
      const gltf = await this.getGLTFLoader().loadAsync(url);
      baseGroup = gltf.scene;

      // Optimize materials for pixel art aesthetic
      baseGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;

          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const mat of materials) {
              if (mat instanceof THREE.MeshStandardMaterial) {
                if (flatShading) {
                  mat.flatShading = true;
                }
                if (mat.map) {
                  mat.map.magFilter = THREE.NearestFilter;
                  mat.map.minFilter = THREE.NearestFilter;
                  mat.map.generateMipmaps = false;
                  mat.map.needsUpdate = true;
                }
              } else if (mat instanceof THREE.MeshBasicMaterial && mat.map) {
                mat.map.magFilter = THREE.NearestFilter;
                mat.map.minFilter = THREE.NearestFilter;
                mat.map.generateMipmaps = false;
                mat.map.needsUpdate = true;
              }
            }
          }
        }
      });

      this.modelCache.set(url, baseGroup);
    }

    // Clone instance for scene placement
    const clone = baseGroup.clone(true);

    // Compute bounding box to auto-center and normalize target height
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    if (size.y > 0.001) {
      const scaleFactor = targetHeight / size.y;
      clone.scale.setScalar(scaleFactor);
      // Offset so base sits on y = 0
      clone.position.set(
        position.x - center.x * scaleFactor,
        position.y - box.min.y * scaleFactor,
        position.z - center.z * scaleFactor
      );
    } else {
      clone.position.copy(position);
    }

    clone.rotation.copy(rotation);
    return clone;
  }
}
