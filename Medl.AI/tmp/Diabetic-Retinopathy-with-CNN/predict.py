from keras.models import load_model
import numpy as np
import sys
from keras.applications.imagenet_utils import preprocess_input
from keras.preprocessing import image
from Model_metadata import Xsequential

def xpredict(file_path):
    classes = ['No DR', 'Mild', 'Moderate', 'Severe', 'Proliferative DR']
    model = load_model('retinopathy_predict.h5')
    img = image.load_img(file_path, target_size=model.input_shape[1:])
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x, mode='keras')
    preds = model.predict(x)
    metadata = Xsequential.extract_model_metadata(Xsequential, model)
    # print(metadata)
    dict = {}
    for i in range(0, len(classes)):
        dict[classes[i]] = preds[0][i]
    with open('predictions.txt', 'w') as f:
        dict = sorted(dict.items(), reverse=True)
        result = sorted(dict, key=lambda x: (-x[1], x[0]))
        f.write(str(result))
        print(str(result))
    return preds


xpredict(sys.argv[1])

