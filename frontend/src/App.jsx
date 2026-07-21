import { useState, useEffect } from 'react'
import './App.css'
import Modal from './components/Modal/Modal'
import Navbar from './components/Navbar';

function App() {
  const [input, setInput] = useState("");
  const [output1, setOutput1] = useState("");
  const [output2, setOutput2] = useState("");
  const [displayQuery, setDisplayQuery] = useState("");

  const [data, setData] = useState([]);

  useEffect(() =>{
    async function fetchHistory(){

      const url = "http://localhost:8000/api/home/getHistory"

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const data = await res.json()
      console.log("saved querys from the database:", data)
      //console.log()
      setData(data)

    }
    fetchHistory()
  },[])

  const handleClick = async() => {
    // Replace this with your backend/API call
    const url = "http://localhost:8000/api/home/userText"
    const res = await fetch(url,{
      method: "POST",
      headers:{"Content-Type": "application/json"},
      body: JSON.stringify({text: input})
    })

    const data = await res.json()

    // console.log("Result:", data.result);
    // console.log("SQL query:", data.query);

    /// Gets the first row from data.result if it exists.
    const firstRow = data.result && data.result[0];
    /// If a first row exists, it takes all its values and joins them into a single string (e.g., "87, 15").
    /// Otherwise, it sets displayValue to an empty string.
    const displayValue = firstRow
      ? Object.values(firstRow).join(", ")
      : "";
    setOutput1(displayValue);
    setOutput2(data.query);
    setDisplayQuery(input);
    setInput("")

  };

  const handleClickedQuestion = async(id) => {
    // const url = `http://localhost:8000/api/home/selectedQueryFromDB/${id}`
    const res = await fetch(`http://localhost:8000/api/home/selectedQueryFromDB/${id}`);

    const data = await res.json();

    console.log("Data from handleClickedQuestion(): ", data)

    setInput(data.question)
    setDisplayQuery(data.question);
    setOutput2(data.query)

    /// Gets the first row from data.result if it exists.
    const firstRow = data.result && data.result[0];
    /// If a first row exists, it takes all its values and joins them into a single string (e.g., "87, 15").
    /// Otherwise, it sets displayValue to an empty string.
    const displayValue = firstRow
      ? Object.values(firstRow).join(", ")
      : "";
    setOutput1(displayValue)

  }

  return (
    <>
      <div className='grand-container'>

        <div className='navbar-container'>
            <Navbar history={data} onSelectQuestion={handleClickedQuestion}/>
        </div>
        <div className="main-container">
          
          <div className="child-container">

            <header className="header">
              <h1 className="title">Supply Chain Management</h1>
              <p className="subtitle">Ask a question about your supply chain data in plain English</p>
            </header>

            <div className="modal-container">
              <Modal/>
            </div>

            {/* Input Section */}
            <div className="input-section">
              <textarea
                className="input-field"
                placeholder="Enter your text for query"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>

              <div className="button-container">
                <button onClick={handleClick} disabled={!input.trim()} className={!input.trim() ? "disabled-button" : "submit-button"}>
                  Submit
                </button>
              </div>
            </div>

            <div className="input-display-container">
              {
                displayQuery ?
                <span className="input-display">{displayQuery}</span>
                :
                <span className="input-display input-display-empty">No query to display!</span>
              }
            </div>

            {/* Output Section */}
            <div className="output-section">

              <div className="query-result-container">
                <span className="span-query-result">Query Result</span>
                <textarea className="output-field-one" value={output1} readOnly></textarea>
              </div>

              <div className="query-container">
                <span className="span-query">Query</span>
                <textarea className="output-field-two" value={output2} readOnly></textarea>
              </div>

            </div>

          </div>
        </div>


      </div>
    </>
  )
}

export default App
