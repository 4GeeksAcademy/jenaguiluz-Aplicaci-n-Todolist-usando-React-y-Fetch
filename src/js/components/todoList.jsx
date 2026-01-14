import React, { useEffect, useState } from "react";

const TodoList = () => {

    const USER = "jeanAguiluz";
    const API = "https://playground.4geeks.com/todo";

    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const getTasks = async () => {
        try {
            const response = await fetch(`${API}/users/${USER}`);
            const data = await response.json();

            if (response.status === 404) {
                await createUser();
                return;
            }

            if (Array.isArray(data.todos)) {
                setTasks(data.todos);
            } else {
                setTasks([]);
            }

        } catch (error) {
            console.error("Error obtaining tasks:", error);
            setTasks([]);
        }
    };

    const createUser = async () => {
        try {
            await fetch(`${API}/users/${USER}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            getTasks();
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const addTask = async () => {
        if (!inputValue.trim()) return;

        const newTask = {
            label: inputValue,
            is_done: false
        };

        try {
            await fetch(`${API}/todos/${USER}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask)
            });
            setInputValue("");
            getTasks();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await fetch(`${API}/todos/${id}`, { method: "DELETE" });
            getTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const clearAll = async () => {
        try {
            await fetch(`${API}/users/${USER}`, { method: "DELETE" });
            setTasks([]);
        } catch (error) {
            console.error("Error clearing all tasks:", error);
        }
    };

    useEffect(() => {
        getTasks();
    }, []);

    return (
        <div className="todo-container">
            <h1 className="todo-title">TodoList</h1>

            <input
                className="todo-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder="Write a new task"
            />

            {tasks.length === 0 ? (
                <p className="empty-message my-3">
                    There aren't tasks, add new tasks
                </p>
            ) : (
                <ul className="todo-list">
                    {tasks.map(task => (
                        <li key={task.id} className="todo-item">
                            {task.label}
                            <button
                                className="delete-btn"
                                onClick={() => deleteTask(task.id)}
                            >
                                x
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="task-footer">
                <p>Total tasks: {tasks.length}</p>
                <button className="deleteTotal-btn" onClick={clearAll}>
                    Clear All Tasks
                </button>
            </div>
        </div>
    );
};

export default TodoList;
