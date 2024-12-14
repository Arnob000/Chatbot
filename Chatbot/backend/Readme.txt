uvicorn app:app --host localhost --port 8000 --reload
OR,
uvicorn app:app --host 127.0.0.1 --port 8000 --reload

pip install -r requirements.txt

Dependencies to be installed-
PyPDF2, io, BytesIO, 
fastapi, fastapi.middleware.cors, CORSMiddleware
pydantic, transformers 