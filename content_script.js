let courses = []
let finalTimeFinder = getFinalsTimes()
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

setTimeout(async () => {
    let schedule = parse()
    //iterates through schedule and adds final exam date
    for (let i = 0; i < schedule.length; i++) {
        //preprocessing dates for final exam map
        let timeStart = schedule[i].meetingTimeStart.replace(/^0+/, "").toUpperCase();
        let timeEnd = schedule[i].meetingTimeEnd.replace(/^0+/, "").toUpperCase();

        let timeKey = timeStart + " - " + timeEnd
        let dateKey = schedule[i].meetingPattern.map(date => date.substring(0,2)).join("-")

        schedule[i].finalExamDate = finalTimeFinder.get(dateKey).get(timeKey)
    }

    filename = 'brocal.ics'
    text = ics(schedule)

    var element = document.createElement('a')
    element.setAttribute(
        'href',
        'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    )
    element.setAttribute('download', filename)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
}, 5000);

function findDuplicate(courses, courseName) {
    for(let i = 0; i < courses.length; i++) {
        if(courses[i].name == courseName) {
            return i
        }
    }
    return -1
}

function parse() {
    let dailySchedule = document.querySelector("class-schedule").shadowRoot.querySelectorAll(".daily-schedule") 
    dailySchedule.forEach(day => {
        currentDay = day.querySelector("h4").innerText
        day.querySelectorAll(".course").forEach(course => {
            let courseName = course.querySelector(".info").querySelector("strong").innerText.trim()
            let prevCourseIndex = findDuplicate(courses, courseName)
            //Currently query selecting clicks link for a tag
            //location = course.querySelector(".info").querySelector("a")
            //url = course.querySelector(".info").querySelector("a")
            let time = course.querySelector(".time").querySelector("p").innerText.split(/\n|\s{2,}/).map(s => s.trim())
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
                    meetingPattern: [currentDay],
                    finalExamDate: null
                }
                courses.push(newEntry)
            }
        })
    })
    return courses
}

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
                var regex = /[A-Z][a-z]{1}/g;
                let title = card.querySelector("button").innerText.trim()
                //Retrieves first three letters from the day and sets it as the key, if there are more than one day it joins it
                dayKey = title.match(regex).join("-")
                //Creates map for each day
                finalTimeFinder.set(dayKey, new Map())
                card.querySelectorAll("tr:not(:first-child)").forEach(row => {
                    let timeKey = row.querySelectorAll("td > p")[0].innerHTML.trim().padStart(5, "0")
                    let finalExamDateTime = row.querySelectorAll("td > p")[1].innerHTML.replace(/\([^()]*\)/g, '').trim() + " " + row.querySelectorAll("td > p")[2].innerHTML.trim()
                    finalTimeFinder.get(dayKey).set(timeKey, finalExamDateTime)
                })
            })
        })
        console.log(sections);
        console.log(finalTimeFinder)
    })
    .catch(error => console.log('error', error));

    return finalTimeFinder
}

function t24 (ampm) {
  let t24 = parseInt(ampm.match(/\d{1,2}:\d{2}/)[0].replaceAll(':', ''))
  if (ampm.search(/pm/i) > -1) t24 += 1200
  else if (t24 >= 1200) t24 -= 1200
  return t24.toString().padStart(4, '0')
}

function yyyymmdd (date) {
  return (
    date.getUTCFullYear() +
    (date.getUTCMonth() + 1).toString().padStart(2, '0') +
    date.getUTCDate().toString().padStart(2, '0')
  )
}

function ics (courses) {
  ics = 'BEGIN:VCALENDAR\n'

  courses.forEach(e => {
    startDt = new Date(e.startDt)
    endDt = new Date(e.endDt)
    meetingTimeStart = t24(e.meetingTimeStart)
    meetingTimeEnd = t24(e.meetingTimeEnd)
    meetingPattern = e.meetingPattern.map(e => e.substring(0, 2).toUpperCase())

    ics += 'BEGIN:VEVENT\n'
    ics += `SUMMARY:${e.name}\n`
    ics += `RRULE:FREQ=WEEKLY;BYDAY=${meetingPattern.join()};UNTIL=${yyyymmdd(endDt)}\n`
    ics += `DTSTART;TZID=America/Los_Angeles:${yyyymmdd(startDt)}T${meetingTimeStart}00\n`
    ics += `DTEND;TZID=America/Los_Angeles:${yyyymmdd(startDt)}T${meetingTimeEnd}00\n`
    ics += `DESCRIPTION:${e.name}\n`
    ics += 'END:VEVENT\n'

    if (!e.finalExamDate) return

    let [finalStart, finalEnd] = e.finalExamDate.match(/\d{1,2}:\d{2}\W[ap]m/gi).map(e => t24(e))

    ics += 'BEGIN:VEVENT\n'
    ics += `SUMMARY:${e.name}\n`
    ics += `DTSTART;TZID=America/Los_Angeles:${yyyymmdd(endDt)}T${finalStart}00\n`
    ics += `DTEND;TZID=America/Los_Angeles:${yyyymmdd(endDt)}T${finalEnd}00\n`
    ics += `DESCRIPTION:${e.name}\n`
    ics += 'END:VEVENT\n'
  })

  ics += 'END:VCALENDAR\n'

  return ics
}
