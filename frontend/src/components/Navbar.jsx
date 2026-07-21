  import React from 'react'
  import * as FaIcons from "react-icons/fa"
  import * as AiIcons from "react-icons/ai"
  import "./Navbar.css"
  import {useState} from 'react'

  
  function Navbar({history, onSelectQuestion}) {
    const [sideBar, setSideBar] = useState(false);

    const showSidebar = () => setSideBar(!sideBar)

    console.log("Data from Navbar: ", history)
    return (
      <>
          {
            !sideBar &&
            <div className='navbar'>
                <FaIcons.FaBars color="#0b0a0a" size={24} onClick={showSidebar}/>
            </div>
          }

          <nav className={sideBar ? 'nav-menu-active' : 'nav-menu'}>
              <ul className='nav-menu-items'>

                <li className='navbar-toggle'>
                    <text className='history'>History</text>
                    <AiIcons.AiOutlineClose color='black' size={24} onClick={showSidebar}/>
                </li>

                {
                  history.map((item) => {
                    return(
                      <li 
                        key={item.id} 
                        className='question'
                        title={item.question}
                        onClick={() => 
                        //console.log("Clicked: ", item.id)
                        onSelectQuestion(item.id)
                        
                        }>
                        {item.question}
                      </li> 
                    );
                  })
                }

              </ul>
          </nav>
      
      </>
    )
  }

  export default Navbar