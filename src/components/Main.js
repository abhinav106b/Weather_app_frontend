import React,{Component} from "react";
import { Button, Input } from "reactstrap";
import axios from "axios";


class Main extends Component{
    constructor(props){
        super(props);
        this.state={
            city:null,
            tempArr:[1,2,3,4,5],
            currentWeather:[],
            fiveDayWeather:[],
            notFound:null,
            avg:null
        }
    }
    render(){
        const onClickRequest=()=>{
            if(this.state.city !== null){
                axios.post('http://192.168.0.159:3000/weather',{location:this.state.city})
                .then((response)=>{
                    if(response.status === 200){
                        this.setState({
                            currentWeather: response.data,
                            notFound: null
                        },()=>{
                            console.log("Current weather data ",this.state.currentWeather);
                        })
                    }
                })
                .catch((err)=> {
                    this.setState({
                        notFound: "Location not found",
                        currentWeather:[],
                        fiveDayWeather:[]
                    })
                });

                axios.post('http://192.168.0.159:3000/fiveDayWeather',{location:this.state.city})
                .then((response)=>{
                    if(response.status === 200){
                        this.setState({
                            fiveDayWeather: response.data
                            
                        },()=>{
                            console.log("Five day weather data ",this.state.fiveDayWeather);
                        })
                    }
                })
                .catch((err)=> {});
            }
            this.setState({
                city: null
            })
        }

        const onLocationChange=(event)=>{
            this.setState({
                city: event.target.value
            })
        }
        return(
            <div className="hg">
            <div className="container">
                <div className="row search">
                    <Input
                    className="searchBar"
                    id="location"
                    name="location"
                    type="text"
                    onChange={(event)=>{onLocationChange(event)}}
                    placeholder="Location" />
                    <Button size="sm" onClick={onClickRequest} className="searchBtn">Request</Button>
                </div>
                {this.state.notFound ? <p className="notfound">Location Not found</p>:<p></p>}
                {!this.state.currentWeather.main ? <div></div>:
                    <div className="row">
                        <div className="col-12 col-lg-6">
                            <div className="currentBox">
                                <div>
                                    {this.state.currentWeather.main ? <p className="txt1">{this.state.currentWeather.main.temp}°F</p>:null}
                                    {this.state.currentWeather.weather ? 
                                        <div>
                                            <p className="txt2">{this.state.currentWeather.weather[0].description}</p>
                                            <img src={`http://openweathermap.org/img/w/${this.state.currentWeather.weather[0].icon}.png`} />
                                        </div>:null}
                                </div>
                                <div className="mt-4">
                                    {this.state.currentWeather.main ? 
                                    <div>
                                        <div className="fl-left humidity">
                                            <p className="txt3">{this.state.currentWeather.main.humidity}%</p>
                                            <p className="txt4">Humidity</p>
                                        </div>
                                        <div className="fl-right feels-like">
                                            <p className="txt3">{this.state.currentWeather.main.feels_like}</p>
                                            <p className="txt4">Feels like</p>
                                        </div>
            
                                    </div>:null}
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6">
                            {this.state.fiveDayWeather.map((element,index)=>{
                                if(index<5){
                                    var d= new Date(element.dt*1000) //converting unix timestamp to milliseconds
                                    var dt = d.getDate()+"/"+(d.getMonth()+1) +'/'+d.getFullYear();
                                    if(element.weather){
                                        var iconId = element.weather[0].icon;
                                        console.log("icon id ",iconId)
                                    }
                                    return(
                                        <div className="dayBox">
                                            <div><p className="dt">{dt}</p></div>
                                            <div>{element.main ? <div><p className="temp1">{element.main.temp}°F</p><p className="temp2">Temp</p></div>:null}   </div>                         
                                            <div>{element.weather ? <img src={`http://openweathermap.org/img/w/${iconId}.png`} />:null}</div>
                                            <div>{element.weather ? <p className="txt5">{element.weather[0].description}</p>:null}</div>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                }
            </div>
            </div>
        );
    }
}
export default Main;