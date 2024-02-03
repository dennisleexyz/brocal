console.log("Functioning")

let courses = []
/* {
            "name": "PLS 2030: Intro to Int'l Relations",
            "startDt": "2024-01-20",
            "endDt": "2024-05-10",
            "meetingTimeStart": "10:00",
            "meetingTimeEnd": "11:15",
            "location": "5 138",
            "url_address": "https%3A%2F%2Fwww.cpp.edu%2Fmaps%2F%3Fid%3D1130%23%21m%2F276183",
            "meetingPattern": "Monday,Wednesday",
} */

function findDuplicate(courses, courseName) {
    for(let i = 0; i < courses.length; i++) {
        if(courses[i].name == courseName) {
            return i
        }
    }
    return -1
}
setTimeout(function() {
    let dailySchedule = document.querySelector("class-schedule").shadowRoot.querySelectorAll(".daily-schedule") 
    dailySchedule.forEach(day => {
        currentDay = day.querySelector("h4").innerText
        day.querySelectorAll(".course").forEach(course => {
            let courseName = course.querySelector(".info").querySelector("strong").innerText
            let prevCourseIndex = findDuplicate(courses, courseName)
            //location = course.querySelector(".info").querySelector("a")
            //url = course.querySelector(".info").querySelector("a")
            let time = course.querySelector(".time").querySelector("p").innerText.split("\n")
            console.log(course.querySelector(".time").querySelector("p").innerText)
            if(prevCourseIndex != -1) {
                courses[prevCourseIndex].meetingPattern.push(currentDay)
            } else {
                newEntry = {
                    name: courseName,
                    startDt: "2024-01-20",
                    endDt: "2024-05-10",
                    meetingTimeStart: time[0],
                    meetingTimeEnd: time[1],
                    location: "location",
                    url_address: "url",
                    meetingPattern: [currentDay]
                }
                courses.push(newEntry)
            }
        })
    })
    console.log(courses)
  }, 5000);

  function getFinalsTimes() {
    let finalTimeFinder = new Map()
    let document
    var myHeaders = new Headers();

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    };
    
    meetPerWeek = 1
    fetch("https://www.cpp.edu/studentsuccess/academic-calendar/finals-week.shtml", requestOptions)
    .then(response => response.text())
    .then(result => {
        document = new DOMParser().parseFromString(result, 'text/html')
        let htmlElement = document.documentElement;
        let sections = htmlElement.querySelectorAll(".mt-4")
        //Returns card from all sections
        sections.forEach(section => {section.querySelectorAll(".card").forEach(card => {
                var regex = /[A-Z][a-z]{2}/g;
                let title = card.querySelector("button").innerText.trim()
                //Retrieves first three letters from the day and sets it as the key, if there are more than one day it joins it
                dayKey = title.match(regex).join("-")
                //Creates map for each day
                finalTimeFinder.set(dayKey, new Map())
                card.querySelectorAll("tr:not(:first-child)").forEach(row => {
                    let timeKey = row.querySelectorAll("td > p")[0].innerHTML.trim()
                    let finalExamDateTime = row.querySelectorAll("td > p")[1].innerHTML.trim() + " " + row.querySelectorAll("td > p")[2].innerHTML.trim()
                    finalTimeFinder.get(dayKey).set(timeKey, finalExamDateTime)
                })
                console.log()
            })
        })
        console.log(sections);
        console.log(finalTimeFinder)
    })
    .catch(error => console.log('error', error));

    
  }

  getFinalsTimes()