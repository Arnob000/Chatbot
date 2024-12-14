"""
Developed by Arnob Saha Ankon
"""

from io import BytesIO
import PyPDF2
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# question-answering model
qa_pipeline = pipeline("question-answering")

stored_text = "Welcome to TechGuide! TechGuide is your personal assistant designed to help you navigate and understand complex technical documents with ease. Whether you're dealing with software documentation, scientific papers, or technical manuals, TechGuide simplifies the jargon, explains key concepts, and answers your questions. Just ask, and I'll guide you through the most challenging content, making technical writing accessible and understandable for everyone! "

def extract_text_from_pdf(file):
    pdf_reader = PyPDF2.PdfReader(file)
    extracted_text = ""
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        extracted_text += page.extract_text()
        
    print(extracted_text)
    return extracted_text

# Endpoint for file upload
@app.post("/upload-file/")
async def upload_file(file: UploadFile = File(...)):
    global stored_text
    
    if not file.filename.endswith(".pdf"):
         return {"message": "Unsupported file type", "file_name": file.filename}

    file_content = await file.read()
    file_stream = BytesIO(file_content)  
    extracted_text = extract_text_from_pdf(file_stream)
    
    
    stored_text += extracted_text
    print("file uploaded")
    return {"message": "File processed successfully", "file_name": file.filename}


class Question(BaseModel):
    question: str

# Question-answering endpoint
@app.post("/ask-question/")
def ask_question(question:Question):
    print(question.question)
    global stored_text
    if not stored_text:
        return {"answer": "I am unable to answer you question right now! Please upload some content (pdf files).", "score": "0.5"}

    result = qa_pipeline(question=question.question, context=stored_text)
    
    return {"answer": result['answer'], "score": result['score']}

