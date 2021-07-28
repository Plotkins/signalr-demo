import { useEffect, useRef, useState } from 'react';
import * as signalR from "@microsoft/signalr";
import './App.css';
import { FormControl,
  FormLabel,
  Radio,
  FormControlLabel,
  RadioGroup,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Button,
  Box
} from '@material-ui/core';

function App() {
  const [projects, setProjects] = useState([]);
  const [connectionHub, setConnectionHub] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(null);

  const [selectedProject, setSelectedProject] = useState(null);

  const onTaskAddedRef = useRef((message) => {
    setTasks(tasks => [ ...tasks, message]);
  });
  
  useEffect(() => {
    fetchProjects();
    establishConnection();
  }, []);

  useEffect(() => {
    if(connectionHub)
      subscribeTo("AddTask", onTaskAddedRef.current);
    return () => {
      if(connectionHub)
        unsubscribeFrom("AddTask", onTaskAddedRef.current);
    }
  }, [connectionHub]);

  useEffect(() => {
    if (selectedProject)
      joinGroup(selectedProject);
    return () => {
      if (selectedProject)
        leaveGroup(selectedProject);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    var result = [];
    let response = await fetch("https://localhost:44300/Project", {
      method: "get",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (response?.ok) {
      result = await response.json();
      setProjects(result);
    }
  };

  const establishConnection = async () => {
    try {
      let connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:44300/hub")
        .configureLogging(signalR.LogLevel.Information)
        .build();
      await connection.start();
      console.log(`Connection state: ${connection.state}`);
      setConnectionHub(connection)
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const subscribeTo = (target, callback) => {
    connectionHub?.on(target, callback);
  };

  const unsubscribeFrom = (target, callback) => {
    connectionHub?.off(target, callback);
  };

  const joinGroup = (group) => {
    connectionHub?.send(
      "JoinGroup",
      group
    );
  };

  const leaveGroup = (group) => {
    connectionHub?.send(
      "LeaveGroup",
      group
    );
  }

  const selectProject = event => {
    setSelectedProject(event.target.value);
    setTasks([]);
    setNewTask(null);
  };

  const changeNewTask = event => {
    setNewTask(event.target.value);
  };

  const addTask = async () => {
    try {
      console.log(`${selectedProject} ${newTask}`);
      var request = {
        project: selectedProject,
        task: newTask
      };
      await fetch("https://localhost:44300/Project", {
      method: "post",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(request)
    });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <div className="container">
      <FormControl component="fieldset">
        <FormLabel component="legend">Project</FormLabel>
        <RadioGroup aria-label="project" name="project" onChange={selectProject}>
        {projects.map(p => (
                <FormControlLabel value={p} control={<Radio />} label={p} />
                ))
            } 
        </RadioGroup>
      </FormControl>
      <Divider />
      {selectedProject && (<>
        <p>{selectedProject}</p>
        <form>
          Add a new task
          <TextField style={{padding: "10px"}} hintText="Task name" onChange={changeNewTask} />
          <Button disabled={!newTask} onClick={addTask}>Add</Button>
        </form>
      <Divider />
        Tasks for selected project
        <List>
          {tasks.map(t => (
            <ListItem >
              <ListItemText style={{textAlign: "center"}} primary={t} />
            </ListItem>
          ))}
        </List>
      </>)}
      </div>
    </div>
  );
}

export default App;
