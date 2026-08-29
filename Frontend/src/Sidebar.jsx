import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { useAuth } from "./AuthContext.jsx";
import { v1 as uuidv1 } from 'uuid';

function Sidebar() {
    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats } = useContext(MyContext);
    const { user, logout } = useAuth();

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread", {
                credentials: 'include' // send HTTP-only cookie
            });
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            //console.log(filteredData); 
            setAllThreads(filteredData);
        }catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]); 

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread  = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`, {
                credentials: 'include'
            });
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(error) {    
            console.log(error);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
                method: "DELETE",
                credentials: 'include'
            });
            const res = await response.json();
            console.log(res);

            //update allThreads after deletion
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            
            if (threadId === currThreadId) {
                createNewChat(); // If the deleted thread is the current one, create a new chat
            }

        }catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="sidebar">
            {/* new chat button*/}
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            {/* chat history */}
            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx} onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? "highlighted" : " "}
                        >{thread.title}
                            <i className="fa-solid fa-trash" onClick={(e) => {
                                e.stopPropagation(); // Prevent event bubbling to the parent li element
                                deleteThread(thread.threadId);
                            }}>
                            </i>
                        </li>
                    ))
                }
            </ul>

            {/* user info + logout */}
            <div className="sign">
                <p title={user?.email}>👤 {user?.name || 'User'}</p>
                <button
                    id="logout-btn"
                    onClick={logout}
                    style={{
                        background: 'none',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: 'rgba(255,255,255,0.6)',
                        borderRadius: '6px',
                        padding: '4px 12px',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        marginTop: '6px',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => e.target.style.color = '#ef4444'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                >
                    <i className="fa-solid fa-arrow-right-from-bracket" style={{marginRight: '6px'}}></i>
                    Log Out
                </button>
            </div>
        </section>
    )
}

export default Sidebar;