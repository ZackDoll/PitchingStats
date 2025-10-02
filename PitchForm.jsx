// src/PitchForm.jsx
import { useState } from "react";

function PitchForm({ updateCallback, onClose, sendData }) {
    const [inning, setInning] = useState("")
    const [balls, setBalls] = useState("")
    const [strikes, setStrikes] = useState("")
    const [outsWhenUp, setOutsWhenUp] = useState("")
    const [fldScore, setFldScore] = useState("")
    const [batScore, setBatScore] = useState("")
    const [stand, setStand] = useState("L")

    const [result, setResult] = useState(null)
    const handleSubmit = async (e) => {
        e.preventDefault()

        // ensure numeric fields are numbers; fallback to 0 if blank
        const payload = {
            inning: Number(inning) || 0,
            balls: Number(balls) || 0,
            strikes: Number(strikes) || 0,
            outsWhenUp: Number(outsWhenUp) || 0,
            fldScore: Number(fldScore) || 0,
            batScore: Number(batScore) || 0,
            stand: stand || 0
        }

        console.log("Submitting payload:", payload)
        sendData(payload)

        try {
            const response = await fetch("http://127.0.0.1:5000/add_pitch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            let data;
            try { data = await response.json(); } catch { data = { message: "No JSON returned" }; }

            if (!response.ok) {
                alert(data.message || "Server error")
                return
            }

            alert("Pitch added successfully!")
            if (typeof updateCallback === 'function') updateCallback()
            if (typeof onClose === 'function') onClose()
            // clear form
            setInning(""); setBalls(""); setStrikes(""); setOutsWhenUp(""); setFldScore(""); setBatScore(""); setStand("L")
        } catch (err) {
            console.error("Add pitch failed:", err)
            alert("Network error")
        }
    }
        


    return (
        <form onSubmit={handleSubmit}>
            <label>Inning: <input type="number" value={inning} onChange={e => setInning(e.target.value)} /></label><br />
            <label>Balls: <input type="number" value={balls} onChange={e => setBalls(e.target.value)} /></label><br />
            <label>Strikes: <input type="number" value={strikes} onChange={e => setStrikes(e.target.value)} /></label><br />
            <label>Outs: <input type="number" value={outsWhenUp} onChange={e => setOutsWhenUp(e.target.value)} /></label><br />
            <label>Bat Score: <input type="number" value={batScore} onChange={e => setBatScore(e.target.value)} /></label><br />
            <label>Field Score: <input type="number" value={fldScore} onChange={e => setFldScore(e.target.value)} /></label><br />
            <label>Stand:
                <select value={stand} onChange={e => setStand(e.target.value)}>
                    <option value="L">Left</option>
                    <option value="R">Right</option>
                </select>
            </label><br />
            <button type="submit">Add Pitch</button>
        </form>
    )
}

export default PitchForm