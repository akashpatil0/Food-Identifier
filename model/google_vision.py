import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms
from os import listdir
from torch.utils.data import Dataset, DataLoader
from torch.nn.functional import one_hot
import numpy as np
from torchvision.models import mobilenet_v3_small, MobileNet_V3_Small_Weights


class food_classifier(nn.Module):

    def __init__(self) -> None:
        super(food_classifier, self).__init__()
        self.net = mobilenet_v3_small(weights=MobileNet_V3_Small_Weights.DEFAULT)
        self.net.eval()
        self.linear_stack = nn.Sequential(
            nn.Linear(1000, 2048),
            nn.ReLU(),
            nn.Linear(2048, 1024),
            nn.ReLU(),
            nn.Linear(1024, 13),
            nn.Softmax(1)
        )

    def forward(self, input):
        x = self.net(input)
        out = self.linear_stack(x)
        return out

class foodDataset(Dataset):

    def __init__(self) -> None:
        self.transform = transforms.Compose([
    transforms.Resize(299),
    transforms.CenterCrop(299),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])
        self.catagories = {"bean":0, "broccoli":1, "cabbage":2, "carrot":3, "cauliflower":4, "cucumber":5,
                            "egg":6, "potato":7, "pumpkins":8, "radish":9, "rice":10, "tomato":11, "other":12}
        self.images = []
        self.image_labels = []
        for c in listdir(f"./food_images/"):
            for p in listdir(f"./food_images/{c}"):
                self.images.append(self.transform(Image.open(f"./food_images/{c}/{p}")).unsqueeze(0))
                self.image_labels.append(torch.tensor(self.catagories[c]).unsqueeze(0))
        self.images = torch.concat(self.images)
        self.image_labels = one_hot(torch.concat(self.image_labels), 13).float()

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        return self.images[idx], self.image_labels[idx]

model = food_classifier()
foodData = foodDataset()
train_loader = DataLoader(foodData, batch_size=64, shuffle=True)
ce_loss = nn.CrossEntropyLoss()
optim = torch.optim.Adam(lr=3e-4, params=model.parameters())

for _ in range(100):
    i = 0
    for X, y in train_loader:
        print(i)
        i += 1
        model.zero_grad()
        out = model(X.view(-1, 3, 299, 299))
        loss = ce_loss(out, y.view(-1, 13))
        loss.backward()
        optim.step()

        train_results = []
        model.eval()
        with torch.no_grad():
            for X, y in train_loader:
                out = model(X)
                print((np.argmax(out.numpy(), axis=1) == np.argmax(y.numpy(), axis=1)).shape)
                train_results.append(np.sum(np.argmax(out.numpy(), axis=1) == np.argmax(y.numpy(), axis=1)))
                break
        print(sum(train_results)/(len(train_results)*64))
        model.train()
        break