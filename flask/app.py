from flask import Flask, request, jsonify
import joblib
import pandas as pd
import shap
import numpy as np 
import PyPDF2
from flask_cors import CORS
from datetime import datetime
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import OpenAI
import faiss



app = Flask(__name__)
CORS(app)

# Load the saved model and encoders
model = joblib.load(r"models/model.pkl")
label_encoders = joblib.load(r"models/encoders.pkl")
fuel_model = joblib.load(r"models/fuel_consumption_model.pkl") 
driver_model=joblib.load(r"models/drive_score.pkl")


# Initialize SHAP explainer with the model
explainer = shap.Explainer(model)

# Function to preprocess the manual
def preprocess_manual(pdf_path):
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        manual_text = ""
        for page in pdf_reader.pages:
            manual_text += page.extract_text()
    return manual_text

# Split text into chunks
def split_text_to_chunks(text, chunk_size=500, chunk_overlap=50):
    chunks = []
    for i in range(0, len(text), chunk_size - chunk_overlap):
        chunks.append(text[i:i + chunk_size])
    return chunks

# Create embeddings for the chunks
def create_faiss_index(chunks, embedding_function):
    chunk_embeddings = embedding_function.embed_documents(chunks)
    dimension = len(chunk_embeddings[0])
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(chunk_embeddings))
    return index, chunk_embeddings

# Initialize the OpenAI embedding function
def initialize_embedding_function(api_key):
    return OpenAIEmbeddings(openai_api_key=api_key)

# Function to search the FAISS index
def search_faiss_index(query, chunks, index, embedding_function, k=3):
    query_embedding = embedding_function.embed_query(query)
    distances, indices = index.search(np.array([query_embedding]), k)
    results = [chunks[i] for i in indices[0] if i != -1]
    return results

# Initialize GPT-4 for natural language processing
def initialize_llm(api_key):
    return OpenAI(temperature=0.7, openai_api_key=api_key)

# Process the FAISS results through LLM for user-friendly output
def process_results_with_llm(query, results, llm):
    # Combine results into a context
    context = "\n\n".join(results)
    if not context:
        return "No relevant information found."

    # Prepare prompt for the LLM
    prompt = f"""
    Context:
    {context}

    Question:
    {query}

    Provide a concise and user-friendly response:
    """

    # Generate response
    response = llm(prompt)
    return response

# Preprocessing the manual
pdf_path = "vehicle_manual.pdf"
manual_text = preprocess_manual(pdf_path)
chunks = split_text_to_chunks(manual_text)

# Initialize embedding function and FAISS index
embedding_function = initialize_embedding_function('YOUR-OPEN-API-KEY')
faiss_index, chunk_embeddings = create_faiss_index(chunks, embedding_function)

# Initialize LLM
llm = initialize_llm("YOUR-OPEN-API-KEY")

@app.route('/search-manual', methods=['POST'])
def search_manual():
    try:
        data = request.json
        query = data.get('query', '')

        if not query:
            return jsonify({"error": "Query not provided"}), 400

        # Debugging log
        print(f"Received query: {query}")

        # Search FAISS index and process with LLM
        faiss_results = search_faiss_index(query, chunks, faiss_index, embedding_function)
        print(f"FAISS results: {faiss_results}")  # Log retrieved chunks
        
        llm_response = process_results_with_llm(query, faiss_results, llm)
        return jsonify({"response": llm_response}), 200
    except Exception as e:
        print(f"Error in /search-manual endpoint: {e}")
        return jsonify({"error": str(e)}), 500




@app.route('/')
def home():
    return "Welcome to the Vehicle Maintenance Prediction API!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Receive and process input data
        data = request.get_json()
        df = pd.DataFrame([data])

        # Handle dates and encoding
        for date_column in ['Last_Service_Date', 'Warranty_Expiry_Date']:
            if date_column in df.columns:
                df[date_column] = (datetime.now() - pd.to_datetime(df[date_column], format="%d-%m-%Y")).dt.days
        for column, le in label_encoders.items():
            if column in df.columns and column not in ['Last_Service_Date', 'Warranty_Expiry_Date']:
                df[column] = le.transform(df[column])

        # Make prediction
        prediction = model.predict(df)[0]

        # Generate SHAP explanation
        shap_values = explainer(df)
        explanation_columns = ['Battery_Status', 'Brake_Condition', 'Tire_Condition', 'Maintenance_History', 'Reported_Issues']
        shap_explanation = []

        # Gather SHAP values with feature names and sort them
        for feature in explanation_columns:
            if feature in df.columns:
                feature_value = df[feature].iloc[0]
                if feature in label_encoders:
                    feature_value = label_encoders[feature].inverse_transform([feature_value])[0]
                shap_value = shap_values[:, :, 0].values[0, df.columns.get_loc(feature)]
                shap_explanation.append({"feature": feature.replace("_", " "), "value": feature_value, "shap_value": shap_value})

        # Sort SHAP explanation by absolute SHAP value in descending order
        shap_explanation = sorted(shap_explanation, key=lambda x: abs(x['shap_value']), reverse=True)

        # Return prediction and sorted SHAP values
        response = {
            'prediction': "Maintenance Needed" if prediction == 1 else "No Maintenance Needed",
            'explanation': shap_explanation  # List of dictionaries with feature name, value, and SHAP value
        }
        return jsonify(response)
    except Exception as e:
        print("An error occurred:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/predict-fuel', methods=['POST'])
def predict_fuel():
    try:
        # Get JSON data from the request
        data = request.get_json()
        
        # Convert data into a DataFrame for model input
        df = pd.DataFrame([data])
        
        # Make prediction
        prediction = fuel_model.predict(df)[0]
        co2_emission = round(prediction, 2)
        
        # Return prediction as JSON
        return jsonify({'prediction': co2_emission})
    
    except Exception as e:
        # Print error and return it as JSON
        print("Error occurred:", str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/driver-score', methods=['POST'])
def driver_score():
    try:
        # Receive the JSON data from the request
        data = request.get_json()
        print("Received data:", data)  # Log received data for debugging

        # Convert JSON data to DataFrame
        df = pd.DataFrame([data])
        print("DataFrame created:\n", df)

        # Calculate the driver score
        score = driver_model.predict(df)[0]

        # Provide explanations based on score thresholds
        explanation = []
        if score < 60:
            explanation = [
                "Frequent sharp acceleration changes detected.",
                "Multiple sharp turns indicating abrupt driving style."
            ]
        elif score < 80:
            explanation = [
                "Moderate acceleration changes observed.",
                "Some sharp turns indicating careful but occasionally abrupt driving."
            ]
        else:
            explanation = [
                "Smooth acceleration observed.",
                "Minimal sharp turns, indicating steady driving style."
            ]

        if score is None:
            return jsonify({"error": "Calculation error"}), 500

        return jsonify({"score": score, "explanation": explanation})

    except Exception as e:
        print(f"Error in /driver-score endpoint: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
