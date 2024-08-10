import React, { useEffect, useState, useContext } from "react";
import UserContext from "../contexts/UserContext";
import { Link } from "react-router-dom";
import { Box, Typography, IconButton, Button, TextField, Select, MenuItem, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import dayjs from "dayjs";
import global from "../global";
import http from "../http";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import TaskRecommendations from '../components/TaskRecommendations';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bannerImage from "../assets/images/Picture1.png";
import AddActivity from './AddActivity';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Trackers() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [trackerList, setTrackerList] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [goal, setGoal] = useState(1000); // State for goal
  const [goalType, setGoalType] = useState("monthly"); // State for goal type
  const [tempGoal, setTempGoal] = useState(goal); // Temporary state for goal during editing
  const [tempGoalType, setTempGoalType] = useState(goalType); // Temporary state for goal type during editing
  const [openEditDialog, setOpenEditDialog] = useState(false); // State for edit dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [activities, setActivities] = useState([]);
  const [activityPoints, setActivityPoints] = useState('');
  const [co2Data, setCo2Data] = useState([]);
  const [improvement, setImprovement] = useState(0); // State for improvement from last month
  const tasks = [
    { title: 'Complete project report' },
    { title: 'Prepare for meeting' },
    { title: 'Update client on progress' },
  ];

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const getTrackers = () => {
    if (goalType == "monthly") {
      http.get("/tracker/month").then((res) => {
        console.log(res.data);
        setTrackerList(res.data);
      });
    }
    else if (goalType == "weekly") {
      http.get("/tracker/w").then((res) => {
        console.log(res.data);
        setTrackerList(res.data);
      });
    }
  };

  const getUserGoal = () => {
    http.get(`/user/${user.id}`).then((res) => {
      setGoal(res.data.goals || 1000);
      setGoalType(res.data.goaltype || "monthly");
    }).catch(err => {
      console.error("Failed to fetch user goal:", err);
    });
  };

  const getImprovementFromLastMonth = () => {
    http.get("/tracker/improvement").then((res) => {
      setImprovement(res.data.improvement);
    }).catch(err => {
      console.error("Failed to fetch improvement data:", err);
    });
  };

  useEffect(() => {
    getTrackers();
    getUserGoal();
    getImprovementFromLastMonth();
    http.get('/activities').then((res) => {
      setActivities(res.data);
    });
    http.get("/tracker/monthly-co2").then((res) => {
      setCo2Data(res.data);
      console.log(res.data);
    }).catch(err => {
      console.error("Failed to fetch CO2 data:", err);
    });
  }, []);

  const co2ChartData = {
    labels: co2Data.map(data => data.month),
    datasets: [{
      label: 'CO2 Saved (g)',
      data: co2Data.map(data => data.co2Saved),
      backgroundColor: 'rgba(90, 152, 149, 0.7)',
      borderColor: 'rgba(90, 152, 149, 1)',
      borderWidth: 1,
    }],
  };
  const co2ChartOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false // You can set this to true if you want a legend
      }
    },
    maintainAspectRatio: false
  };

  const [open, setOpen] = useState(false);
  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenEditDialog = () => {
    setTempGoal(goal);
    setTempGoalType(goalType);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleGoalChange = () => {
    const updatedGoal = parseInt(tempGoal, 10);
    if (!isNaN(updatedGoal) && (tempGoalType === "monthly" || tempGoalType === "weekly")) {
      http.put(`user/settracker/${user.id}`, { goals: updatedGoal, goaltype: tempGoalType }).then(() => {
        setGoal(updatedGoal);
        setGoalType(tempGoalType);
        handleCloseEditDialog();
        toast.success("Goal updated successfully");
      }).catch(err => {
        toast.error("Failed to update goal");
        console.error("Error updating goal:", err);
      });
    } else {
      toast.error("Invalid goal or goal type");
    }
  };

  const deleteActivity = () => {
    if (selectedId) {
      http.delete(`/tracker/${selectedId}`).then((res) => {
        console.log(res.data);
        setTrackerList(
          trackerList.filter((tracker) => tracker.id !== selectedId)
        );
        handleClose();
      });
    }
  };

  const userTrackers = trackerList.filter(tracker => user && user.id === tracker.userId);
  const totalPoints = userTrackers.reduce(
    (total, tracker) => total + tracker.points,
    0
  );
  const remainingPoints = Math.max(goal - totalPoints, 0);
  const data = {
    labels: ["Co2 Saved", "Remaining"],
    datasets: [
      {
        data: [Math.min(totalPoints, goal), remainingPoints],
        backgroundColor: ["#5A9895", "#f5f5f5"],
        hoverBackgroundColor: ["#4A7B7A", "#e0e0e0"],
      },
    ],
  };

  const getCurrentPeriod = () => {
    if (goalType === "monthly") {
      return `Month of ${dayjs().format("MMMM YYYY")}`;
    } else {
      const startOfWeek = dayjs().startOf('week');
      const endOfWeek = dayjs().endOf('week');
      return `Week of ${startOfWeek.format("DD MMM")} - ${endOfWeek.format("DD MMM YYYY")}`;
    }
  };

  // To get the completion percentage
  const getCompletionPercentage = () => {
    const percentage = (totalPoints / goal) * 100;
    return percentage.toFixed(0); // Rounded to whole number
  };

  // Text for CO2 saving
  const co2SavingText = `Save 500g of CO2 every ${goalType.charAt(0).toUpperCase() + goalType.slice(1)}`;

  const addActivity = (newActivity) => {
    setTrackerList((prevList) => [...prevList, newActivity]);
    // Optionally, update CO2 data or any other relevant state here
  };


  return (
    <Box sx={{ p: 2 }}>
      <Box
        component="img"
        src={bannerImage}
        alt="Banner"
        sx={{
          width: "100%",
          height: "auto",
          display: "block",
          mb: 2,
        }}
      />
      <Typography variant="h5" sx={{ my: 2 }}>
        Tracker
      </Typography>

      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Box
          sx={{
            width: "400px",
            height: "80vh",
            maxHeight: "80vh",
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "8px",
            p: 3,
            ml: 8,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Co2 Saved
          </Typography>
          <Typography
            variant="h4"
            sx={{ mb: 2, textAlign: "center", color: "#5A9895" }}
          >
            {totalPoints}/{goal}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Doughnut data={data} />
          </Box>
          <Typography variant="subtitle1" sx={{ mt: 2, textAlign: "center", color: "#5A9895" }}>
            Save {goal}g of CO2 {goalType.charAt(0).toUpperCase() + goalType.slice(1)}
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 1, textAlign: "center", color: "textSecondary" }}>
            {getCompletionPercentage()}% Completed - {getCurrentPeriod()}
          </Typography>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleOpenEditDialog}
            >
              Edit Goal
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: "400px",
            height: "80vh",
            maxHeight: "80vh",
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "8px",
            p: 3,
            mr: 8,
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              mb: 2,
              bgcolor: "#f5f5f5",
              p: 1,
              borderRadius: "4px",
            }}
          >
            <Typography variant="body1" sx={{ width: "30%" }}>
              Date
            </Typography>
            <Typography variant="body1" sx={{ width: "50%" }}>
              Activity
            </Typography>
            <Typography variant="body1" sx={{ width: "20%" }}>
              Co2/g
            </Typography>
          </Box>
          {
            trackerList.length === 0 ? (
              <Typography sx={{ textAlign: "center", color: "gray" }}>
                No Recorded activities
              </Typography>
            ) : (
              trackerList.map((tracker) => (
                user && user.id === tracker.userId && (
                  <Box
                    key={tracker.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 2,
                      px: 1,
                      bgcolor: "#fff",
                      borderBottom: "1px solid #ddd",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                      position: "relative"
                    }}
                    onMouseEnter={() => setHoveredId(tracker.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <Typography variant="body2" sx={{ width: "30%" }}>
                      {formatDate(tracker.date)}
                    </Typography>
                    <Typography variant="body2" sx={{ width: "55%" }}>
                      {tracker.title}
                    </Typography>
                    <Typography variant="body2" sx={{ width: "15%" }}>
                      {tracker.points}g
                    </Typography>
                    {hoveredId === tracker.id && (
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          right: 25,
                          color: "red",
                        }}
                        onClick={() => handleOpen(tracker.id)}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                )
              ))
            )
          }
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Delete Activity</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this activity?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="inherit" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={deleteActivity}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          {/* Add button */}
          <Box sx={{ position: "absolute", bottom: 16, right: 16 }}>
            <Button onClick={handleOpenAddDialog} color="primary"><Add></Add></Button>
            <AddActivity open={openAddDialog} handleClose={handleCloseAddDialog} activities={activities} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 7, width: '80%' }}>
        <Box sx={{ width: '100%', p: 3, border: '1px solid #ccc', borderRadius: '8px', position: 'relative', display: "column" }}>
          <Typography variant="h6" sx={{ position: 'absolute', top: 16, right: 16 }}>
            Total CO2 Saved: {totalPoints}g
          </Typography>
          <Box sx={{ height: '500px', width: '60%'}}>
            <Bar data={co2ChartData} options={co2ChartOptions} />
          </Box>
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'textSecondary' }}>
            You have saved {improvement}g more CO2 compared to last month
          </Typography>
        </Box>
      </Box>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Goal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a new value for the goal and select the goal type.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Goal"
            type="number"
            fullWidth
            value={tempGoal}
            onChange={(e) => setTempGoal(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="goal-type-label">Goal Type</InputLabel>
            <Select
              labelId="goal-type-label"
              id="goal-type-select"
              value={tempGoalType}
              label="Goal Type"
              onChange={(e) => setTempGoalType(e.target.value)}
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleGoalChange} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <TaskRecommendations tasks={tasks} />
      <ToastContainer />
    </Box>
  );
}

export default Trackers;
