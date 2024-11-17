import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../services/api";
import { useNavigate } from "react-router-dom";

import {
  Card,
  Box,
  CardContent,
  CardActionArea,
  Typography,
  Divider,
  Button,
  MenuItem,
  FormControl,
  Select,
  Checkbox,
} from "@mui/material";

const Task = ({ task }) => {
  const [status, setStatus] = useState(task.status);
  const [subTasks, setSubTasks] = useState(task.subTasks || []);
  const navigate = useNavigate();

  useEffect(() => {
    setStatus(task.status);
    setSubTasks(task.subTasks);
  }, [task.status, task.subTasks]);

  const updateTaskStatus = async (newStatus) => {
    try {
      const updatedTask = { ...task, status: newStatus };
      await axiosInstance.put(`/task/${task._id}`, updatedTask);
      setStatus(newStatus); 
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    updateTaskStatus(newStatus);
  };

  const handleSubTaskCompletion = async (subTaskId, completed) => {
    try {
      await axiosInstance.put(`/subtasks/${subTaskId}`, { completed }); 
      const updatedSubTasks = subTasks.map((subTask) =>
        subTask._id === subTaskId ? { ...subTask, completed } : subTask
      );
      setSubTasks(updatedSubTasks);
    } catch (error) {
      console.error("Error updating subtask completion status:", error);
    }
  };

  const handleDelete = async () => {
    try {
      for (const subTask of task.subTasks) {
        axiosInstance.delete(`/subtasks/${subTask._id}`);
      }
      await axiosInstance.delete(`/task/${task._id}`);
      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
    window.location.reload();
  };



  return (
    <Box sx={{ minWidth: 283 }}>
      <Card>
        <CardActionArea>
          <CardContent>
            <Link
              style={{ textDecoration: "none" }}
              to={`/task/${task._id}`}
            >
              <Typography gutterBottom variant="h5" component="div">
                {task.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Date: {task.date.split("T")[0]}
              </Typography>
              <Typography sx={{ mb: 1 }}>{task.type}</Typography>
            </Link>
            <p>Subtasks</p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {subTasks
                .filter((subTask) => !subTask.completed)
                .map((subTask) => (
                  <div
                    key={subTask._id}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Checkbox
                      checked={subTask.completed}
                      onChange={(event) =>
                        handleSubTaskCompletion(
                          subTask._id,
                          event.target.checked
                        )
                      }
                    />
                    <Typography sx={{ flexGrow: 1 }}>{subTask.name}</Typography>
                  </div>
                ))}
            </div>
            <Divider sx={{ my: 2 }} />
            <FormControl>
              <Select
                value={status}
                onChange={handleStatusChange}
                variant="outlined"
                sx={{
                  maxWidth: "150px",
                  maxHeight: "37px",
                  bgcolor:
                    status === "pending"
                      ? "primary.main"
                      : status === "completed"
                        ? "success.main"
                        : status === "canceled"
                          ? "error.main"
                          : status === "in-progress"
                            ? "warning.main"
                            : "primary.main",
                  color: "#fff",
                }}
              >
                <MenuItem value="pending">PENDING</MenuItem>
                <MenuItem value="completed">COMPLETED</MenuItem>
                <MenuItem value="canceled">CANCELLED</MenuItem>
                <MenuItem value="in-progress">IN PROGRESS</MenuItem>
              </Select>
            </FormControl>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              sx={{ ml: 1 }}
            >
              Delete
            </Button>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default Task;
