import React, { useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Link,
    useLocation
} from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Line } from 'react-chartjs-2';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function getData(code) {
    const url= `http://131.181.190.87:3001/history?symbol=${code}`;
    
    return fetch(url)
    .then((res) => res.json())
    .catch((e) => {
        console.log(e);
    });
} 

function Chart(props) {
    const label = props.allHistory.slice().reverse().map((data) => {
        return data.date;
    })

    const dataClose = props.allHistory.slice().reverse().map((data) => {
        return data.close;
    })
    
    const data = {
        type: "line",
        labels: label,
        datasets: [
            {
            label: 'Closing Price',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: dataClose
            }
        ]
    };

    return (
        <Line data={data} />
    );
}

function History(props){
    let query = useQuery()
    const value = query.get("code");

    const columnDefs = [
        { headerName:"Date", field:"date"},
        { headerName:"Open", field:"open"},
        { headerName: "High", field: "high"},
        { headerName: "Low", field: "low" },
        { headerName: "Close", field: "close" },
        { headerName: "Volumes", field: "volumes" }
    ];
    const [rowData, setRowData] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [allHistory, setAllHistory] = useState([]);

    useEffect(() => {
        if(allHistory.length === 0){
            getData(value)
            .then(res => res.map((data) => {
                return {
                    date: data.timestamp.substring(0, 10),
                    open: data.open,
                    high: data.high,
                    low: data.low,
                    close: data.close,
                    volumes: data.volumes
                }
            }))
            .then((allDataArray) => {
                setRowData(allDataArray);
                setAllHistory(allDataArray);
            })
        } else{
            const rowData = allHistory.filter((data) => {
                if(new Date(data.date).getTime() >= startDate.getTime()) { 
                    return { 
                        date: data.date,
                        open:data.open, 
                        high:data.high,
                        low: data.low,
                        close: data.close
                    }
                }
            });
            setRowData(rowData);
        }

    },[startDate]);


    return (
        <div>
            <div className="container__datePicker">
                <label>Search date from<br/></label>
                <DatePicker
                dateFormat="yyyy-MM-dd"
                selected={startDate}
                onChange={date => {
                    setStartDate(date);
                    }}
                />

            </div>
            <div className="ag-theme-alpine"
                style={{ height: "600px", width: "1200px" }}
            >
                <AgGridReact 
                    columnDefs = {columnDefs} 
                    rowData = {rowData}
                    pagination = {true}
                    paginationPageSize = {100}
                >
                </AgGridReact>
            </div>
            <div className="container__chart">
                <Chart allHistory={rowData}/>
            </div>
        </div>
    )
}


export default History;