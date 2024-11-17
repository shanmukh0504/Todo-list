import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Container } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../redux/TaskSlice";
import axios from "../services/api";
import Header from "./Header";
import { Link } from "react-router-dom";
import Task from "../components/Task";
import Stack from "@mui/material/Stack";

const Home = () => {
  const dispatch = useDispatch();
  const [typeFilter, setTypeFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const types = ["default", "personal", "shopping", "wishlist", "work"];
  const days = [
    { label: "Today", value: "today" },
    { label: "Last Seven", value: "seven" },
    { label: "Last Thirty", value: "thirty" },
  ];
  const statuses = ["pending", "completed", "in-progress", "canceled"];

  useEffect(() => {
    axios.get(`/task?type=${typeFilter}&day=${dayFilter}&status=${statusFilter}`)
      .then((res) => {
        dispatch(setTasks(res.data.tasks));
      });
  }, [dispatch, typeFilter, dayFilter, statusFilter]);

  const { tasks } = useSelector((state) => state.task);

  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  return (
    <Box>
      <Header />
      <Container>
        <Box display="flex" justifyContent="space-between" mt="2rem">
          <FormControl style={{ minWidth: 150 }}>
            <InputLabel>Select Type</InputLabel>
            <Select value={typeFilter} onChange={handleTypeChange}>
              {types.map((type, idx) => (
                <MenuItem key={`${idx}-${type}`} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl style={{ minWidth: 150 }}>
            <InputLabel>Select Status</InputLabel>
            <Select value={statusFilter} onChange={handleStatusChange}>
              {statuses.map((status, idx) => (
                <MenuItem key={`${idx}-${status}`} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2}>
            {days.map((day, idx) => (
              <Button
                variant="contained"
                size="small"
                color={day.value === dayFilter ? "success" : "secondary"}
                key={`${idx}-${day.value}`}
                onClick={() => {
                  setDayFilter(day.value);
                }}
              >
                {day.label}
              </Button>
            ))}
          </Stack>
          <Link to="/task/create" style={{ textDecoration: "none" }}>
            <Button variant="contained" size="small" color="primary">
              Add Task
            </Button>
          </Link>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Button onClick={() => { setTypeFilter(''); setDayFilter(''); setStatusFilter('') }}>Clear filters</Button>
        </Box>
        <Box mt="2rem">
          <Grid container spacing={2}>
            {tasks.map((task, idx) => (
              <Grid item xs={12} md={3} key={`${idx}-${task.id}`}>
                <Task task={task} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
