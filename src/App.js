import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from "./component/Header";
import Footer from "./component/Footer";
import Tasks from "./component/Tasks";
import AddTask from "./component/AddTask";
import About from "./component/About";

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks]             = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:3000/tasks')
    const data = await res.json()

    return data
  }

  // Fetch Tasks
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:3000/tasks/${id}`)
    const data = await res.json()

    return data
  }

  // Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    setTasks([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE'
    })

    //ここの処理があんまりわからん
    setTasks(tasks.filter((task) => task.id !== id))
  }

  //Toggle Reminder
  //ダブルクリックが発火しない。おそらく子要素にonClickがあるため、何かしらのバグがあると思う。
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await res.json()

    setTasks(
      tasks.map((task) => task.id === id
        ? { ...task, reminder: data.reminder }
        : task)
    )
  }

  return (
    <Router>
    <div className="container">
      <Header
        onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}
      />
        <Route path='/' exact render={(props) => (
          <>
            {/* &&:trueなら以降の記述を表示、falseなら表示しない */}
            { showAddTask &&
              <AddTask onAdd={addTask}/>
            }
            {tasks.length > 0 ? (
              <Tasks
                tasks={tasks}
                onDelete={deleteTask}
                onToggle={toggleReminder}
              />
            ) : (
              'No Tasks To Show'
            )}
          </>
        )} />
        <Route path='/about' component={About} />
      <Footer />
    </div>
    </Router>
  );
}

export default App;
