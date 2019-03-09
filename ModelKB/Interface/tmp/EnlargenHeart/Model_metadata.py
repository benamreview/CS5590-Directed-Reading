import matplotlib.pyplot as plt
from keras.models import load_model
from sklearn.metrics import confusion_matrix
import pickle
import time
import os
import json
import itertools
import pandas as pd
import matplotlib.pyplot as plt


class Xsequential():
    metadata = {}

    def get_projectname(self):
        return self.__project_name

    def set_projectname(self, project_name):
        self.__project_name = project_name

    def extract_model_metadata(self, model):
        model_metadata = {}
        project_name = Xsequential.set_projectname(self, 'Cardiomegaly Prediction')
        model_metadata['model_name'] = Xsequential.get_projectname(self)
        model_metadata['layersCount'] = len(model.layers)
        model_metadata['InputTensors'] = model.input_shape
        model_metadata['OutputTensor'] = model.output_shape
        model_metadata['Optimizer'] = model.optimizer.__class__.__name__
        model_metadata['LossFunction'] = model.loss
        # framework
        framework = str(model.__class__)
        # converting model in json format
        model_json = model.to_json()
        version = json.loads(model_json)
        index = framework.find('keras')
        if index != -1:
            model_metadata['framework'] = framework[index:13] + ' ' + version["keras_version"]

        return model_metadata
