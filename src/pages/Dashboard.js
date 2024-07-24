import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Box,
  AppBar,
  Toolbar,
  TextField
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import {
  Add as AddTask,
  Edit,
  Delete,
  CheckCircle,
  Cancel
} from "@mui/icons-material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("/api/todo");
    setTasks(res.data.tasks);
  };

  const handleAddTask = async (values, { setSubmitting, resetForm }) => {
    const res = await axios.post("/api/todo", values);
    toast.success("Task added successfully");
    setTasks([...tasks, res.data.task]);
    resetForm();
    setSubmitting(false);
  };

  const handleDeleteTask = async (id) => {
    await axios.delete(`/api/todo/${id}`);
    toast.success("Task deleted successfully");
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const handleEditTask = async (values, { setSubmitting }) => {
    await axios.put(`/api/todo/${editTask._id}`, values);
    toast.success("Task updated successfully");
    // setTasks(
    //   tasks.map((task) => (task._id === res.data._id ? res.data : task))
    // );
    fetchTasks();
    setEditTask(null);
    setOpen(false);
    setSubmitting(false);
  };

  const handleStatusChange = async (task) => {
    const updatedTask = {
      ...task,
      status: task.status === "pending" ? "completed" : "pending"
    };
    await axios.put(`/api/todo/${task._id}`, updatedTask);
    toast.success("Status updated");
    fetchTasks();
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    dueDate: Yup.date().required("Due date is required")
  });

  return (
    <Container>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <Button color="inherit" onClick={() => logout()}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>

      <Paper style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6" gutterBottom>
          Add New Todo
        </Typography>
        <Formik
          initialValues={{ title: "", description: "", dueDate: "" }}
          validationSchema={validationSchema}
          onSubmit={handleAddTask}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    label="Title"
                    name="title"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!!errors.title}
                    helperText={<ErrorMessage name="title" />}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    label="Description"
                    name="description"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!!errors.description}
                    helperText={<ErrorMessage name="description" />}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Field
                    as={TextField}
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={!!errors.dueDate}
                    helperText={<ErrorMessage name="dueDate" />}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<AddTask />}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    Add Task
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>

      <List>
        {tasks.map((task) => (
          <ListItem key={task._id} divider>
            <ListItemText
              primary={task.title}
              secondary={`Description: ${task.description} | Due: ${
                task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "N/A"
              } | Status: ${task.status}`}
            />
            <IconButton onClick={() => handleStatusChange(task)}>
              {task.status === "pending" ? (
                <>
                  <Typography>Pending</Typography>
                  <Cancel color="error" />
                </>
              ) : (
                <>
                  <Typography>Completed</Typography>
                  <CheckCircle color="success" />
                </>
              )}
            </IconButton>
            <IconButton
              onClick={() => {
                setEditTask(task);
                setOpen(true);
              }}
            >
              <Edit color="primary" />
            </IconButton>
            <IconButton onClick={() => handleDeleteTask(task._id)}>
              <Delete color="action" />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        {editTask && (
          <Formik
            initialValues={editTask}
            validationSchema={validationSchema}
            onSubmit={handleEditTask}
          >
            {({ isSubmitting }) => (
              <Form>
                <DialogContent>
                  <Field
                    as={TextField}
                    label="Title"
                    name="title"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={<ErrorMessage name="title" />}
                    helperText={<ErrorMessage name="title" />}
                  />
                  <Field
                    as={TextField}
                    label="Description"
                    name="description"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={<ErrorMessage name="description" />}
                    helperText={<ErrorMessage name="description" />}
                  />
                  <Field
                    as={TextField}
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    error={<ErrorMessage name="dueDate" />}
                    helperText={<ErrorMessage name="dueDate" />}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpen(false)} color="secondary">
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" disabled={isSubmitting}>
                    Save
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        )}
      </Dialog>
    </Container>
  );
};

export default Dashboard;
