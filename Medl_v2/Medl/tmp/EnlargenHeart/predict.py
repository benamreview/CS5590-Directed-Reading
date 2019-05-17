from keras.models import load_model
import numpy as np
import cv2
import sys
from operator import itemgetter
from Model_metadata import Xsequential
import tensorflow as tf

def xpredict(file_path):
    classes = ['Healthy', 'Cardiomegaly']
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

    #metadata = Xsequential.extract_model_metadata(Xsequential, model)
    #print(metadata)

# Creates a graph.
a = tf.constant([1.0, 2.0, 3.0, 4.0, 5.0, 6.0], shape=[2, 3], name='a')
b = tf.constant([1.0, 2.0, 3.0, 4.0, 5.0, 6.0], shape=[3, 2], name='b')
c = tf.matmul(a, b)
# Creates a session with log_device_placement set to True.
sess = tf.Session(config=tf.ConfigProto(log_device_placement=True))
# Runs the op.
print(sess.run(c))
xpredict(sys.argv[1])

