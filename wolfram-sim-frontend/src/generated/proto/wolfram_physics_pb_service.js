// package: wolfram_physics_simulator
// file: wolfram_physics.proto

var wolfram_physics_pb = require("./wolfram_physics_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var WolframPhysicsSimulatorService = (function () {
  function WolframPhysicsSimulatorService() {}
  WolframPhysicsSimulatorService.serviceName = "wolfram_physics_simulator.WolframPhysicsSimulatorService";
  return WolframPhysicsSimulatorService;
}());

WolframPhysicsSimulatorService.InitializeSimulation = {
  methodName: "InitializeSimulation",
  service: WolframPhysicsSimulatorService,
  requestStream: false,
  responseStream: false,
  requestType: wolfram_physics_pb.InitializeRequest,
  responseType: wolfram_physics_pb.InitializeResponse
};

WolframPhysicsSimulatorService.StepSimulation = {
  methodName: "StepSimulation",
  service: WolframPhysicsSimulatorService,
  requestStream: false,
  responseStream: false,
  requestType: wolfram_physics_pb.StepRequest,
  responseType: wolfram_physics_pb.StepResponse
};

WolframPhysicsSimulatorService.RunSimulation = {
  methodName: "RunSimulation",
  service: WolframPhysicsSimulatorService,
  requestStream: false,
  responseStream: true,
  requestType: wolfram_physics_pb.RunRequest,
  responseType: wolfram_physics_pb.SimulationStateUpdate
};

WolframPhysicsSimulatorService.StopSimulation = {
  methodName: "StopSimulation",
  service: WolframPhysicsSimulatorService,
  requestStream: false,
  responseStream: false,
  requestType: wolfram_physics_pb.StopRequest,
  responseType: wolfram_physics_pb.StopResponse
};

WolframPhysicsSimulatorService.GetCurrentState = {
  methodName: "GetCurrentState",
  service: WolframPhysicsSimulatorService,
  requestStream: false,
  responseStream: false,
  requestType: wolfram_physics_pb.GetCurrentStateRequest,
  responseType: wolfram_physics_pb.SimulationStateUpdate
};

WolframPhysicsSimulatorService.SaveHypergraph = {
  methodName: "SaveHypergraph",
  service: WolframPhysicsSimulatorService,
  requestStream: false,
  responseStream: false,
  requestType: wolfram_physics_pb.SaveHypergraphRequest,
  responseType: wolfram_physics_pb.SaveHypergraphResponse
};

WolframPhysicsSimulatorService.LoadHypergraph = {
  methodName: "LoadHypergraph",
  service: WolframPhysicsSimulatorService,
  requestStream: false,
  responseStream: false,
  requestType: wolfram_physics_pb.LoadHypergraphRequest,
  responseType: wolfram_physics_pb.LoadHypergraphResponse
};

exports.WolframPhysicsSimulatorService = WolframPhysicsSimulatorService;

function WolframPhysicsSimulatorServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

WolframPhysicsSimulatorServiceClient.prototype.initializeSimulation = function initializeSimulation(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WolframPhysicsSimulatorService.InitializeSimulation, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

WolframPhysicsSimulatorServiceClient.prototype.stepSimulation = function stepSimulation(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WolframPhysicsSimulatorService.StepSimulation, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

WolframPhysicsSimulatorServiceClient.prototype.runSimulation = function runSimulation(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(WolframPhysicsSimulatorService.RunSimulation, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

WolframPhysicsSimulatorServiceClient.prototype.stopSimulation = function stopSimulation(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WolframPhysicsSimulatorService.StopSimulation, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

WolframPhysicsSimulatorServiceClient.prototype.getCurrentState = function getCurrentState(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WolframPhysicsSimulatorService.GetCurrentState, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

WolframPhysicsSimulatorServiceClient.prototype.saveHypergraph = function saveHypergraph(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WolframPhysicsSimulatorService.SaveHypergraph, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

WolframPhysicsSimulatorServiceClient.prototype.loadHypergraph = function loadHypergraph(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WolframPhysicsSimulatorService.LoadHypergraph, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.WolframPhysicsSimulatorServiceClient = WolframPhysicsSimulatorServiceClient;

