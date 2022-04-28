import React, { Component } from "react";
import Highcharts from "highcharts";

    
class MultiChoiceBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
          config: {},
        };
    }

    componentDidMount() {
        this.initailChart();
        this.props.setClick(this.exportMultiChoiceBarChart);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.data !== prevProps.data) {
            this.initailChart();
            }
        }

    initailChart = () => {
            Highcharts.chart("multiChoiceBarChart"+this.props.index, this.props.data);
    }


addZero = (data) => {
    if (data < 10) {
      data = "0" + data
    }
    return data;
  }
  
  formattedCSVFileDate = () => {
    let dateObj = new Date();
    let month = this.addZero(dateObj.getMonth() + 1);
    let year = dateObj.getFullYear();
    let date = this.addZero(dateObj.getDate());
    let hours = this.addZero(dateObj.getHours());
    let minutes = this.addZero(dateObj.getMinutes());
    return month + date + year;
  }
  

    exportMultiChoiceBarChart=()=>{
        let fileName=this.props.questionTitle.substring(0, 30)+"_"+this.formattedCSVFileDate();
        if(this.props.index  >= 0){
            let id="multiChoiceBarChart" + this.props.index;
            let chosenChart;
            Highcharts.charts.forEach(function(chart, index) {
                if(chart){
                    if (chart.renderTo.id === id) {
                        chosenChart = chart;
                        chosenChart.exportChart({
                            type: 'image/png',
                            filename: fileName,
                        }, {
                            plotOptions: {
                                series: {
                                    dataLabels: {
                                        formatter: function () {
                                            return  this.point.y.toFixed(1) + '% ';
                                        },
                                }
                            }
                            },
                            chart: { marginRight:850, },
                        });
                      }
                }               
              });              
        }
     }

    render() {
        const { data } = this.props;
        return (
        <>
        {data && 
                <div >
                <div id={"multiChoiceBarChart"+this.props.index} ></div>
            </div>
        } 
        </>
        )
    }
}



export default MultiChoiceBarChart;