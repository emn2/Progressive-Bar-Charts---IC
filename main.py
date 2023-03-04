#handle data and pre-calculate things such as mean, variance and confidence intervals
import scipy.stats as st
import pandas as pd
import numpy as np
from dataset_normal_generator import generate

def getConfidenceInterval(numElements, mean, std_dev, confidence):
   t_crit = st.norm.ppf(confidence)
   return [mean - std_dev*t_crit/np.sqrt(numElements), mean + std_dev*t_crit/np.sqrt(numElements)]

def getMean(a, r):
    return np.mean(a[0:r])

def getStdDev(a, r):
    return np.std(a[0:r])

def calculate(datasequence):
    means = []
    ci_hi = []
    ci_low = []

    #first step 88 points
    idx = 88
    confidence = 0.95

    means.append(getMean(datasequence, idx))

    [ci_l, ci_h] = getConfidenceInterval(idx, getMean(datasequence, idx), getStdDev(datasequence, idx), confidence)

    ci_hi.append(ci_h)
    ci_low.append(ci_l)


    offset = 84
    n = len(datasequence)
    while(idx < n):
        idx += offset
        mean = getMean(datasequence, idx)
        means.append(mean)

        [ci_l, ci_h] = getConfidenceInterval(idx, mean, getStdDev(datasequence, idx), confidence)
        ci_hi.append(ci_h)
        ci_low.append(ci_l)

    return [means, ci_low, ci_hi]


#means for each datasequence and each moment analyzed
#confidence interval for each datasequence and each moment analyzed

#csv: datasequence (array) | mean(array) | confidence intervals (array)

dataframe = generate()
n = len(dataframe)

dataset = []
labels = ['datasequence', 'mean', 'ci_low', 'ci_hi']

for i in range(n):
    [m, ci_low, ci_hi] = calculate(dataframe[i])
    dataset.append((dataframe[i], m, ci_low, ci_hi))

dataset = pd.DataFrame(dataset, columns = labels)

filename = "Dataset_normal_big_variance.json"
dataset.to_json(filename)

