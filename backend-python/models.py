from sqlalchemy import LargeBinary, create_engine, Column, Integer, String, ForeignKey, DateTime, Float
from sqlalchemy.orm import declarative_base, relationship
import datetime

# Déclaration de la base déclarative
Base = declarative_base()

# Connexion à la base de données
DATABASE_URL = "postgresql://postgres:admin@localhost/db_app3"
engine = create_engine(DATABASE_URL)

# Modèle de l'utilisateur
class User(Base):
    __tablename__ = 'users'
    id_user = Column(Integer, primary_key=True, index=True)
    nom = Column(String, nullable=False)
    prenom = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    telephone = Column(String, nullable=False, unique=True)
    mot_de_passe = Column(String, nullable=False)
    localisation = Column(String, nullable=False)
    role = Column(String)

    enclos = relationship('Enclos', back_populates='user')  # Relation avec Enclos

    def as_dict(self):
        return {
            "id_user": self.id_user,
            "nom": self.nom,
            "prenom": self.prenom,
            "email": self.email,
            "telephone": self.telephone,
            "mot_de_passe": self.mot_de_passe,
            "localisation": self.localisation,
            "role": self.role
        }
    
# Modèle de l'enclos
class Enclos(Base):
    __tablename__ = 'enclos'
    id_enclos = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    id_user = Column(Integer, ForeignKey('users.id_user'), nullable=False)  # Correction ici
    user = relationship('User', back_populates='enclos')  # Relation inverse avec User

    cameras = relationship('Camera', back_populates='enclos')  # Relation avec Camera
    poulets = relationship('Poulet', back_populates='enclos')  # Relation avec Poulet

    def as_dict(self):
        return {
            "id_enclos": self.id_enclos,
            "name": self.name,
            "id_user": self.id_user,
        }

# Modèle de la caméra
class Camera(Base):
    __tablename__ = 'cameras'
    id_camera = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    model = Column(String, nullable=True)
    id_enclos = Column(Integer, ForeignKey('enclos.id_enclos'), nullable=False)
    enclos = relationship('Enclos', back_populates='cameras')

    def as_dict(self):
        return {
            "id_camera": self.id_camera,
            "name": self.name,
            "model": self.model,
            "id_enclos": self.id_enclos,
        }

# Modèle de Poulet
class Poulet(Base):
    __tablename__ = 'poulets'
    id_poulet = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    poids = Column(Float, nullable=False)
    age = Column(Integer, nullable=False)
    id_enclos = Column(Integer, ForeignKey('enclos.id_enclos'), nullable=False)
    enclos = relationship('Enclos', back_populates='poulets')

    observations = relationship('Observation', back_populates='poulet')  # Relation avec Observation

    def as_dict(self):
        return {
            "id_poulet": self.id_poulet,
            "name": self.name,
            "poids": self.poids,
            "age": self.age,
            "id_enclos": self.id_enclos,
        }

# Modèle d'Observation
class Observation(Base):
    __tablename__ = 'observations'
    id_observation = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    id_poulet = Column(Integer, ForeignKey('poulets.id_poulet'), nullable=False)

    poulet = relationship('Poulet', back_populates='observations')  # Relation inverse avec Poulet

    def as_dict(self):
        return {
            "id_observation": self.id_observation,
            "description": self.description,
            "date": self.date,
            "id_poulet": self.id_poulet,
        }

# class Prediction(Base):
#     __tablename__ = 'predictions'
#     id_prediction = Column(Integer, primary_key=True, index=True)
#     class_predite = Column(String, nullable=False)
#     confiance = Column(Float, nullable=False)
#     date = Column(DateTime, default=datetime.datetime.utcnow)

#     # Relation avec la table Poulet

#     def as_dict(self):
#         return {
#             "id_prediction": self.id_prediction,
#             "class_predite": self.class_predite,
#             "confiance": self.confiance,
#             "date": self.date,
#         }
class Prediction(Base):
    __tablename__ = 'predictions'
    id_prediction = Column(Integer, primary_key=True, index=True)
    class_predite = Column(String, nullable=False)
    confiance = Column(Float, nullable=False)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    image = Column(LargeBinary, nullable=False)  # Stocker l'image en BLOB

    def as_dict(self):
        return {
            "id_prediction": self.id_prediction,
            "class_predite": self.class_predite,
            "confiance": self.confiance,
            "date": self.date,
            "image":self.image
        }


# Création des tables dans la base de données
if __name__ == '__main__':
    Base.metadata.create_all(engine)
