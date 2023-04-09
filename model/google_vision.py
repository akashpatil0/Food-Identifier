import torch
import torch.nn as nn
from torchvision import transforms
from torchvision.datasets import ImageFolder
from torch.utils.data import DataLoader
from os import listdir
from os.path import exists
from torch.nn.functional import one_hot
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

transform_train = transforms.Compose([
            transforms.Resize(224),
            transforms.RandomCrop(224, padding=4),
            transforms.RandomHorizontalFlip(),
            transforms.ToTensor(),
            transforms.Normalize((0.5071, 0.4865, 0.4409), (0.2673, 0.2564, 0.2762)),
        ])

transform_val = transforms.Compose([
            transforms.Resize(224),
            transforms.ToTensor(),
            transforms.Normalize((0.5071, 0.4865, 0.4409), (0.2673, 0.2564, 0.2762)),
        ])

if torch.cuda.is_available():  
  dev = "cuda:0" 
else:  
  dev = "cpu"  
device = torch.device(dev) 

model = resnet50(weights=ResNet50_Weights.DEFAULT)
for p in model.parameters():
    p.requires_grad = False

num_classes = len(listdir("./../food_images/train/"))
model.fc = denseHead(model.fc.in_features, num_classes)
model = model.to(dev)

path = "model.weights"

if exists(path):
    model.load_state_dict(torch.load(path))

ce_loss = nn.CrossEntropyLoss()
optim = torch.optim.Adam(lr=3e-4, params=model.parameters())

foodData_train = ImageFolder("./../food_images/train/", transform=transform_train)
train_loader = DataLoader(foodData_train, batch_size=64, shuffle=True)

foodData_val = ImageFolder("./../food_images/val/", transform=transform_train)
val_loader = DataLoader(foodData_val, batch_size=64, shuffle=True)

for _ in range(100):
    for X, y in train_loader:
        X = X.to(dev)
        y = one_hot(y, num_classes).float().to(dev)
        model.zero_grad()
        out = model(X.view(-1, 3, 224, 224))
        loss = ce_loss(out, y.view(-1, num_classes))
        loss.backward()
        optim.step()

    print("Check Accuracy")

    model.eval()
    model = model
    total = 0
    for X, y in train_loader:
        out = model(X.to(dev))
        total += torch.sum(torch.argmax(out, dim=1) == y.to(dev)).cpu().item()
    print(f"Training Accuracy: {total/len(foodData_train)}")

    total = 0
    for X, y in val_loader:
        out = model(X.to(dev))
        total += torch.sum(torch.argmax(out, dim=1) == y.to(dev)).cpu().item()
    print(f"Validation Accuracy: {total/len(foodData_val)}")
    model = model.to(dev)
    model.train()
    torch.save(model.state_dict(), path)