import numpy as np
import pandas as pd
import random

mu_left = 12
mu_right = 30

std_dev_left = 25
std_dev_right = 35

dataset = []

for i in range(1):
    mu = random.uniform(mu_left, mu_right)
    sigma = random.uniform(std_dev_left, std_dev_right)**(1/2)
    datasequence = np.random.normal(mu, sigma, 10)
    dataset.append(datasequence)

filename = "Dataset4.csv"

df = pd.DataFrame(dataset)
df.to_csv(filename)

