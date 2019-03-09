from keras.models import load_model
import numpy as np
import cv2
import sys
from operator import itemgetter
from Model_metadata import Xsequential

def xpredict(file_path):
    classes = ['Cardiomegaly', 'Healthy']
    model = load_model('full_pred_model.h5')
    shape = model.input_shape[1:]
    img = cv2.imread(file_path)
    img = cv2.resize(img, shape[0:2])
    img = np.expand_dims(img, axis=0)
    pred = model.predict_classes(img, verbose = True)
    dict = {}
    prob = model.predict(img)
    dict[classes[pred[0][0]]] = prob[0][0]

    with open('predictions.txt', 'w') as f:
        dict = sorted(dict.items(), reverse = True)
        sorted(dict, key=itemgetter(1), reverse=True)
        f.write(str(dict))
        print(str(dict))
    #metadata = Xsequential.extract_model_metadata(Xsequential, model)
    #print(metadata)

xpredict(sys.argv[1])

