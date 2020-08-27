# -*- coding: utf-8 -*-
import os
import re
import logging
from flask import Flask, request
import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
from scipy.interpolate import interp1d
import requests

# flask app
app = Flask(__name__)

# flask logger
def init_log(app, log_path, log_level):
    formatter = logging.Formatter('%(asctime)s %(name)s %(levelname)s: %(message)s')
    handler = logging.FileHandler(log_path)
    handler.setLevel(log_level)
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    app.logger.debug("logger start ...")

init_log(app, '/dvol/log/JackBot.log', logging.DEBUG)

@app.route("/")
def hello():
    app.logger.info("Hello Flask!")
    return "Hello Flask!"

@app.route("/JackBot", methods=['GET', 'POST'])
def jackbot():
    for key, value in request.values.items():
        app.logger.info("{0}: {1}".format(key, value))
    return "Hello Flask!"

def plotdata(data):
    plt.rcParams['font.sans-serif']=['Droid Sans Fallback'] 
    plt.rcParams['axes.unicode_minus']=False
    mpl.rcParams['figure.figsize'] = (6, 3)

    mydata = [tuple(x.split('=')) for x in data.split(' ')]
    name = mydata[0][0]
    t = mydata[1][1]
    label = "{} [{}/{}/{} {}:{}]".format(name, t[:4], t[4:6], t[6:8], t[8:10], t[10:])
    
    index = float(mydata[2][1])
    xlabel = [ x[0][1:] for x in mydata[3:] ]
    xvalue = list(range(len(xlabel)))
    yvalue = [ float(x[1]) for x in mydata[3:] ]
    
    # plot
    xnew = np.linspace(xvalue[0],xvalue[-1],300) #300 represents number of points to make between T.min and T.max
    ynew = interp1d(xvalue, yvalue, kind='cubic')(xnew)

    fig, ax = plt.subplots()
    ax.plot(xnew, ynew)

    # plot index
    ax.plot([xvalue[0],xvalue[-1]], [index, index], c='green', linestyle='dashed')

    xoff = (max(yvalue) - min(yvalue)) / 40

    ax.scatter(xvalue, yvalue)

    if name == "VX":
        fmt = "{:.2f}" 
    elif name == "TX":
        fmt = "{:.0f}"
    else:
        fmt = "{}"

    for i, val in enumerate(yvalue):
        ax.annotate(fmt.format(val), (xvalue[i], yvalue[i] + xoff))

    diff = yvalue[0] - index 
    idx_str = "[{:+.2f}]\n{:.2f}".format(diff, index)
    ax.annotate(idx_str, (xvalue[-1], index + xoff))
    ax.set_xticks(xvalue)
    ax.set_xticklabels(xlabel)
    ax.set_title(label)
    ax.yaxis.grid()

    fname = name + '.png'
    fig.savefig(fname)
    return fname

def teleSendPhoto_Old(chat_list, fname):
    TELEGRAM_TOKEN = '862133853:AAF0GXHvRMrbqgbOq60rP4tiEamHqIZmSQY'
    for chatid in chat_list:
        data = {
            "method": "sendPhoto",
            'chat_id': chatid}
        files = {'photo': open(fname, 'rb')}
        url = "https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/?chat_id=" + chatid
        requests.post(url, files=files, data=data)

def teleSendPhoto(chat_list, fname):
    TELEGRAM_TOKEN = '1305465743:AAFLcqvOQ6lG_dsCoOH8sndcd96llc7n3L4'
    for chatid in chat_list:
        data = {
            "method": "sendPhoto",
            'chat_id': chatid}
        files = {'photo': open(fname, 'rb')}
        url = "https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/?chat_id=" + chatid
        requests.post(url, files=files, data=data)

@app.route("/vxchart", methods=['GET', 'POST'])
def vxchart():
    chat_list = request.values['chatid'].split(',')
    data = request.values['data']

    fname = plotdata(data)
    teleSendPhoto_Old(chat_list, fname)

    return fname

@app.route("/xchart", methods=['GET', 'POST'])
def xchart():
    chat_list = request.values['chatid'].split(',')
    data = request.values['data']

    fname = plotdata(data)
    teleSendPhoto(chat_list, fname)

    return fname

if __name__ == "__main__":
    app.run(debug=True)
