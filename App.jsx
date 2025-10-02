import { useState, useEffect, use } from 'react'
import './App.css'
import PitchList from './pitchList.jsx'
import PitchForm from './PitchForm.jsx'
import ZoneHeatmap from './heatmap.jsx'

function App() {
  const [pitches, setPitches] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [result, setResult] = useState(null)
  useEffect(() => {
    fetchPitches()
  }, [])
  const sendData = async (payload) => {
    try{
      const input = {
        features: [
          payload.inning,
          payload.outsWhenUp, 
          payload.balls, 
          payload.strikes, 
          payload.batScore, 
          payload.fldScore, 
          payload.stand === "L" ? 1 : 0
        ]
      }
        
        const res = await fetch ("http://127.0.0.1:5000/predict_zone", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(input)
        })
        if (!res.ok){
          throw new Error("Server responded with ${res.status}")
        }
        const data = await res.json()
        console.log("Prediction result:", data)
        setResult(data)
      } catch (error){
        console.error("Error during prediction:", error)
      }
    }
  const fetchPitches = async () => {
    const response = await fetch("http://127.0.0.1:5000/pitches")
    const data = await response.json()
    setPitches(data.pitches)
    console.log(data.pitches)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }
  return (
    <>
      <PitchList pitches={pitches} updateCallback = {fetchPitches} />
      <button onClick={openCreateModal}>Change Data</button>
      {result && (
  <div style={{ }}>
    <div style={{ 
      position: 'relative', 
      width: '600px', 
      height: '600px',
      margin: '20px auto' 
    }}>
      
      {/* zones 1-9 (main grid) */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 120px)',
        gridTemplateRows: 'repeat(3, 120px)',
        gap: '2px',
        zIndex: 10
      }}>
        {result.probabilities.slice(0, 9).map((prob, index) => {
          const isPredicted = result.predicted_zone === index;
          const intensity = Math.min(prob * 4, 1);
          const red = Math.round(255 * intensity);
          const blue = Math.round(255 * (1 - intensity));
          
          return (
            <div key={index} style={{
              backgroundColor: `rgba(${red}, 100, ${blue}, ${0.3 + intensity * 0.5})`,
              border: isPredicted ? '4px solid gold' : '2px solid rgba(255,255,255,0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px black',
              boxShadow: isPredicted ? '0 0 20px gold' : 'none'
            }}>
              <div style={{ fontSize: '20px' }}>{index + 1}</div>
              <div style={{ fontSize: '14px' }}>{(prob * 100).toFixed(1)}%</div>
            </div>
          );
        })}
      </div>

      {/* Corner Zones are L's */}
      {[
        { label: '11', top: '30px', left: '30px', index: 9, clipPath: 'polygon(0 0, 100% 0, 100% 25%, 25% 25%, 25% 100%, 0 100%)', textPos: { top: '15px', left: '15px' } },
        { label: '12', top: '30px', right: '30px', index: 10, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 75% 100%, 75% 25%, 0 25%)', textPos: { top: '15px', right: '15px' } },
        { label: '13', bottom: '30px', left: '30px', index: 11, clipPath: 'polygon(0 0, 25% 0, 25% 75%, 100% 75%, 100% 100%, 0 100%)', textPos: { bottom: '15px', left: '15px' } },
        { label: '14', bottom: '30px', right: '30px', index: 12, clipPath: 'polygon(75% 0, 100% 0, 100% 100%, 0 100%, 0 75%, 75% 75%)', textPos: { bottom: '15px', right: '15px' } }
      ].map((corner) => {
        const prob = result.probabilities[corner.index];
        const isPredicted = result.predicted_zone === corner.index;
        const intensity = Math.min(prob * 4, 1);
        const red = Math.round(255 * intensity);
        const blue = Math.round(255 * (1 - intensity));
        
        return (
          <div key={corner.index} style={{
            position: 'absolute',
            top: corner.top,
            bottom: corner.bottom,
            left: corner.left,
            right: corner.right,
            width: '240px',
            height: '240px'
          }}>
            {/* L shapes*/}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backgroundColor: `rgba(${red}, 100, ${blue}, ${0.3 + intensity * 0.5})`,
              border: isPredicted ? '4px solid gold' : '2px solid rgba(255,255,255,0.3)',
              clipPath: corner.clipPath,
              boxShadow: isPredicted ? '0 0 20px gold' : 'none'
            }} />
            
            {/* text n stuff*/}
            <div style={{
              position: 'absolute',
              ...corner.textPos,
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
                {(prob * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        );
      })}
      
      {/* batter picture */}
      <img src="/batter.png" alt="Batter" style={{ 
        position: 'absolute',
        top: 0,
        right: 400,
        width: '100%',
        height: '100%',
        filter: "invert(1)",
        transform: 'scaleX(-1)',
        zIndex: 1,
        pointerEvents: 'none'
      }}/>
    </div>
  </div>
)}
      {isModalOpen && <div className="modal" style= {{zIndex: 100}}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <PitchForm updateCallback={fetchPitches} onClose = {closeModal} sendData={sendData}/>
          </div>
        </div>
      }
    </>
    );
  }
  export default App;
