import React from "react";
import MyTasks from "./MyTasks";
import HouseholdTasks from "./HouseholdTasks";
import CompletedTasks from "./CompletedTasks";
import { Switch, Route } from "react-router-dom";
import { getTasksByHousehold } from "../services/tasks";

class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      isLoading: false,
      household_id: 1,
      currentUser: 2,
    };
  }

 populateTasks = async () => {
    this.setState({ isLoading: true });
    const {household_id } = this.state;
    try{
      this.setState({
        tasks: await getTasksByHousehold(household_id),
        isLoading: false,
      })
    }catch(error){
      console.log(error);
    }
    console.log("populated tasks")
  }


  async componentDidMount() {
    await this.populateTasks();
    console.log("mounted")
  }

 
  render() {
    const { tasks, 
      /* isLoading, noTasks,  */
      currentUser, household_id } = this.state;
      console.log({tasks})
    const myTasks = tasks.filter((task) => task.assigned_to === currentUser && task.status === "open");
    const householdTasks = tasks.filter( (task) => task.household_id === household_id && (task.status === "open" || task.status === "pending"));
    const completedTasks = tasks.filter( (task) => task.status === "completed");
    console.log({myTasks, householdTasks, completedTasks})
    return (
      <div>
        <h1>Tasks {this.props.match.path}</h1>
        <div>
          <button onClick={() => this.props.history.push(`${this.props.match.url}`)}>
            My Tasks
          </button>
          <button onClick={() => this.props.history.push(`${this.props.match.url}/householdtasks`)}>
            Household Tasks
          </button>
          <button onClick={() => this.props.history.push(`${this.props.match.url}/completedtasks`)}>
            Completed Tasks
          </button>
        </div>
        
        <Switch>
          <Route exact path={`${this.props.match.path}/`} render={routeProps => <MyTasks {...routeProps} tasks={myTasks} populateTasks={this.populateTasks} />} />
          <Route exact path={`${this.props.match.path}/householdtasks`} render={routeProps => <HouseholdTasks {...routeProps} tasks={householdTasks} populateTasks={this.populateTasks}/>} />
          <Route exact path={`${this.props.match.path}/completedtasks`} render={routeProps => <CompletedTasks {...routeProps} tasks={completedTasks} populateTasks={this.populateTasks}/>} />
        </Switch>
      </div>
    );
  }
}


export default Tasks;