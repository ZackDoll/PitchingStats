import React from "react"

const PitchList = ({pitches, updateCallback}) => {
    const onDelete = async (id) => {
        try{
            const options = {
                method: "DELETE",
            }
            const response = await fetch (`http://127.0.0.1:5000/delete_pitch/${id}`, options)
                if(response.status === 200){
                    updateCallback();
                }
                else{
                    console.error("Failed to delete pitch")
                }
        }
        catch (error){
            alert(error)
    }
}

    return <div>
        <h2>Pitch Predictor</h2>
        <table>
            <thead>
                <tr>
                    <th>Inning</th>
                    <th>Balls</th>
                    <th>Strikes</th>
                    <th>Outs</th>
                    <th>Bat Score</th>
                    <th>Field Score</th>
                    <th>Stand</th>
                </tr>
            </thead>
            <tbody>
                {pitches.map((pitch) => (
                    <tr key={pitch.id}>
                        <td>{pitch.inning}</td>
                        <td>{pitch.balls}</td>
                        <td>{pitch.strikes}</td>
                        <td>{pitch.outsWhenUp}</td>
                        <td>{pitch.batScore}</td>
                        <td>{pitch.fldScore}</td>
                        <td>{pitch.stand}</td>
                        <td>
                            <button onClick = {() => onDelete(pitch.id)}>Delete</button>
                        </td>
                    </tr>
                    ))}
            </tbody>
        </table>
    </div>
}

export default PitchList