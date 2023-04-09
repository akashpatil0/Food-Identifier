import uvicorn
import pickle as pkl
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from torchvision import transforms 
import torch
import numpy as np
import torch.nn as nn
from torchvision.models import ResNet50_Weights, resnet50

class denseHead(nn.Module):

    def __init__(self, num_in, num_out) -> None:
        super(denseHead, self).__init__()
        self.linear_stack = nn.Sequential(
            nn.Linear(num_in, 1024),
            nn.ReLU(),
            nn.Linear(1024, 512),
            nn.ReLU(),
            nn.Linear(512, num_out)
        )

    def forward(self, input):
        return self.linear_stack(input)

model = resnet50(weights=ResNet50_Weights.DEFAULT)
model.fc = denseHead(model.fc.in_features, 29)
model.load_state_dict(torch.load(r"C:\Users\nussb\Documents\Python Scripts\Bitcamp2023\Food-Identifier\model\model.pth"))
model.eval()

transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Resize(224, antialias=True),
        transforms.Normalize((0.5071, 0.4865, 0.4409), (0.2673, 0.2564, 0.2762)),
    ])

prediction_mapping = None
with open(r"C:\Users\nussb\Documents\Python Scripts\Bitcamp2023\Food-Identifier\model\prediction_mappings.pkl", "rb") as f:
    prediction_mapping = pkl.load(f)

# Initializing the fast API server
app = FastAPI()

origins = [
    "http://localhost:5173/",
    "localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Loading up the trained model
# Defining the model input types
class Candidate(BaseModel):
    height: int
    width: int
    image: list

# Setting up the home route
@app.get("/")
def read_root():
    return {"data": "Welcome to online employee hireability prediction model"}

# Setting up the prediction route
@app.post("/prediction/")



async def get_predict(data: Candidate):


    im = np.array(data.image).reshape(3, data.height, data.width)
    tensor = transform(im).float().view(-1, 3, 224, 224)
    prediction = torch.argmax(model(tensor), dim=1).item()

    return {

    "data": {

    'prediction': list(prediction_mapping.keys())[list(prediction_mapping.values()).index(prediction)],
            }

    }

# Configuring the server host and port
if __name__ == '__main__':
    uvicorn.run(app, port=8080, host='0.0.0.0')