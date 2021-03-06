import React, { Component } from 'react'
import { Button, InputGroup, FormControl } from 'react-bootstrap'
import { Table} from 'antd';
import './bg.css';
import { compile } from 'mathjs';
import d3 from "d3";

window.d3 = d3;

const functionPlot = require("function-plot");

var dataInTable = [],answ;
const columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "Y",
        dataIndex: "y",
        key: "y"
    },
    {
        title: "Error",
        dataIndex: "e",
        key: "e"
    }
];
class Secant extends Component {
    constructor() {
        super();
        this.state = {
            fx: '',
            xi: 0,
            xii:0,
            showTable: false,
            showG: false,
            InputG: true
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });

    }
    fx(X) {
        var expr = compile(this.state.fx);
        var scope = { x: parseFloat(X) };

        return expr.evaluate(scope);
    }

    ShowFunc() {
        functionPlot({
            target: '#Graph',
            width: 725,
            height: 400,
            padding: "20px 200px 200px",
            tip: {
                renderer: function () { }
            },
            grid: true,
            data: [
                {
                    fn: this.state.fx, color: 'red'
                }
                
            ],
            annotations: [{
                x: answ,
                color: 'black',
                text: 'answer = '+ answ.toFixed(6)
              }]
        
        });

    }
    Secant() {
    
        var er= parseFloat(0.000000);
        var x = [];
        var y;
        var iter=0;
        var dat = [];
        x.push(this.state.xi);
        x.push(this.state.xii);
        dataInTable.push({
            iteration : iter,
            y : this.state.xi
        })
        do{ 
            iter++;
            y =  x[iter] - (this.fx(x[iter])*((x[iter]-x[iter-1])))/(this.fx(x[iter])-this.fx(x[iter-1]));
            x.push(y);
            er = Math.abs((y - x[iter])/y);
            dat[iter]=er;
            dataInTable.push({
                iteration : iter + 1,
                y : y.toFixed(8),
                e : er.toFixed(8)
            })
            if(dat[iter]===dat[iter-1]){
                break;
            }
            
        }while(er.toFixed(8)>0.000001);
        answ = x[iter];
        this.setState({
            showTable: true,
            showG: true,
            InputG:false
        })
    }
    render() {
        return (
            <div className="Secant">
                <h1>Secant Method</h1>
                <div style={{ padding: "50px 200px 200px" }} id = "Graph">
                    {this.state.InputG && <div>
                        <InputGroup size="lg" >
                            <InputGroup.Prepend >
                                <InputGroup.Text id="inputGroup-sizing-lg" >F(x)</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" name="fx" placeholder=" " value={this.state.fx} onChange={this.handleChange} />
                        </InputGroup>
                        <br />
                        <InputGroup size="lg" >
                            <InputGroup.Prepend >
                                <InputGroup.Text id="inputGroup-sizing-lg" >X0</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" name="xi" placeholder=" " onChange={this.handleChange} />
                        </InputGroup>
                        <br />
                        <InputGroup size="lg" >
                            <InputGroup.Prepend >
                                <InputGroup.Text id="inputGroup-sizing-lg" >X1</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" name="xii" placeholder=" " onChange={this.handleChange} />
                        </InputGroup>
                        <br />

                        <Button variant="outline-primary" onClick={() => this.Secant(parseFloat(this.state.xi),parseFloat(this.state.xii))}>Submit</Button>
                        <br /><br />
                    </div>}
                    {this.state.showG && <div style={{backgroundColor:"White"}}>
                    <h1>function is {this.state.fx}</h1>
                        {this.ShowFunc()}</div>
                        
                    }
                    {this.state.showTable &&
                        <Table columns={columns} dataSource={dataInTable} pagination={{ pageSize: 10 }} scroll={{ y: 340 }} />

                    }
                </div>
            </div>
        );
    }



}


export default Secant;