import { createContext, useContext, useState, useEffect } from 'react'

const TaskContext = createContext()

// Get tasks from localStorage or use default tasks
const getInitialTasks = () => {
  const savedTasks = localStorage.getItem('tasks')
  return savedTasks ? JSON.parse(savedTasks) : [
    { 
      id: 1, 
      title: 'Complete project proposal',
      description: 'Write up the initial project scope and requirements',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-03-20'
    },
    { 
      id: 2, 
      title: 'Review code changes',
      description: 'Review pull requests from the team',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-03-15'
    },
  ]
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(getInitialTasks)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      status: 'pending',
      ...taskData
    }
    setTasks([...tasks, newTask])
  }

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId
        ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
        : task
    ))
  }

  // Add sorting functionality
  const sortTasks = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      // Sort by due date first
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      // Tasks with due dates come before tasks without
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      return 0
    })
  }

  const filteredTasks = sortTasks(
    tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
      return matchesSearch && matchesPriority
    })
  )

  const getTask = (taskId) => {
    return tasks.find(task => task.id === Number(taskId))
  }

  const updateTask = (taskId, updatedData) => {
    console.log('Updating task:', { taskId, updatedData }) // Debug log
    setTasks(tasks.map(task => 
      task.id === Number(taskId)
        ? { ...task, ...updatedData }
        : task
    ))
  }

  return (
    <TaskContext.Provider 
      value={{ 
        tasks: filteredTasks,
        addTask,
        deleteTask,
        toggleTaskStatus,
        searchQuery,
        setSearchQuery,
        filterPriority,
        setFilterPriority,
        getTask,
        updateTask
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  return useContext(TaskContext)
} 