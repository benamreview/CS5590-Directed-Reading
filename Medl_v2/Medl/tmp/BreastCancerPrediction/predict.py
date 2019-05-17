from keras.models import load_model
import pandas as pd
from sklearn.preprocessing import StandardScaler
from Model_metadata import Xsequential
from operator import itemgetter
import sys

def xpredict(df):
    classes = ['Benign', 'Malignant']
    X = df.iloc[:, 2:32]  # [all rows, col from index 2 to the last one excluding 'Unnamed: 32']
    y = df.iloc[:, 1]  # [all rows, col one only which contains the classes of cancer]
    model = load_model('breast_cancer_model.h5')
    from sklearn.preprocessing import LabelEncoder

    labelencoder_Y = LabelEncoder()
    y = labelencoder_Y.fit_transform(y)

    from sklearn.model_selection import train_test_split

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
    sc = StandardScaler()
    X_train = sc.fit_transform(X_train)
    X_test = sc.transform(X_test)
    #model.xfit(X_train, y_train, batch_size=1, epochs=1)
    metadata = Xsequential.extract_model_metadata(Xsequential, model)
    preds = model.predict(X_test[1:2, ])
    class_names = model.predict_classes(X_test[1:2,])
    dict = {}
    dict[classes[class_names[0][0]]] = preds[0][0]
    with open('predictions.txt','w') as f:
        dict = sorted(dict.items(), reverse=True)
        f.write(str(dict))
        print(str(dict))




df =  pd.read_csv(sys.argv[1])
xpredict(df)
