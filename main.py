#create
# - id
# - inning
# - balls
# - strikes
# - outs_when_up
# - fld_score
# - bat_score
# - stand

import joblib
import pandas as pd
import numpy as np
import sklearn

from config import app, db

from flask import request, jsonify
from flask_cors import cross_origin

from models import Pitch


#create zone model
zone_model = joblib.load(open('zone_model.pkl', 'rb'))
#create pitch_type model
pitch_type_model = joblib.load(open('pitch_model.pkl', 'rb'))

@app.route('/predict_zone', methods=['POST', 'OPTIONS'])
def predict_zone():
    if request.method == 'OPTIONS':
        return '', 204
    data = request.json
    features = np.array([data['features']])
    
    prediction = zone_model.predict(features)[0]
    probabilities = zone_model.predict_proba(features)[0].tolist() # Convert to percentages

    return jsonify({"predicted_zone": int(prediction), "probabilities": probabilities})
    

@app.route('/pitches', methods=['GET'])
def get_pitches():
    pitches = Pitch.query.all()
    json_pitches = [p.to_json() for p in pitches]
    return jsonify({"pitches": json_pitches})

@app.route('/add_pitch', methods=['POST'])
def add_pitch():
    data = request.get_json(force = True)

    inning = data.get('inning')
    balls = data.get('balls')
    strikes = data.get('strikes')
    outs_when_up = data.get('outsWhenUp')
    fld_score = data.get('fldScore')
    bat_score = data.get('batScore')
    stand = data.get('stand')

    required_fields = [inning, balls, strikes, outs_when_up, fld_score, bat_score, stand]

    if any(field is None for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    
    new_pitch = Pitch(
        inning=inning,
        outs_when_up=outs_when_up,
        balls=balls,
        strikes=strikes,
        bat_score=bat_score,
        fld_score=fld_score,
        stand=stand
    )
    try:
        db.session.add(new_pitch)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    return jsonify({"message": "Pitch added successfully"}), 201

@app.route("/update_pitch/<int:pitch_id>", methods = ['PATCH'])
def update_pitch(pitch_id):
    pitch = Pitch.query.get(pitch_id)
    if not pitch:
        return jsonify({"message": "Pitch not found"}), 404
    data = request.json
    inning = data.get('inning')
    balls = data.get('balls')
    strikes = data.get('strikes')
    outs_when_up = data.get('outsWhenUp')
    fld_score = data.get('fldScore')
    bat_score = data.get('batScore')
    stand = data.get('stand')

    db.session.commit()

    return jsonify({"message": "Pitch updated successfully"}), 200
           
@app.route("/delete_pitch/<int:id>", methods=['DELETE'])
def delete_pitch(id):
    pitch = Pitch.query.get(id)
    if not pitch:
        return jsonify({"message": "Pitch not found"}), 404
    db.session.delete(pitch)
    db.session.commit()
    return jsonify({"message": "Pitch deleted successfully"}), 200

if __name__ == '__main__':
    #Create the database tables if they don't exist
    with app.app_context():
        db.create_all()
    #Run the Flask app
    app.run(debug = True)