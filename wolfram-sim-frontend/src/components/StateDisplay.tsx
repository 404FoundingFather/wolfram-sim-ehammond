import React from 'react';
import { useSimulationStore } from '../store/simulationStore';
import type { ApiSimulationEvent } from '../services/apiClient';

const StateDisplay: React.FC = () => {
  const {
    hypergraphState,
    currentStepNumber,
    isInitialized,
    isRunning,
    isPaused,
    recentEvents,
    eventHistory,
    statusMessage
  } = useSimulationStore();

  const atomCount = hypergraphState?.atoms.length || 0;
  const relationCount = hypergraphState?.relations.length || 0;

  const formatEvent = (event: ApiSimulationEvent, index: number) => {
    return (
      <div 
        key={`${event.id}-${index}`}
        style={{
          backgroundColor: '#f8f9fa',
          padding: '8px',
          borderRadius: '4px',
          marginBottom: '5px',
          fontSize: '12px',
          border: '1px solid #e9ecef'
        }}
      >
        <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
          Event {event.id} - Rule: {event.ruleIdApplied}
        </div>
        {event.atomsInvolvedInput.length > 0 && (
          <div style={{ color: '#e74c3c' }}>
            Input: [{event.atomsInvolvedInput.join(', ')}]
          </div>
        )}
        {event.atomsInvolvedOutput.length > 0 && (
          <div style={{ color: '#27ae60' }}>
            Output: [{event.atomsInvolvedOutput.join(', ')}]
          </div>
        )}
      </div>
    );
  };

  const getRunningStatus = () => {
    if (!isInitialized) return 'Not Initialized';
    if (isRunning) return 'Running';
    if (isPaused) return 'Paused';
    return 'Stopped';
  };

  const getStatusColor = () => {
    if (!isInitialized) return '#95a5a6';
    if (isRunning) return '#27ae60';
    if (isPaused) return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div className="state-display" style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Simulation State</h2>
      
      {/* Simulation Status Panel */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#34495e' }}>Status</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '10px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>
              {currentStepNumber}
            </div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
              Current Step
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: getStatusColor() }}>
              {getRunningStatus()}
            </div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
              Status
            </div>
          </div>
        </div>
      </div>

      {/* Hypergraph Statistics */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#34495e' }}>Hypergraph Statistics</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '10px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
              {atomCount}
            </div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
              Atoms
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
              {relationCount}
            </div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
              Relations
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#34495e' }}>Recent Events</h3>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '15px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {recentEvents.length > 0 ? (
            <div>
              {recentEvents.slice(-5).map((event, index) => formatEvent(event, index))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              color: '#7f8c8d', 
              fontStyle: 'italic',
              padding: '20px 0'
            }}>
              No recent events
            </div>
          )}
        </div>
      </div>

      {/* Event History */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#34495e' }}>Event History</h3>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '15px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {eventHistory.length > 0 ? (
            <div>
              <div style={{ 
                fontSize: '12px', 
                color: '#7f8c8d', 
                marginBottom: '10px',
                textAlign: 'center'
              }}>
                Showing last {Math.min(eventHistory.length, 50)} of {eventHistory.length} events
              </div>
              {eventHistory.slice(-10).reverse().map((event, index) => formatEvent(event, index))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              color: '#7f8c8d', 
              fontStyle: 'italic',
              padding: '20px 0'
            }}>
              No events in history
            </div>
          )}
        </div>
      </div>

      {/* System Status */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#34495e' }}>System Status</h3>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          padding: '15px'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#2c3e50' }}>Backend Connection:</strong>
            <span style={{ 
              marginLeft: '10px',
              color: isInitialized ? '#27ae60' : '#e74c3c',
              fontWeight: 'bold'
            }}>
              {isInitialized ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#2c3e50' }}>Last Update:</strong>
            <span style={{ marginLeft: '10px', color: '#7f8c8d' }}>
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          
          <div>
            <strong style={{ color: '#2c3e50' }}>Status Message:</strong>
            <div style={{ 
              marginTop: '5px',
              padding: '8px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#2c3e50'
            }}>
              {statusMessage}
            </div>
          </div>
        </div>
      </div>

      {/* Raw State Data (Debug) */}
      {hypergraphState && (
        <div>
          <h3 style={{ margin: '0 0 10px 0', color: '#34495e' }}>Raw Hypergraph Data</h3>
          <details style={{
            backgroundColor: 'white',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            padding: '15px'
          }}>
            <summary style={{ 
              cursor: 'pointer', 
              fontWeight: 'bold',
              color: '#2c3e50',
              marginBottom: '10px'
            }}>
              Show/Hide JSON Data
            </summary>
            <pre style={{
              backgroundColor: '#f8f9fa',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '12px',
              overflowX: 'auto',
              border: '1px solid #e9ecef',
              color: '#2c3e50'
            }}>
              {JSON.stringify(hypergraphState, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default StateDisplay; 