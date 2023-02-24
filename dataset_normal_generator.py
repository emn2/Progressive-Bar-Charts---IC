import numpy as np
import pandas as pd
import random

def generate():
    mu_left = 12
    mu_right = 30

    std_dev_left = 25
    std_dev_right = 35

    amount_of_points = 10000

    dataset = []

    for i in range(100):
        mu = random.uniform(mu_left, mu_right)
        sigma = random.uniform(std_dev_left, std_dev_right)**(1/2)
        datasequence = np.random.normal(mu, sigma, amount_of_points)
        dataset.append(datasequence)

    return dataset

    # df = pd.DataFrame(dataset)
    # filename = "Dataset4.csv"
    # df.to_csv(filename)



