import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy gRPC-Web requests to the backend
      '/grpc': {
        target: 'http://localhost:50051',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/grpc/, ''),
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
        ? 'http://localhost:8080' 
        : 'http://localhost:8080'
    )
  },
  optimizeDeps: {
    // Include CommonJS dependencies that need to be pre-bundled
    include: [
      'grpc-web',
      'google-protobuf'
    ]
  },
  resolve: {
    alias: {
      // Help Vite resolve the generated protobuf files
      '@proto': '/src/generated/proto'
    }
  }
})
