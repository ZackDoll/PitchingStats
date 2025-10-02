import { useState } from 'react';

function ZoneHeatmap() {
  // Example result with 13 zones (0-12)
  const [result, setResult] = useState({
    predicted_zone: 5,
    probabilities: [0.02, 0.05, 0.08, 0.12, 0.15, 0.25, 0.10, 0.08, 0.06, 0.04, 0.03, 0.02, 0.015, 0.01]
  });

  // Map zones: 3x3 grid (zones 1-9) + 4 corners (10-13)
  const zonePositions = [
    { row: 0, col: 0, label: '1' },  // Top-left
    { row: 0, col: 1, label: '2' },  // Top-center
    { row: 0, col: 2, label: '3' },  // Top-right
    { row: 1, col: 0, label: '4' },  // Mid-left
    { row: 1, col: 1, label: '5' },  // Center
    { row: 1, col: 2, label: '6' },  // Mid-right
    { row: 2, col: 0, label: '7' },  // Bottom-left
    { row: 2, col: 1, label: '8' },  // Bottom-center
    { row: 2, col: 2, label: '9' },  // Bottom-right
  ];
  
  const cornerPositions = [
    { label: '11', top: '30px', left: '30px' },      // Top-left corner
    { label: '12', top: '30px', right: '30px' },     // Top-right corner
    { label: '13', bottom: '30px', left: '30px' },   // Bottom-left corner
    { label: '14', bottom: '30px', right: '30px' }   // Bottom-right corner
  ];

  const getHeatmapColor = (probability) => {
    // Color scale from blue (low) to red (high)
    const intensity = Math.min(probability * 4, 1); // Scale up for visibility
    const red = Math.round(255 * intensity);
    const blue = Math.round(255 * (1 - intensity));
    return `rgba(${red}, 100, ${blue}, ${0.3 + intensity * 0.5})`;
  };

  const testPrediction = () => {
    // Simulate a new prediction with 14 zones
    const randomProbs = Array.from({ length: 14 }, () => Math.random() * 0.3);
    const sum = randomProbs.reduce((a, b) => a + b, 0);
    const normalized = randomProbs.map(p => p / sum);
    const predictedZone = normalized.indexOf(Math.max(...normalized));
    
    setResult({
      predicted_zone: predictedZone,
      probabilities: normalized
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Strike Zone Prediction Heatmap</h2>
      <button 
        onClick={testPrediction}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#0066cc',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Simulate New Prediction
      </button>

      <div style={{ 
        position: 'relative', 
        width: '600px', 
        height: '600px',
        margin: '0 auto',
        backgroundColor: '#1a1a1a',
        borderRadius: '10px'
      }}>
        {/* Strike zone grid */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 120px)',
          gridTemplateRows: 'repeat(3, 120px)',
          gap: '2px'
        }}>
          {zonePositions.map((zone, index) => {
            const probability = result.probabilities[index];
            const isPredicted = result.predicted_zone === index;
            
            return (
              <div
                key={index}
                style={{
                  backgroundColor: getHeatmapColor(probability),
                  border: isPredicted ? '4px solid gold' : '2px solid rgba(255,255,255,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  textShadow: '2px 2px 4px black',
                  position: 'relative',
                  boxShadow: isPredicted ? '0 0 20px gold' : 'none'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>
                  {zone.label}
                </div>
                <div style={{ fontSize: '14px' }}>
                  {(probability * 100).toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>

        {/*fix for corner zones*/}
        {cornerPositions.map((corner, index) => {
          const actualIndex = index + 9;
          const probability = result.probabilities[actualIndex];
          const isPredicted = result.predicted_zone === actualIndex;
          
          // L shaped clip paths
          let clipPath;
          if (index === 0) clipPath = 'polygon(0 0, 100% 0, 100% 25%, 25% 25%, 25% 100%, 0 100%)'; // Top-left
          if (index === 1) clipPath = 'polygon(0 0, 100% 0, 100% 100%, 75% 100%, 75% 25%, 0 25%)'; // Top-right
          if (index === 2) clipPath = 'polygon(0 0, 25% 0, 25% 75%, 100% 75%, 100% 100%, 0 100%)'; // Bottom-left
          if (index === 3) clipPath = 'polygon(75% 0, 100% 0, 100% 100%, 0 100%, 0 75%, 75% 75%)'; // Bottom-right
          
          // keep text in respective corner and on top
          let textPosition = {};
          if (index === 0) textPosition = { top: '15px', left: '15px' }; // Top-left
          if (index === 1) textPosition = { top: '15px', right: '15px' }; // Top-right
          if (index === 2) textPosition = { bottom: '15px', left: '15px' }; // Bottom-left
          if (index === 3) textPosition = { bottom: '15px', right: '15px' }; // Bottom-right
          
          return (
            <div
              key={actualIndex}
              style={{
                position: 'absolute',
                top: corner.top,
                bottom: corner.bottom,
                left: corner.left,
                right: corner.right,
                width: '240px',
                height: '240px'
              }}
            >
              {/*background for L blocks*/}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: getHeatmapColor(probability),
                border: isPredicted ? '4px solid gold' : '2px solid rgba(255,255,255,0.3)',
                clipPath: clipPath,
                boxShadow: isPredicted ? '0 0 20px gold' : 'none'
              }} />
              
              {/*text overlay*/}
              <div style={{
                position: 'absolute',
                ...textPosition,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'white',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px black',
                zIndex: 1
              }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>
                  {corner.label}
                </div>
                <div style={{ fontSize: '12px' }}>
                  {(probability * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}

        {/* overarching css chain*/}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '10px',
          borderRadius: '5px',
          color: 'white',
          fontSize: '12px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            Predicted Zone: {result.predicted_zone + 1}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
            <div>Low</div>
            <div style={{
              width: '100px',
              height: '10px',
              background: 'linear-gradient(to right, rgba(100,100,255,0.5), rgba(255,100,100,0.9))'
            }} />
            <div>High</div>
          </div>
        </div>
      </div>

      {/*Probability list*/}
      <div style={{ 
        marginTop: '20px', 
        maxWidth: '600px', 
        margin: '20px auto',
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '8px'
      }}>
        <h3>All Zone Probabilities:</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '10px' 
        }}>
          {result.probabilities.map((prob, index) => (
            <div 
              key={index}
              style={{
                padding: '8px',
                backgroundColor: result.predicted_zone === index ? '#ffd700' : 'white',
                borderRadius: '5px',
                fontWeight: result.predicted_zone === index ? 'bold' : 'normal'
              }}
            >
              Zone {index + 1}: {(prob * 100).toFixed(2)}%
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ZoneHeatmap;