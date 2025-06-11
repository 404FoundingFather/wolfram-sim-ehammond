import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy gRPC-Web requests to the backend
      '/wolfram_physics_simulator.WolframPhysicsSimulatorService': {
        target: 'http://localhost:50051',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  define: {
    // Define the backend URL for different environments
    __BACKEND_URL__: JSON.stringify(
      process.env.NODE_ENV === 'production' 
        ? 'http://localhost:50051' 
        : 'http://localhost:50051'
    ),
    // Define global for CommonJS compatibility
    global: 'globalThis',
  },
  optimizeDeps: {
    // Include CommonJS dependencies that need to be pre-bundled
    include: [
      'grpc-web',
      'google-protobuf'
    ],
    // Exclude problematic files from optimization
    exclude: [
      'src/generated/proto/wolfram_physics_grpc_web_pb.js',
      'src/generated/proto/wolfram_physics_pb.js'
    ]
  },
  resolve: {
    alias: {
      // Help Vite resolve the generated protobuf files
      '@proto': '/src/generated/proto'
    }
  }
})
