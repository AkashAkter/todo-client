import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

function TodoList() {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [noTasksMessage, setNoTasksMessage] = useState("");

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (email) {
      const url =
        priorityFilter === "all"
          ? `http://localhost:5000/api/tasks?email=${email}`
          : `http://localhost:5000/api/tasks?email=${email}&priority=${priorityFilter}`;

      axios
        .get(url)
        .then((response) => {
          const fetchedTasks = response.data.data;
          setTasks(fetchedTasks);
          setNoTasksMessage(
            fetchedTasks.length === 0
              ? "No tasks available for the selected filter."
              : ""
          );
        })
        .catch((error) => console.error("Error fetching tasks!", error));
    }
  }, [email, priorityFilter]);

  const handleAddTask = () => {
    const newTask = {
      name: taskName,
      description: taskDescription,
      priority,
      status: false,
      email,
    };
    axios
      .post("http://localhost:5000/api/tasks", newTask)
      .then((response) => {
        setTasks((prevTasks) => [...prevTasks, response.data.data]);
        setTaskName("");
        setTaskDescription("");
        setPriority("low");
        document.getElementById("my_modal_1").close();
      })
      .catch((error) => console.error("Error adding task!", error));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskName(task.name);
    setTaskDescription(task.description);
    setPriority(task.priority);
    document.getElementById("my_modal_1").showModal();
  };

  const handleEditSubmit = () => {
    const updatedTask = {
      name: taskName,
      description: taskDescription,
      priority,
      status: editingTask.status,
      email,
    };
    axios
      .put(`http://localhost:5000/api/tasks/${editingTask._id}`, updatedTask)
      .then((response) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === editingTask._id ? response.data.data : task
          )
        );
        setEditingTask(null);
        setTaskName("");
        setTaskDescription("");
        setPriority("low");
        document.getElementById("my_modal_1").close();
      })
      .catch((error) => console.error("Error updating task!", error));
  };

  const handleStatusChange = (taskId, currentStatus) => {
    const newStatus = !currentStatus;
    axios
      .patch(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus })
      .then((response) => {
        const updatedTask = response.data.data;
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          )
        );
      })
      .catch((error) => console.error("Error updating task status!", error));
  };

  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios
        .delete(`http://localhost:5000/api/tasks/${taskId}`)
        .then(() =>
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== taskId)
          )
        )
        .catch((error) => console.error("Error deleting task!", error));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.reload();
  };

  return (
    <div>
      <header className="text-center my-4 font-mono">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to Your To-Do List
        </h1>
        <p className="mt-4 text-gray-600">
          Stay organized and on top of your tasks! Add, edit, and track your
          to-do items all in one place.
        </p>
      </header>

      <div className="flex justify-between items-center">
        <div>
          <button
            className="btn btn-accent font-sans text-white"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            Add new Task <IoMdAdd />
          </button>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-5">
                {editingTask ? "Edit Task" : "Add your task"}
              </h3>
              <div className="flex flex-col gap-5">
                <input
                  className="input input-bordered input-primary w-full"
                  placeholder="Task name"
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
                <textarea
                  className="textarea textarea-primary"
                  placeholder="Task description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                ></textarea>
                <select
                  className="select select-bordered select-primary w-full"
                  onChange={(e) => setPriority(e.target.value)}
                  value={priority}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  className="btn btn-accent font-sans"
                  onClick={editingTask ? handleEditSubmit : handleAddTask}
                >
                  {editingTask ? "Update Task" : "Add Task"}
                </button>
              </div>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn btn-error font-sans">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
        <div className="my-5 flex justify-end text-teal-400">
          <select
            className="select select-bordered select-primary border-teal-400"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {noTasksMessage && <p className="text-red-500">{noTasksMessage}</p>}

      <div className="overflow-x-auto my-10">
        <table className="table w-full">
          <thead>
            <tr className="text-black">
              <th className="text-left p-2 text-sm w-20">Task</th>
              <th className="text-left p-2 text-sm w-1/3">Description</th>
              <th className="text-left p-2 text-sm w-20">Priority</th>
              <th className="text-left p-2 text-sm w-20">Status</th>
              <th className="text-center p-2 text-sm w-1/5">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="text-gray-800 font-normal">
                <td className="p-2">{task.name}</td>
                <td className="p-2 max-w-xs">{task.description}</td>
                <td className="p-2">
                  {task.priority === "high" && (
                    <span className="px-4 py-2 bg-red-500 text-white rounded-full font-semibold">
                      High
                    </span>
                  )}
                  {task.priority === "medium" && (
                    <span className="px-4 py-2 bg-yellow-500 text-white rounded-full font-semibold">
                      Medium
                    </span>
                  )}
                  {task.priority === "low" && (
                    <span className="px-4 py-2 bg-green-500 text-white rounded-full font-semibold">
                      Low
                    </span>
                  )}
                </td>

                <td className="p-2">
                  <button
                    className={` font-sans ${
                      task.status ? "completed-btn" : "not-completed-btn"
                    }`}
                    onClick={() => handleStatusChange(task._id, task.status)}
                  >
                    {task.status ? "Completed" : "Mark as Complete"}
                  </button>
                </td>
                <td className="flex justify-center gap-2">
                  <button
                    className="btn btn-sm btn-accent !ring-0 !outline-none font-sans flex justify-center items-center p-2"
                    onClick={() => handleEditTask(task)}
                  >
                    <FaEdit className="text-white" size={20} />
                  </button>
                  <button
                    className="btn btn-sm btn-error !ring-0 !outline-none font-sans flex justify-center items-center p-2"
                    onClick={() => handleDelete(task._id)}
                  >
                    <MdDeleteForever className="text-white" size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 text-lg mb-4 font-mono font-extrabold">
          Stay on top of your tasks, and never miss a deadline. Let’s get things
          done!
        </p>
        <button
          className="btn btn-success font-sans text-white"
          onClick={handleLogout}
        >
          Click Here to Sign Out
        </button>
      </div>
    </div>
  );
}

export default TodoList;
