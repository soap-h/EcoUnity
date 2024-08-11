import React, { useEffect, useState, useContext } from "react";
import UserContext from "../contexts/UserContext";
import { Box, Typography, IconButton, Button, TextField, Select, MenuItem, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import dayjs from "dayjs";
import http from "../http";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bannerImage from "../assets/images/Picture1.png";
import AddActivity from './AddActivity';
import Confetti from 'react-confetti';  // Importing react-confetti
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
  const [goal, setGoal] = useState(1000);
  const [goalType, setGoalType] = useState("monthly");
  const [tempGoal, setTempGoal] = useState(goal);
  const [tempGoalType, setTempGoalType] = useState(goalType);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [activities, setActivities] = useState([]);
  const [co2Data, setCo2Data] = useState([]);
  const [improvement, setImprovement] = useState(0);
  const [goalHit, setGoalHit] = useState(false); // State to check if goal is hit

  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const getTrackers = () => {
    if (goalType === "monthly") {
      http.get("/tracker/month").then((res) => {
        setTrackerList(res.data);
      });
    } else if (goalType === "weekly") {
      http.get("/tracker/w").then((res) => {
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

  const getCo2Data = () => {
    http.get("/tracker/monthly-co2").then((res) => {
      setCo2Data(res.data);
    }).catch(err => {
      console.error("Failed to fetch CO2 data:", err);
    });
  };


  useEffect(() => {
    getTrackers();
    getUserGoal();
    getImprovementFromLastMonth();
    http.get('/activities').then((res) => {
      setActivities(res.data);
    });
    getCo2Data();
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
      y: { beginAtZero: true }
    },
    plugins: { legend: { display: false } },
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
      http.delete(`/tracker/${selectedId}`).then(() => {
        setTrackerList(trackerList.filter((tracker) => tracker.id !== selectedId));
        handleClose();
      });
    }
  };

  const userTrackers = trackerList.filter(tracker => user && user.id === tracker.userId);
  const totalPoints = userTrackers.reduce((total, tracker) => total + tracker.points, 0);
  const remainingPoints = Math.max(goal - totalPoints, 0);


  useEffect(() => {
    console.log('Total Points:', totalPoints, 'Goal:', goal, 'Goal Hit:', goalHit);
    if (totalPoints >= goal && !goalHit) {
      setGoalHit(true);
      toast.success("You hit your goal!");

      const timeout = setTimeout(() => {
        setGoalHit(false);
        console.log("Finish!")
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [totalPoints, goal, goalHit]);



  const data = {
    labels: ["CO2 Saved", "Remaining"],
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

  const getCompletionPercentage = () => {
    const percentage = (totalPoints / goal) * 100;
    return percentage.toFixed(0);
  };

  const addActivity = (newActivity) => {
    setTrackerList((prevList) => [...prevList, newActivity]);
    getTrackers();
    getCo2Data();
  };

  return (
    <Box sx={{ p: 4, bgcolor: "#f4f6f8", minHeight: "100vh", position: "relative" }}>
      {goalHit && <Confetti width={window.innerWidth} height={window.innerHeight * 2} />}

      <Box
        component="img"
        src={bannerImage}
        alt="Banner"
        sx={{
          width: "100%",
          height: "auto",
          display: "block",
          mb: 3,
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      />
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "#333" }}>
        Tracker
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
        <Box
          sx={{
            flex: "1 1 45%",
            height: "80vh",
            overflow: "hidden",
            border: "1px solid #ddd",
            borderRadius: "8px",
            p: 4,
            bgcolor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold", color: "#5A9895" }}>
            CO2 Saved
          </Typography>
          <Typography
            variant="h3"
            sx={{ mb: 3, textAlign: "center", color: "#5A9895", fontWeight: "bold" }}
          >
            {totalPoints}/{goal}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              mb: 3,
              height: "300px",
              width: "300px",
              margin: "0 auto",
            }}
          >
            <Doughnut
              data={data}
              options={{
                maintainAspectRatio: false,
              }}
            />
          </Box>

          <Typography variant="subtitle1" sx={{ textAlign: "center", color: "#5A9895" }}>
            Save {goal}g of CO2 {goalType.charAt(0).toUpperCase() + goalType.slice(1)}
          </Typography>
          <Typography variant="subtitle2" sx={{ mt: 1, textAlign: "center", color: "#777" }}>
            {getCompletionPercentage()}% Completed - {getCurrentPeriod()}
          </Typography>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={handleOpenEditDialog}
              sx={{ bgcolor: "#5A9895", "&:hover": { bgcolor: "#497c7a" } }}
            >
              Edit Goal
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            flex: "1 1 45%",
            height: "80vh",
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: "8px",
            p: 4,
            bgcolor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
              p: 1,
              bgcolor: "#f9f9f9",
              borderRadius: "8px",
              fontWeight: "bold",
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "#eee",  // Ensure it's visible
            }}
          >
            <Typography variant="body1" sx={{ width: "30%", color: "#333" }}>
              Date
            </Typography>
            <Typography variant="body1" sx={{ width: "50%", color: "#333" }}>
              Activity
            </Typography>
            <Typography variant="body1" sx={{ width: "20%", color: "#333" }}>
              CO2/g
            </Typography>
          </Box>
          {trackerList.length === 0 ? (
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
                    borderRadius: "4px",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    position: "relative",
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
          )}
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ fontWeight: "bold" }}>Delete Activity</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this activity?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="inherit" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={deleteActivity}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Box sx={{ position: "sticky", bottom: 16, right: 16, zIndex: 1, textAlign: 'right' }}> {/* Sticky add button */}
            <Button onClick={handleOpenAddDialog} color="primary" sx={{backgroundColor: '#eee'}}><Add /></Button>
            <AddActivity open={openAddDialog} handleClose={handleCloseAddDialog} activities={activities} onActivityAdded={addActivity} />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 7, width: '100%' }}>
        <Box
          sx={{
            width: '80%',
            p: 4,
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            bgcolor: "#fff",
            position: 'relative',
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Typography variant="h6" sx={{ position: 'absolute', top: 16, right: 16, fontWeight: "bold", color: "#5A9895" }}>
            Total CO2 Saved: {totalPoints}g
          </Typography>
          <Box sx={{ height: '500px', width: '100%' }}>
            <Bar data={co2ChartData} options={co2ChartOptions} />
          </Box>
          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: '#777' }}>
            You have saved {improvement}g more CO2 compared to last month
          </Typography>
        </Box>
      </Box>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Edit Goal</DialogTitle>
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
          <Button onClick={handleGoalChange} sx={{ bgcolor: "#5A9895", "&:hover": { bgcolor: "#497c7a" } }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
}

export default Trackers;
