import React, { useState } from 'react';
import { useSimulationStore, PREDEFINED_EXAMPLES } from '../store/simulationStore';

const SimulationControls: React.FC = () => {
  const {
    isInitialized,
    isRunning,
    isPaused,
    isLoading,
    selectedExample,
    updateInterval,
    statusMessage,
    errorMessage,
    initializeSimulation,
    stepSimulation,
    runSimulation,
    pauseSimulation,
    stopSimulation,
    resetSimulation,
    setSelectedExample,
    setUpdateInterval,
    clearError,
    saveHypergraph,
    loadHypergraph
  } = useSimulationStore();

  const [saveFilename, setSaveFilename] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);

  const handleInitialize = async () => {
    await initializeSimulation();
  };

  const handleStep = async () => {
    await stepSimulation(1);
  };

  const handleMultiStep = async () => {
    await stepSimulation(5);
  };

  const handleRun = () => {
    if (isRunning) {
      pauseSimulation();
    } else {
      runSimulation();
    }
  };

  const handleStop = async () => {
    await stopSimulation();
  };

  const handleReset = () => {
    resetSimulation();
  };

  const handleSave = async () => {
    await saveHypergraph(saveFilename || undefined);
    setShowSaveDialog(false);
    setSaveFilename('');
  };

  const handleLoadExample = async (exampleId: string) => {
    await loadHypergraph({ predefinedExampleName: exampleId });
    setShowLoadDialog(false);
  };

  const handleFileLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        await loadHypergraph({ fileContent: content });
        setShowLoadDialog(false);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="simulation-controls" style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Simulation Controls</h2>
      
      {/* Error Display */}
      {errorMessage && (
        <div style={{ 
          backgroundColor: '#e74c3c', 
          color: 'white', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{errorMessage}</span>
          <button 
            onClick={clearError}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Initialization Section */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#34495e' }}>Initialize Simulation</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50' }}>
            Initial State:
          </label>
          <select 
            value={selectedExample} 
            onChange={(e) => setSelectedExample(e.target.value)}
            disabled={isLoading || isRunning}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #bdc3c7',
              fontSize: '14px'
            }}
          >
            {PREDEFINED_EXAMPLES.map(example => (
              <option key={example.id} value={example.id}>
                {example.name} - {example.description}
              </option>
            ))}
          </select>
        </div>
        <button 
          onClick={handleInitialize}
          disabled={isLoading || isRunning}
          style={{
            backgroundColor: isInitialized ? '#27ae60' : '#3498db',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: isLoading || isRunning ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            width: '100%'
          }}
        >
          {isLoading ? 'Initializing...' : isInitialized ? 'Re-initialize' : 'Initialize Simulation'}
        </button>
      </div>

      {/* File Management Section */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#34495e' }}>File Management</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button 
            onClick={() => setShowLoadDialog(true)}
            disabled={isLoading || isRunning}
            style={{
              backgroundColor: '#8e44ad',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: isLoading || isRunning ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              flex: 1
            }}
          >
            Load Hypergraph
          </button>
          <button 
            onClick={() => setShowSaveDialog(true)}
            disabled={isLoading || isRunning || !isInitialized}
            style={{
              backgroundColor: '#e67e22',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: (isLoading || isRunning || !isInitialized) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              flex: 1
            }}
          >
            Save Hypergraph
          </button>
        </div>
      </div>

      {/* Simulation Control Section */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#34495e' }}>Simulation Control</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <button 
            onClick={handleStep}
            disabled={!isInitialized || isLoading || isRunning}
            style={{
              backgroundColor: '#f39c12',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '4px',
              cursor: (!isInitialized || isLoading || isRunning) ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            Step (1)
          </button>
          <button 
            onClick={handleMultiStep}
            disabled={!isInitialized || isLoading || isRunning}
            style={{
              backgroundColor: '#d35400',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '4px',
              cursor: (!isInitialized || isLoading || isRunning) ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            Step (5)
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button 
            onClick={handleRun}
            disabled={!isInitialized || isLoading}
            style={{
              backgroundColor: isRunning ? '#e74c3c' : '#27ae60',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '4px',
              cursor: (!isInitialized || isLoading) ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isRunning ? (isPaused ? 'Resume' : 'Pause') : 'Run'}
          </button>
          <button 
            onClick={handleStop}
            disabled={!isInitialized || isLoading || (!isRunning && !isPaused)}
            style={{
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              padding: '10px',
              borderRadius: '4px',
              cursor: (!isInitialized || isLoading || (!isRunning && !isPaused)) ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            Stop
          </button>
        </div>
      </div>

      {/* Configuration Section */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#34495e' }}>Configuration</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50' }}>
            Update Interval: {updateInterval}ms
          </label>
          <input 
            type="range"
            min="100"
            max="2000"
            step="100"
            value={updateInterval}
            onChange={(e) => setUpdateInterval(parseInt(e.target.value))}
            disabled={isRunning}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Reset Section */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleReset}
          disabled={isLoading || isRunning}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: (isLoading || isRunning) ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            width: '100%'
          }}
        >
          Reset Simulation
        </button>
      </div>

      {/* Status Message */}
      <div style={{ 
        backgroundColor: '#ecf0f1', 
        padding: '10px', 
        borderRadius: '4px',
        fontSize: '14px',
        color: '#2c3e50'
      }}>
        <strong>Status:</strong> {statusMessage}
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            minWidth: '300px'
          }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Save Hypergraph</h3>
            <input
              type="text"
              placeholder="Filename (optional)"
              value={saveFilename}
              onChange={(e) => setSaveFilename(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #bdc3c7',
                marginBottom: '15px',
                fontSize: '14px'
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSave}
                style={{
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  flex: 1
                }}
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                style={{
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  flex: 1
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            minWidth: '300px'
          }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Load Hypergraph</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Predefined Examples:</h4>
              {PREDEFINED_EXAMPLES.map(example => (
                <button
                  key={example.id}
                  onClick={() => handleLoadExample(example.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginBottom: '5px',
                    textAlign: 'left'
                  }}
                >
                  {example.name}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>Load from File:</h4>
              <input
                type="file"
                accept=".json"
                onChange={handleFileLoad}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #bdc3c7',
                  fontSize: '14px'
                }}
              />
            </div>

            <button
              onClick={() => setShowLoadDialog(false)}
              style={{
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                width: '100%'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationControls; 