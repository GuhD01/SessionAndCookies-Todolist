import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Cookies } from 'react-cookie';
import "./App.css";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [newItem, setNewItem] = useState("");
  const [newTitle, setNewTitle] = useState(''); // State for the edited title
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [checked, setChecked] = useState(false); // State for checkbox
  const [editId, setEditId] = useState(null); // State for editing todo ID

  // const cookies = new Cookies();
  // const logout = () => {
  //   const cookies = new Cookies(null, { path: '/' });
  //   cookies.remove('session')
  //   cookies.remove('user_id')
  //   cookies.remove('session_id')

  // }

  // const handleSignOut = async () => {
  //   setError(""); 

  //   try {
  //     await logout()
  //     navigate("/login");
  //   } catch {
  //     setError("Failed to log out")
  //   }
  // }

    const cookies = new Cookies();

    const logout = async () => {
        const session_id = cookies.get('session_id');
        if (session_id) {
            try {
                await axios.delete(`http://localhost:8000/sessions/${session_id}`);
                // Clear cookies after successful backend logout
                cookies.remove('session_id', { path: '/' });
                cookies.remove('user_id', { path: '/' });
                cookies.remove('session', { path: '/' });

                navigate('/login');  // Redirect to login page
            } catch (err) {
                console.error("Failed to logout -", err);
            }
        } else {
            console.error("No session to logout");
        }
    };
  

  useEffect(() => {
    async function fetchTodos() {
        try {
            const cookies = new Cookies();
            const userId = cookies.get('user_id');
            const response = await axios.get(`http://localhost:8000/user/${userId}/todos`);
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    }

    const intervalId = setInterval(fetchTodos, 5000); // Fetch todos every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    async function getUsername() {
      try {
        const cookies = new Cookies();
        const session = cookies.get('session');
        const user_id = cookies.get('user_id');
        if (!session || !user_id) {
          throw new Error('Session data not found');
        }
        const response = await axios.get(`http://localhost:8000/users/${user_id}`);
        setUsername(response.data.username);
      } catch (error) {
        setError("Error fetching username: " + error.message);
      }
    }

    getUsername();
  }, []);

  function addTodo() {

    if (!newItem.trim()) {

        alert("Todo cannot be empty");

        return;

    }

    const user_id = cookies.get('user_id');

    axios.post(`http://localhost:8000/users/${user_id}/todos/`, {

      title: newItem,

      completed: false,

    }).then(() => {

      setNewItem(""); // Clear input field after adding

    }).catch(error => {

      alert("Failed to add todo: " + error.message);

    });

  }



  function toggleTodo(id, title, completed) {

    axios.put(`http://localhost:8000/users/${cookies.get('user_id')}/todos/${id}`, {

      title: title,

      completed: !completed,

    }).then(() => {

      // Update todos state

      setTodos(prevTodos => prevTodos.map(todo => {

        if (todo.id === id) {

          return { ...todo, completed: !completed };

        }

        return todo;

      }));

    }).catch(error => {

      alert("Failed to update todo: " + error.message);

    });

  }



  function deleteTodo(id) {

    axios.delete(`http://localhost:8000/users/${cookies.get('user_id')}/todos/${id}`).then(() => {

      // Update todos state

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

    }).catch(error => {

      alert("Failed to delete todo: " + error.message);

    });

  }



  function editTodo() {

    axios.put(`http://localhost:8000/users/${cookies.get('user_id')}/todos/${editId}`, {

      title: newTitle,

      completed: checked,

    }).then(() => {

      // Update todos state

      setTodos(prevTodos => prevTodos.map(todo => {

        if (todo.id === editId) {

          return { ...todo, title: newTitle, completed: checked };

        }

        return todo;

      }));

      setIsEditing(false);

      setEditId(null);

    }).catch(error => {

      alert("Failed to update todo: " + error.message);

    });

  }



  function handleEdit(id, title, completed) {

    setIsEditing(true);

    setEditId(id); // Set the ID of the todo being edited

    setNewTitle(title);

    setChecked(completed);

  }



  function handleChecked(id, title, completed) {

    setChecked(!completed); // Invert completed state

    toggleTodo(id, title, completed);

  }



  function filterTodo() {

    switch(filter) {

      case "Ongoing":

        return todos.filter((todo) => !todo.completed);

      case "Completed":

        return todos.filter((todo) => todo.completed);

      default:

        return todos;

    }

  }

  async function handleSubmit(e) {
        e.preventDefault();    // prevent website from refreshing
    
        if (!newItem.trim()) {
            alert("Todo cannot be empty");
            return;
        }

        try {
            // Get userId from cookies session
            const cookies = new Cookies();
            const user_id = cookies.get('user_id');

            addTodo(user_id, newItem);

            setNewItem("");
        } catch (error) {
            alert(error);
        }
  }
    
  return (
    <main>  
       <div className="App">
        <span className="btn-shine">Gde Ngurah Randy Agastya - 2602119165</span>
      </div>
      <div className="flex justify-center">
          <p className="text-black tracking-[.025em] text-black font-semibold mt-3 mb-12 text-1xl underline italic">{username}</p>
        </div>
        
            <div className="bg-white px-12 py-6 rounded-lg shadow-xl mt-28">
        

        

        {
            error && 
            <div className="text-black justify-center flex text-red-500 italic text-sm">
                {error}
            </div>
        }

      </div>
      
      <form className="new-item-form" onSubmit={(e) => e.preventDefault()}>
      <div className="form-control">
        <label htmlFor="item">New item</label>
        <input className="input input-alt" placeholder="Type your activity!" type="text" id="item" value={newItem} onChange={(e) => setNewItem(e.target.value)} />

            </div>  
                <button className="btn" type="button" onClick={handleSubmit}>Add</button>
      </form>
      <div className="todo-header">
      <h1 className="header">Todo List</h1>
          <div className="text-black flex-none">
          <select className="filter-dropdown"  onChange={(e) => setFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="Completed">Completed</option>
              <option value="Incomplete">Incomplete</option>
            </select>
          </div>
        </div>
        
      <div >
          <ul className="list ">
            {todos.length === 0 && "No todos"}
            {filterTodo().map(todo => (
              <li className="mb-1" key={todo.id}>
                <label className='w-full'>
                  <input type="checkbox" checked={todo.completed} onChange={() => handleChecked(todo.id, todo.title, todo.completed)} disabled={isEditing} className="check"/>
                  {isEditing && editId === todo.id ? (
                    <>
                      <input  value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder='Edit Todo' className="grow text-black cursor-auto ml-4" autoFocus />
                      <button className="btn-save" onClick={editTodo}>Save</button>
                    </>
                  ) : (
                    <>
                      <div className="task-text">{todo.title}</div>
                      <button className="btn-edit button-container" onClick={() => handleEdit(todo.id, todo.title, todo.completed)}>Edit</button>
                    </>
                  )}
                  <button className="btn-delete button-container" onClick={() => deleteTodo(todo.id)}>Delete</button>
                </label> 
              </li>
            ))}
          </ul>
        </div>
        <div className="Sign-Out-Button" style={{ position: 'absolute', top: '10px', left: '10px' }}>
        <button onClick={logout} className="sign-out-button" style={{
          boxShadow: "inset 0 2px 4px 0 rgb(2 6 23 / 0.3), inset 0 -2px 4px 0 rgb(203 213 225)",
          display: "inline-flex",
          cursor: "pointer",
          alignItems: "center",
          gap: "1rem",
          borderRadius: "0.375rem",
          border: "1px solid rgb(203 213 225)",
          background: "linear-gradient(to bottom, rgb(249 250 251), rgb(229 231 235))",
          padding: "0.5rem 1rem",
          fontWeight: "600",
          opacity: "1",
          textDecoration: "none",
          color: "rgb(55 65 81)"
        }}>Sign Out</button>
      </div>
    </main>
  );
}

export default Todo;
