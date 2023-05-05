import numpy as np
import pandas as pd


def graphs_calc (data, propertyForCalc):

    arr = data[propertyForCalc].to_numpy()
    print(len(arr))
    arr = arr[~pd.isnull(arr)]
    print(len(arr))
    print('arr', arr)



    if all(isinstance(e, (int, float)) for e in arr):
        print("data is numeric")
        dataType = "numerical"
        chartOptions = ["histogram"]
        charts =[]
        for chartType in chartOptions:
            if chartType == "histogram":
                chartValues, chartBinsLabels = np.histogram(arr)
                cv = chartValues.astype(float)
                cb =chartBinsLabels.astype(float)
            chartDict= {"chartType" : chartType, "chartValues" : cv.tolist(), "chartBinsLabels": cb.tolist() }
            charts.append(chartDict)




    # if not(all(isinstance(e, (int, float)) for e in arr)):
    elif all(not isinstance(e, (int, float)) for e in arr):
        print("data is categorical")
        dataType = "categorical"
        chartOptions = ["histogram"]
        charts = []
        for chartType in chartOptions:
            chartBinsLabels = np.unique(arr)
            chartBinsLabels = [x for x in chartBinsLabels if x != '']
            chartValues = []
            if chartType == "histogram":
                for type in chartBinsLabels:
                    count = int(np.count_nonzero(arr == type))
                    chartValues.append(count)


            chartDict = {"chartType": chartType, "chartValues": chartValues,
                     "chartBinsLabels": chartBinsLabels}
            charts.append(chartDict)


    chart = {"dataType": dataType, "chartData": charts}
    print('chart', chart)

    return chart