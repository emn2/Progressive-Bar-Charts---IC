#handle data and pre-calculate things such as mean, variance and confidence intervals
import scipy.stats as st
import pandas as pd
import numpy as np
from dataset_power_generator import generate

def getConfidenceInterval(numElements, mean, std_dev, confidence):
   t_crit = st.norm.ppf(confidence)
   return [mean - std_dev*t_crit/np.sqrt(numElements), mean + std_dev*t_crit/np.sqrt(numElements)]

def getMean(a, r):
    return np.mean(a[0:r])

def getStdDev(a, r):
    return np.std(a[0:r])

def calculate(datasequence):
    means = []
    confidence_intervals = []

    #first step 88 points
    idx = 88
    confidence = 0.95

    means.append(getMean(datasequence, idx))
    confidence_intervals.append(getConfidenceInterval(idx, getMean(datasequence, idx), getStdDev(datasequence, idx), confidence))

    offset = 84
    n = len(datasequence)
    while(idx < n):
        idx += offset
        mean = getMean(datasequence, idx)
        means.append(mean)
        confidence_intervals.append(getConfidenceInterval(idx, mean, getStdDev(datasequence, idx), confidence))

    return [means, confidence_intervals]


#means for each datasequence and each moment analyzed
#confidence interval for each datasequence and each moment analyzed

#csv: datasequence (array) | mean(array) | confidence intervals (array)

dataframe = generate()
n = len(dataframe)

dataset = []
labels = ['datasequence', 'means', 'confidence_intervals']

for i in range(n):
    [m, ci] = calculate(dataframe[i])
    dataset.append((dataframe[i], m, ci))

dataset = pd.DataFrame(dataset, columns = labels)

print(len(dataset['confidence_intervals'][0]))

filename = "Dataset_power.json"
dataset.to_json(filename)

