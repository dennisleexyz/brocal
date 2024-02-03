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
setTimeout(function() {
    let dailySchedule = document.querySelector("class-schedule").shadowRoot.querySelectorAll(".daily-schedule") 
    dailySchedule.forEach(day => {
        currentDay = day.querySelector("h4").innerText
        day.querySelectorAll(".course").forEach(course => {
            let courseName = course.querySelector(".info").querySelector("strong").innerText
            console.log(courseName)
            courses.forEach(program => {
                if(program.name == courseName) {
                    console.log("DUPLICATE")
                }
            })
            let prevCourseIndex = -1

            for(let i = 0; i < courses.length; i++) {
                if(courses[i].name == courseName) {
                    prevCourseIndex = i
                }
            }
            
            console.log(prevCourseIndex)
            //location = course.querySelector(".info").querySelector("a")
            //url = course.querySelector(".info").querySelector("a")
            let time = course.querySelector(".time").querySelector("p").innerText.split("\n")
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