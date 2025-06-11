// import React from 'react'; // Not needed in React 18+
import './App.css';
import SimulationControls from './components/SimulationControls';
import HypergraphVisualizer from './components/HypergraphVisualizer';
import StateDisplay from './components/StateDisplay';
import { useSimulationStore } from './store/simulationStore';

function App() {
  const { hypergraphState } = useSimulationStore();

  return (
    <div className="App" style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ecf0f1',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>
          Wolfram Physics Simulator MVP
        </h1>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
          Interactive hypergraph evolution simulation
        </p>
      </header>

      {/* Main Content */}
      <main style={{ 
        display: 'flex',
        gap: '20px',
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Left Panel - Controls and State */}
        <aside style={{ 
          width: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <SimulationControls />
          <StateDisplay />
        </aside>

        {/* Right Panel - Visualization */}
        <section style={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            height: '100%',
            minHeight: '600px'
          }}>
            <h2 style={{ 
              margin: '0 0 20px 0', 
              color: '#2c3e50',
              textAlign: 'center'
            }}>
              Hypergraph Visualization
            </h2>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 'calc(100% - 60px)',
              minHeight: '500px'
            }}>
              <HypergraphVisualizer
                hypergraphState={hypergraphState}
                width={Math.min(800, window.innerWidth - 480)}
                height={Math.min(600, window.innerHeight - 200)}
              />
            </div>

            {/* Visualization Instructions */}
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#e8f4f8',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#2c3e50',
              textAlign: 'center'
            }}>
              💡 <strong>Tips:</strong> Drag nodes to reposition • Zoom with mouse wheel • 
              Blue circles = atoms • Red lines = binary relations • Orange nodes = hyperedge centers
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#34495e',
        color: 'white',
        padding: '15px',
        textAlign: 'center',
        fontSize: '12px',
        marginTop: '20px'
      }}>
        <p style={{ margin: 0 }}>
          Wolfram Physics Simulator MVP - Built with React + Rust + gRPC
        </p>
        <p style={{ margin: '5px 0 0 0', opacity: 0.7 }}>
          Sprint 5: Web Frontend Implementation Complete
        </p>
      </footer>
    </div>
  );
}

export default App;
