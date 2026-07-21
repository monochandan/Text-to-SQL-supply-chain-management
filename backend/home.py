from fastapi import APIRouter, Depends
from database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import Text, text
from pydantic import BaseModel
import os
import warnings
from dotenv import load_dotenv, find_dotenv
from  google import genai
from prompts import sql_prompt
import re
from models import QueryHistory

_ = load_dotenv(find_dotenv())
warnings.filterwarnings("ignore", category=DeprecationWarning)
gemini_api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key)

router = APIRouter(prefix = "/api/home")

class SqlExtractionError(ValueError):
    """Raised when no SQL code block can be found in the model's response."""

class UserTextRequest(BaseModel):
    text: str


def extract_sql(response):
    # Use regex to find the SQL query in the response
    match = re.search(r"```sql(.*?)```", response, re.DOTALL)
    if match:
        return match.group(1).strip()
    raise SqlExtractionError(f"No SQL code block found in model response: {response!r}")
    
def getResponse(text: str, prompt: str = sql_prompt):
    prompt = prompt.format(question=text)
    response = client.models.generate_content(model="gemini-2.5-flash",
                                 contents=prompt)
    
    print(response.text)
    return response



@router.post("/userText")
def userText(userText: UserTextRequest, db: Session = Depends(get_db)):
    print("User Text:", userText.text)
    if userText.text:
        # get the response from the Gemini API
        response = getResponse(userText.text)
        # extract the sql code from the response
        try:
            query = extract_sql(response.text)
        except SqlExtractionError as e:
            return {
                "value": "Could not extract a SQL query from the model response",
                "query": None,
                "error": str(e)
            }
        # if the model determined the question can't be answered, surface that directly
        if query.startswith("-- UNANSWERABLE"):
            return {
                "result": None,
                "query": query,
            }

        # add in the database the user asked question and sql query
        history = QueryHistory(
            question = userText.text,
            sql_query = query
        )
        db.add(history)
        db.commit()
        db.refresh(history)
        
        # run the query and get the result

        result = db.execute(text(query)).fetchall()
        print("result:", result)
        return {
        #     #"value": "150/kg",
        #     "query": query,
        #     "result": result
            "result": [dict(row._mapping) for row in result],
            "query": query
        }
         
    return {
        "result": "Text is required",
        "query": "Text is required"
    }

@router.get("/getHistory")
def getHistory(db: Session = Depends(get_db)):
    data = db.query(QueryHistory.id, QueryHistory.question).all()
    print("Questions:", data)
    if data:
        return [
            {
                "id": row.id,
                "question": row.question
            }
            for row in data
        ]
    else:
        return [
            {
                "id": "empty",
                "question": "empty"
            }
        ]

@router.get("/selectedQueryFromDB/{id}")
def selectedQueryFromDB(id: int, db: Session = Depends(get_db)):
    query = db.query(QueryHistory).filter(QueryHistory.id == id).first()

    if query:
        print("Query selectedQueryFromDB(): ", query.id, query.question, query.sql_query)

        result = db.execute(text(query.sql_query)).fetchall()
        query_result = [dict(row._mapping) for row in result]

        print("Result after running the query selectedQueryFromDB(): ", result)
    
        return {
            "question": query.question,
            "query": query.sql_query,
            "result": query_result
        }
    
    return{
        "question": "empty",
        "query": "empty"
    }
