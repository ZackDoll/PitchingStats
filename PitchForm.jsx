// src/PitchForm.jsx
import { useState, useEffect } from "react";

function PitchForm({ updateCallback, onClose, sendData, existingPitch }) {
    const [inning, setInning] = useState("")
    const [balls, setBalls] = useState("")
    const [strikes, setStrikes] = useState("")
    const [outsWhenUp, setOutsWhenUp] = useState("")
    const [fldScore, setFldScore] = useState("")
    const [batScore, setBatScore] = useState("")
    const [stand, setStand] = useState("L")
    
    // validation errors
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (existingPitch) {
            setInning(existingPitch.inning || "")
            setBalls(existingPitch.balls || "")
            setStrikes(existingPitch.strikes || "")
            setOutsWhenUp(existingPitch.outsWhenUp || "")
            setFldScore(existingPitch.fldScore || "")
            setBatScore(existingPitch.batScore || "")
            setStand(existingPitch.stand || "L")
        }
    }, [existingPitch])

    const validateField = (name, value) => {
        const num = Number(value)
        let error = null

        switch(name) {
            case 'inning':
                if (value === '' || num < 1 || num > 20) {
                    error = 'Inning must be 1-20'
                }
                break
            case 'balls':
                if (value === '' || num < 0 || num > 3) {
                    error = 'Balls must be 0-3'
                }
                break
            case 'strikes':
                if (value === '' || num < 0 || num > 2) {
                    error = 'Strikes must be 0-2'
                }
                break
            case 'outsWhenUp':
                if (value === '' || num < 0 || num > 2) {
                    error = 'Outs must be 0-2'
                }
                break
            case 'batScore':
            case 'fldScore':
                if (value === '' || num < 0) {
                    error = 'Score must be 0 or greater'
                }
                break
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }))

        return error === null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // validate all fields
        const validations = {
            inning: validateField('inning', inning),
            balls: validateField('balls', balls),
            strikes: validateField('strikes', strikes),
            outsWhenUp: validateField('outsWhenUp', outsWhenUp),
            batScore: validateField('batScore', batScore),
            fldScore: validateField('fldScore', fldScore)
        }

        // check if any validation failed
        if (Object.values(validations).includes(false)) {
            return // don't submit if there are errors
        }

        const payload = {
            inning: Number(inning),
            balls: Number(balls),
            strikes: Number(strikes),
            outsWhenUp: Number(outsWhenUp),
            fldScore: Number(fldScore),
            batScore: Number(batScore),
            stand: stand
        }

        console.log("Submitting payload:", payload)
        sendData(payload)
        
        if (typeof onClose === 'function') onClose()
    }

    const getInputStyle = (fieldName) => ({
        width: '100%',
        padding: '12px 15px',
        backgroundColor: '#0a0a0a',
        border: `2px solid ${errors[fieldName] ? '#ff4444' : '#333'}`,
        borderRadius: '8px',
        color: 'white',
        fontSize: '16px',
        fontFamily: 'monospace',
        transition: 'all 0.3s ease',
        outline: 'none'
    })

    const labelStyle = {
        display: 'block',
        fontSize: '11px',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom: '8px',
        fontWeight: '500'
    }

    const fieldContainerStyle = {
        marginBottom: '20px'
    }

    const errorStyle = {
        color: '#ff4444',
        fontSize: '11px',
        marginTop: '5px',
        fontFamily: 'monospace'
    }

    return (
        <form onSubmit={handleSubmit} style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            padding: '40px',
            borderRadius: '15px',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h3 style={{
                marginBottom: '30px',
                fontSize: '24px',
                fontWeight: '600',
                background: 'linear-gradient(90deg, #00ffaa, #00aaff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textAlign: 'center'
            }}>
                {existingPitch ? "⚙️ Modify Game State" : "▶️ Enter Game State"}
            </h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '25px'
            }}>
                <div style={fieldContainerStyle}>
                    <label style={labelStyle}>
                        ⚾ Inning
                        <input 
                            type="number" 
                            value={inning} 
                            onChange={e => setInning(e.target.value)}
                            style={getInputStyle('inning')}
                            onFocus={(e) => {
                                if (!errors.inning) {
                                    e.target.style.borderColor = '#00ffaa';
                                    e.target.style.boxShadow = '0 0 15px rgba(0, 255, 170, 0.2)';
                                }
                            }}
                            onBlur={(e) => {
                                validateField('inning', e.target.value);
                                if (!errors.inning) {
                                    e.target.style.borderColor = '#333';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                            min="1"
                            max="20"
                        />
                        {errors.inning && <div style={errorStyle}>⚠ {errors.inning}</div>}
                    </label>
                </div>

                <div style={fieldContainerStyle}>
                    <label style={labelStyle}>
                        🟢 Balls
                        <input 
                            type="number" 
                            value={balls} 
                            onChange={e => setBalls(e.target.value)}
                            style={getInputStyle('balls')}
                            onFocus={(e) => {
                                if (!errors.balls) {
                                    e.target.style.borderColor = '#00ffaa';
                                    e.target.style.boxShadow = '0 0 15px rgba(0, 255, 170, 0.2)';
                                }
                            }}
                            onBlur={(e) => {
                                validateField('balls', e.target.value);
                                if (!errors.balls) {
                                    e.target.style.borderColor = '#333';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                            min="0"
                            max="3"
                        />
                        {errors.balls && <div style={errorStyle}>⚠ {errors.balls}</div>}
                    </label>
                </div>

                <div style={fieldContainerStyle}>
                    <label style={labelStyle}>
                        🔴 Strikes
                        <input 
                            type="number" 
                            value={strikes} 
                            onChange={e => setStrikes(e.target.value)}
                            style={getInputStyle('strikes')}
                            onFocus={(e) => {
                                if (!errors.strikes) {
                                    e.target.style.borderColor = '#00ffaa';
                                    e.target.style.boxShadow = '0 0 15px rgba(0, 255, 170, 0.2)';
                                }
                            }}
                            onBlur={(e) => {
                                validateField('strikes', e.target.value);
                                if (!errors.strikes) {
                                    e.target.style.borderColor = '#333';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                            min="0"
                            max="2"
                        />
                        {errors.strikes && <div style={errorStyle}>⚠ {errors.strikes}</div>}
                    </label>
                </div>

                <div style={fieldContainerStyle}>
                    <label style={labelStyle}>
                        ❌ Outs
                        <input 
                            type="number" 
                            value={outsWhenUp} 
                            onChange={e => setOutsWhenUp(e.target.value)}
                            style={getInputStyle('outsWhenUp')}
                            onFocus={(e) => {
                                if (!errors.outsWhenUp) {
                                    e.target.style.borderColor = '#00ffaa';
                                    e.target.style.boxShadow = '0 0 15px rgba(0, 255, 170, 0.2)';
                                }
                            }}
                            onBlur={(e) => {
                                validateField('outsWhenUp', e.target.value);
                                if (!errors.outsWhenUp) {
                                    e.target.style.borderColor = '#333';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                            min="0"
                            max="2"
                        />
                        {errors.outsWhenUp && <div style={errorStyle}>⚠ {errors.outsWhenUp}</div>}
                    </label>
                </div>

                <div style={fieldContainerStyle}>
                    <label style={labelStyle}>
                        🏏 Bat Score
                        <input 
                            type="number" 
                            value={batScore} 
                            onChange={e => setBatScore(e.target.value)}
                            style={getInputStyle('batScore')}
                            onFocus={(e) => {
                                if (!errors.batScore) {
                                    e.target.style.borderColor = '#00ffaa';
                                    e.target.style.boxShadow = '0 0 15px rgba(0, 255, 170, 0.2)';
                                }
                            }}
                            onBlur={(e) => {
                                validateField('batScore', e.target.value);
                                if (!errors.batScore) {
                                    e.target.style.borderColor = '#333';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                            min="0"
                        />
                        {errors.batScore && <div style={errorStyle}>⚠ {errors.batScore}</div>}
                    </label>
                </div>

                <div style={fieldContainerStyle}>
                    <label style={labelStyle}>
                        🥎 Field Score
                        <input 
                            type="number" 
                            value={fldScore} 
                            onChange={e => setFldScore(e.target.value)}
                            style={getInputStyle('fldScore')}
                            onFocus={(e) => {
                                if (!errors.fldScore) {
                                    e.target.style.borderColor = '#00ffaa';
                                    e.target.style.boxShadow = '0 0 15px rgba(0, 255, 170, 0.2)';
                                }
                            }}
                            onBlur={(e) => {
                                validateField('fldScore', e.target.value);
                                if (!errors.fldScore) {
                                    e.target.style.borderColor = '#333';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                            min="0"
                        />
                        {errors.fldScore && <div style={errorStyle}>⚠ {errors.fldScore}</div>}
                    </label>
                </div>
            </div>

            <div style={{...fieldContainerStyle, marginTop: '25px'}}>
                <label style={labelStyle}>
                    👤 Batter Stand
                    <select 
                        value={stand} 
                        onChange={e => setStand(e.target.value)}
                        style={{
                            ...getInputStyle('stand'),
                            cursor: 'pointer'
                        }}
                    >
                        <option value="L" style={{backgroundColor: '#1a1a1a'}}>Left</option>
                        <option value="R" style={{backgroundColor: '#1a1a1a'}}>Right</option>
                    </select>
                </label>
            </div>

            <button 
                type="submit"
                style={{
                    width: '100%',
                    marginTop: '30px',
                    backgroundColor: 'transparent',
                    color: '#00ffaa',
                    border: '2px solid #00ffaa',
                    padding: '15px 40px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontFamily: 'monospace',
                    boxShadow: '0 4px 15px rgba(0, 255, 170, 0.2)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#00ffaa';
                    e.currentTarget.style.color = '#000';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 255, 170, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#00ffaa';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 255, 170, 0.2)';
                }}
            >
                {existingPitch ? "✓ Update Data" : "→ Submit Data"}
            </button>
        </form>
    )
}

export default PitchForm
