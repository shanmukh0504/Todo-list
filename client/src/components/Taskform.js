import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  Box,
  FormControl,
  InputLabel,
  Checkbox,
  Button as MUIButton,
} from "@mui/material";
import { Button, Select } from "@mui/material";
import axiosInstance from "../services/api";
import { useNavigate } from "react-router-dom";

const initialEditSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  date: Yup.string().required("required"),
  type: Yup.string().required("Required"),
  time: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
});

const initialCreateSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  date: Yup.string().required("required"),
  type: Yup.string().required("Required"),
  time: Yup.string().required("Required"),
});

let initialValues = {
  name: "",
  type: "",
  date: dayjs().format('YYYY-MM-DD'),
  time: dayjs(),
  subtasks: [],
};
const TaskForm = ({ mode = "edit", task }) => {
  const navigate = useNavigate();
  const types = ["default", "personal", "shopping", "wishlist", "work"];
  const [subtaskName, setSubtaskName] = useState("");
  const [subtasks, setSubtasks] = useState(task?.subtasks || []);

  const handleAddSubtask = () => {
    if (subtaskName.trim() !== "") {
      axiosInstance
        .post(`/tasks/${task._id}/subtasks`, { name: subtaskName })
        .then((res) => {
          const updatedTask = res.data.task;
          if (
            updatedTask &&
            updatedTask.subtasks &&
            Array.isArray(updatedTask.subtasks)
          ) {
            const updatedSubtasks = [
              res.data.subtask,
              ...updatedTask.subtasks,
            ];
            setSubtasks(updatedSubtasks);
          } else {
            console.error("Subtasks data is not valid:", updatedTask);
          }
          setSubtaskName("");
        })
        .catch((error) => {
          console.error("Error adding subtask:", error);
        });
      window.location.reload();
    }
  };
  const [subTasks, setSubTasks] = useState(task?.subTasks || []);

  const handleSubTaskCompletion = async (subTaskId, completed) => {
    try {
      await axiosInstance.put(`/subtasks/${subTaskId}`, { completed });
      const updatedSubTasks = subtasks.map((subTask) =>
        subTask._id === subTaskId ? { ...subTask, completed } : subTask
      );
      setSubTasks(updatedSubTasks);
    } catch (error) {
      console.error("Error updating subtask completion status:", error);
    }
    window.location.reload();
  };

  const handleFormSubmit = (values, onSubmitProps) => {
    const dataToSend = { ...values, subtasks };

    if (mode === "edit") {
      axiosInstance.put(`/task/${values._id}`, dataToSend).then((res) => {
        navigate("/home");
      });
    } else {
      values.time = values.time.format("HH:mm");
      axiosInstance.post(`/task/create`, dataToSend).then((res) => {
        navigate("/home");
      });
    }
  };

  const handleDeleteSubtask = (subTaskId) => {
    axiosInstance.delete(`/subtasks/${subTaskId}`).then((res) => {
      // Delete the subtask from the local state
      const updatedSubtasks = subtasks.filter(
        (subtask) => subtask._id !== subTaskId
      );
      setSubtasks(updatedSubtasks);

      // If task is provided and it has subtasks, update the task's subtasks array
      if (task && task._id && task.subtasks) {
        const updatedTaskSubtasks = task.subtasks.filter(
          (subtask) => subtask !== subTaskId
        );

        // Update the task with the updated subtasks array
        axiosInstance
          .put(`/tasks/${task._id}`, { subtasks: updatedTaskSubtasks })
          .then((res) => {
            // Handle success if needed
          })
          .catch((error) => {
            console.error("Error updating task with deleted subtask:", error);
          });
      }
    });
    window.location.reload();
  };



  const isNotMobile = useMediaQuery("(min-width: 768px)");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={mode === "create" ? initialValues : task}
      validationSchema={mode === "create" ? initialCreateSchema : initialEditSchema}
    >
      {({
        handleSubmit,
        handleBlur,
        touched,
        resetForm,
        values,
        handleChange,
        errors,
      }) => (
        <Box p="2rem 0" m="2rem auto" width={isNotMobile ? "50%" : "90%"}>
          <Typography textAlign="center" mb="2rem">
            {mode === "edit" ? "Edit Task" : "Create a Task"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap="30px">
              <TextField
                label="Task name"
                value={values.name}
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.name) && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  value={dayjs(values.date || null)}
                  minDate={mode === "edit" ? null : dayjs()}
                  onChange={(newValue) => {
                    const newDate = newValue.format("YYYY-MM-DD"); // Format the new date
                    handleChange({ target: { name: "date", value: newDate } }); // Update form values
                    setDate(newDate); // Update the state
                  }}
                  onBlur={handleBlur}
                  name="date"
                  renderInput={(params) => (
                    <TextField {...params} helperText="Select Date" />
                  )}
                  error={Boolean(touched.date) && Boolean(errors.date)}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Time"
                  value={values.time} // Directly use values.time as the value
                  onChange={(newValue) => {
                    // Update values.time and setTime state
                    handleChange({ target: { name: "time", value: newValue } });
                    setTime(newValue);
                  }}
                  onBlur={handleBlur}
                  name="time"
                  error={Boolean(touched.time) && Boolean(errors.time)}
                  renderInput={(params) => (
                    <TextField {...params} helperText="Set Time" />
                  )}
                />
              </LocalizationProvider>

              <FormControl>
                <InputLabel>Select Type</InputLabel>
                <Select
                  label="Task type"
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="type"
                  error={Boolean(touched.type) && Boolean(errors.type)}
                >
                  {types.map((type, idx) => (
                    <MenuItem value={type} key={`${idx}-${type}`}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {mode === "edit" && (
                <FormControl>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={values.status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="status"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In-Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="canceled">Cancel</MenuItem>
                  </Select>
                </FormControl>
              )}
              {mode === "edit" && (
                <>
                  <Box display="flex" alignItems="center" gap="10px">
                    <TextField
                      label="Subtask name"
                      value={subtaskName}
                      onChange={(e) => setSubtaskName(e.target.value)}
                    />
                    <MUIButton variant="outlined" onClick={handleAddSubtask}>
                      Add Subtask
                    </MUIButton>
                  </Box>
                  {subTasks.map((subtask, index) => (
                    <Box key={index} display="flex" alignItems="center" gap="10px">
                      <Checkbox
                        checked={subtask.completed}
                        onChange={(event) =>
                          handleSubTaskCompletion(subtask._id, event.target.checked)
                        }
                      />
                      <Typography>{subtask.name}</Typography>
                      <MUIButton
                        variant="outlined"
                        onClick={() => handleDeleteSubtask(subtask._id)}
                      >
                        Delete
                      </MUIButton>
                    </Box>
                  ))}
                </>
              )}
              <Button
                variant="outlined"
                type="submit"
                m="2rem 0"
                p="1rem 0"
                background="#00D5FA"
              >
                {mode === "edit" ? "Done" : "Create Task"}
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </Formik>
  );
};

export default TaskForm;