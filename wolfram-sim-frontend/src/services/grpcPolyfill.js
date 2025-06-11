// Comprehensive polyfill for gRPC-Web with Google Protobuf and Closure Library support
import grpcWeb from 'grpc-web';
import * as jspb from 'google-protobuf';

// Set up global environment for generated gRPC files
if (typeof window !== 'undefined') {
  // Store the modules we need
  const modules = {
    'grpc-web': grpcWeb,
    'google-protobuf': jspb,
  };

  // Create comprehensive require function
  window.require = function(id) {
    console.log('require() called with module:', id);
    
    if (id === 'grpc-web') {
      return grpcWeb;
    }
    
    if (id === 'google-protobuf') {
      return jspb;
    }
    
    if (id.startsWith('./wolfram_physics_pb.js') || id.startsWith('./wolfram_physics_pb')) {
      // Return the protobuf messages module when it's loaded
      return window.protoMessages || {};
    }
    
    console.warn('require() called with unknown module:', id);
    return {};
  };

  // Set up module.exports environment
  if (typeof window.module === 'undefined') {
    window.module = { exports: {} };
  }
  if (typeof window.exports === 'undefined') {
    window.exports = {};
  }

  // Set up Google Closure Library environment
  if (typeof window.goog === 'undefined') {
    window.goog = {
      // Basic exportSymbol implementation
      exportSymbol: function(name, obj, objectToExportTo) {
        objectToExportTo = objectToExportTo || window;
        const parts = name.split('.');
        let current = objectToExportTo;
        
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
        
        current[parts[parts.length - 1]] = obj;
      },
      
      // Basic inherits implementation
      inherits: function(childCtor, parentCtor) {
        childCtor.superClass_ = parentCtor.prototype;
        childCtor.prototype = Object.create(parentCtor.prototype);
        childCtor.prototype.constructor = childCtor;
      },
      
      // Debug flag (set to false for production)
      DEBUG: false
    };
  }

  // Make jspb available globally (this is what the generated files expect)
  window.jspb = jspb;
  
  // Initialize global proto namespace
  if (typeof window.proto === 'undefined') {
    window.proto = {};
  }

  console.log('Enhanced gRPC polyfill initialized with google-protobuf and closure support');
}

export { grpcWeb, jspb }; 