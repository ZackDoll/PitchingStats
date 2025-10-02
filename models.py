from config import db
class Pitch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    inning = db.Column(db.Integer, nullable=False) 
    balls = db.Column(db.Integer, nullable=False)
    strikes = db.Column(db.Integer, nullable=False)
    outs_when_up = db.Column(db.Integer, nullable=False)
    fld_score = db.Column(db.Integer, nullable=False)
    bat_score = db.Column(db.Integer, nullable=False)
    stand = db.Column(db.String(1), nullable=False)  # 'L' or 'R'

#method to convert model instance to dictionary which can be easily converted to JSON
#camel case keys for frontend compatibility
    def to_json(self):
        return {
            'id': self.id,
            'inning': self.inning,
            'balls': self.balls,
            'strikes': self.strikes,
            'outsWhenUp': self.outs_when_up,
            'fldScore': self.fld_score,
            'batScore': self.bat_score,
            'stand': self.stand
        }
    