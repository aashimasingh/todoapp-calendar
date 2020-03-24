import React, { Component, Fragment } from 'react';
import moment from 'moment';
import classes from '../../App.module.css';

import gql from 'graphql-tag';
import { Query , Mutation} from 'react-apollo';

const EVENT_QUERY = gql`
    query EventQuery($id:ID) {
        eventdet(id: $id) {
            event_date,
            event_description
        }
    }
`;

const ADD_EVENT = gql(`
    mutation AddEvent($event_date: String!, $event_description: String!) {
        addEvent(event_date: $event_date, event_description: $event_description) {
            event_date,
            event_description
        }
    }
`);

const ALL_EVENTS = gql(`
    query AllEvents {
        allevents {
            event_date,
            event_description
        }
    }
`);

class Calendar extends Component {
    weekdays = moment.weekdaysShort();
    state = {
        dateObj: moment(),
        everyMonth: moment.months(),
        showMonthSelector: false,
        showYearSelector: false
    }

    month = () => {
        return this.state.dateObj.format("MMMM")
    }

    year = () => {    
        return this.state.dateObj.format("Y");
    };

    setMonth = month => {
        let monthNo = this.state.everyMonth.indexOf(month);
        let dateObj = Object.assign({}, this.state.dateObj);
        dateObj = moment(dateObj).set("month", monthNo);
        this.setState({
          dateObj: dateObj,
          showMonthTable: !this.state.showMonthSelector,
          
        });
    };

    setYear = year => {
        let dateObj = Object.assign({}, this.state.dateObj);
        dateObj = moment(dateObj).set("year", year);
        this.setState({
          dateObj: dateObj
        });
    };

    getDates(startDate, stopDate) {
        var dateArray = [];
        var currentDate = moment(startDate);
        var stopDate = moment(stopDate);
        while (currentDate <= stopDate) {
          dateArray.push(moment(currentDate).format("YYYY"));
          currentDate = moment(currentDate).add(1, "year");
        }
        return dateArray;
    }

    MonthList = (props) => {
        let months = [];
        props.data.map(data => {
          months.push(
            <td
              key={data}
              className={classes.calendarMonth}
              onClick={e => {
                this.setMonth(data);
              }}
            >
              <span>{data}</span>
            </td>
          );
        });
        let rows = [];
        let cells = [];
    
        months.forEach((row, i) => {
          if (i % 3 !== 0 || i === 0) {
            cells.push(row);
          } else {
            rows.push(cells);
            cells = [];
            cells.push(row);
          }
        });
        rows.push(cells);
        let monthlist = rows.map((d, i) => {
          return <tr>{d}</tr>;
        });
    
        return (
          <table className={classes.calendarMonth}>
            <thead>
              <tr>
                <th colSpan="4">Select a Month</th>
              </tr>
            </thead>
            <tbody>{monthlist}</tbody>
          </table>
        );
    }

    YearList = props => {
        let months = [];
        let nextten = moment()
            .set("year", props)
            .add("year", 12)
            .format("Y");

        let tenyear = this.getDates(props, nextten);

        tenyear.map(data => {
            months.push(
            <td
            key={data}
            className={classes.calendarMonth}
            onClick={e => {
                this.setYear(data);
            }}
            >
                <span>{data}</span>
            </td>
        );
        });
        let rows = [];
        let cells = [];

        months.forEach((row, i) => {
            if (i % 3 !== 0 || i === 0) {
                cells.push(row);
            } else {
            rows.push(cells);
            cells = [];
            cells.push(row);
            }
        });
        rows.push(cells);
        let yearlist = rows.map((d, i) => {
        return <tr>{d}</tr>;
        });

        return (
            <table className={classes.calendarMonth}>
            <thead>
                <tr>
                    <th colSpan="4">Select a Year</th>
                </tr>
            </thead>
            <tbody>{yearlist}</tbody>
            </table>
        );
    };

    monthSelectorClicked = (e, month) => {
        this.setState({
            showMonthSelector: !this.state.showMonthSelector
        })
    }

    yearSelectorClicked = (e, year) => {
        this.setState({
            showYearSelector: !this.state.showYearSelector
        })
    }

    render() {
        let weekdayname = this.weekdays.map(day => {
            return (
            <th key={day}>
            {day}
            </th>
            );
        });

        let emptyspaces = []
        for (let i = 0; i < this.state.dateObj.startOf("month").format("d"); i++)
            emptyspaces.push(<td className={classes.emptyCell}>{""}</td>);
        
        let daysofamonth = []
        for (let i = 1; i <= this.state.dateObj.daysInMonth(); i++) {
            daysofamonth.push(
            <td>
                <Mutation mutation={ADD_EVENT}>
                    {(addEvent, { data }) => (
                        <div>
                        <form
                            onClick={e => {
                                e.preventDefault();
                                addEvent({ 
                                    variables: { 
                                        event_date: i.toString()+" "+this.month()+" "+this.year(),
                                        event_description: prompt("Enter the event description:")
                                },
                                 refetchQueries:
                                     [{ query: ALL_EVENTS,
                                         
                                     }]
                             });
                            }}
                        >
                            {i}
                        </form>
                        </div>
                    )}
                    </Mutation>
            </td>)
        }

        let totCells = [...emptyspaces, ...daysofamonth];
        let td = [];
        let tr = [];
        totCells.forEach((element, index) => {
            if (index % 7 !== 0) {
                td.push(element);
            } else {
                tr.push(td);
                td = []
                td.push(element);
            }
            if (index === totCells.length - 1)
                tr.push(td);
        });
        let daysOfAMonth = tr.map((val, i) => {
            return <tr>{val}
            </tr>;
        })

        return(
            <div className={classes.totContainer}>
            <div className={classes.calendarContainer}>
                <div className={classes.navbar}>
                    <p onClick={e => {this.monthSelectorClicked()}}>
                        {this.month()}
                    </p>
                </div>
                <div className={classes.calendarYear}>
                    <p onClick={e => {this.yearSelectorClicked()}}>
                        {this.year()}
                    </p>
                </div>
                <div className={classes.monthnav}>
                    {
                        this.state.showYearSelector &&
                        <this.YearList props={this.year()} />
                    }
                    {
                        this.state.showMonthSelector &&
                        <this.MonthList data={moment.months()} />
                    }
                </div>
                    <table className={classes.calendarTable}>
                        <thead>
                            <tr className={classes.dayHeader}>{weekdayname}</tr>
                        </thead>
                        <tbody className={classes.cellStyle}>{daysOfAMonth}</tbody>
                    </table>
            </div>
            <div className={classes.descriptionContainer}>
                <h2>Recently added events</h2>
                <Query query={ALL_EVENTS}>
                    {({ loading, error, data }) => {
                        if (loading) return "Loading...";
                        if (error) return `Error! ${error.message}`;
                        
                        let arr=[]
                        data.allevents.map(obj => {
                                arr.push(<li>{obj["event_date"] + ": " + obj["event_description"]}</li>)
                        }); 
                        return (
                            <ul>{arr}</ul>
                        )
                    }}
                </Query>
            </div>
            </div>
        );
    }
}

export default Calendar;