import numpy as np
import pandas as pd
import random
import matplotlib.pyplot as plt

def generate():
    alfa_left = 2.75
    alfa_right = 3.5

    x_min_left = 3
    x_min_right = 10

    amount_of_points = 10000

    dataset = []

    for i in range(100):
        alfa = random.uniform(alfa_left, alfa_right)
        x_min = random.uniform(x_min_left, x_min_right)
        datasequence = (np.random.pareto(alfa - 1, amount_of_points) + 1) * x_min
        dataset.append(datasequence)

    return dataset
    # filename = "Dataset2.csv"
    # df = pd.DataFrame(dataset)
    # df.to_csv(filename)
