import React, { useState, useEffect } from "react";
import Select from "react-select";
import { AgGridReact } from "ag-grid-react";
import {Link} from 'react-router-dom';
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

function getData() {
  const url = "http://131.181.190.87:3001/all";

  return fetch(url)
    .then((res) => res.json())
    .catch((e) => {
      console.log(e);
    });
}

function Table(props) {
  const [allData, setAllData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const searchSymbol = props.searchSymbol;
  const selectedIndustry = props.selectedIndustry.value;

  const columnDefs = [
    { headerName: "Symbol", field: "symbol", width:400, cellRendererFramework: (params) => {
        return <Link to={`/history?code=${params.value}`}>{params.value}</Link>
        
    }}, 
    { headerName: "Name", field: "name", width:400},
    { headerName: "Industry", field: "industry", width:400},
  ];

  useEffect(() => {
    if (allData.length === 0) {
      getData()
        .then((resInJson) =>
          resInJson.map((tableData) => {
            return {
              symbol: tableData.symbol,
              name: tableData.name,
              industry: tableData.industry,
            };
          })
        ) 
        .then((allDataArray) => {
          setAllData(allDataArray);
          setRowData(allDataArray);
        });
    } else {
      const rowData = allData.filter((data) => {
        if (data.symbol.includes(searchSymbol.toUpperCase()) && selectedIndustry === "All") { 
            return {
                symbol: data.symbol,
                name: data.name,
                industry: data.industry,
              }
            
            } else if(data.symbol.includes(searchSymbol.toUpperCase()) && data.industry === selectedIndustry){
                return {
                    symbol: data.symbol,
                    name: data.name,
                    industry: data.industry,
                }
            }
          });
          setRowData(rowData);
          
        }
  }, [searchSymbol, selectedIndustry]);

  return (
    <div
      className="ag-theme-alpine"
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
  );
}

function SearchBar(props) {
  const [searchParam, setSearchParam] = useState("");

  const options = [
    { value: "All", label: "All" },
    { value: "Consumer Discretionary", label: "Consumer Discretionary" },
    { value: "Consumer Staples", label: "Consumer Staples" },
    { value: "Energy", label: "Energy" },
    { value: "Financials", label: "Financials" },
    { value: "Health Care", label: "Health Care" },
    { value: "Industrials", label: "Industrials" },
    { value: "Information Technology", label: "Information Technology" },
    { value: "Materials", label: "Materials" },
    { value: "Real Estate", label: "Real Estate" },
    {value: "Telecommunication Services", label: "Telecommunication Services" },
    { value: "Utilities", label: "Utilities" },
  ];

  return (
    <div className="container__searchBar">
      <div className="container__searchStock">
        <label>Select stock<br/></label>
        <input
          type="text"
          name="stockSearch"
          id="stockSearch"
          value={searchParam}
          onChange={(e) => {
            setSearchParam(e.target.value);
          }}
        />
        <button
          type="search"
          className="search--Btn"
          onClick={(e) => {
            props.setSearchSymbol(searchParam);
          }}
        >
          Search
        </button>
      </div>
      <div className="container__searchIndustry">
        <label>Industry<br/></label>
        <Select
          value={props.selectedIndustry}
          onChange={(value) => {
              props.setSelectedIndustry(value);
          }}
          options={options}
        />
      </div>
    </div>
  );
}

function Stock() {
  const [searchSymbol, setSearchSymbol] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState({value: "All", label: "All" });

  return (
    <div className="stock">
      <SearchBar setSearchSymbol={setSearchSymbol} selectedIndustry={selectedIndustry} setSelectedIndustry={setSelectedIndustry} />
      <Table className="container__stockTable" searchSymbol={searchSymbol} selectedIndustry={selectedIndustry}/>
    </div>
  );
}

export default Stock;
