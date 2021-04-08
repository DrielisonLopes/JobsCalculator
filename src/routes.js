const express = require('express');
const routes = express.Router();

const views = __dirname + '/views/'

const Profile = {
    data: {
        name: 'Drielison Lopes',
        avatar: "https://avatars.githubusercontent.com/u/63027449?v=4",
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        "value-hour": 75
    },

    controllers: {
        index(req, res) {
            res.render(views + "profile", { profile: Profile.data })
        },

        update() {
            //req.body para pegar os dados
            const data = req.body

            //definir quantas semanas tem num ano:52
            const weeksPerYear = 52

            //remover as semanas de férias do ano, para pegar quantas semanas tem em 1 mês
            const weeksPerMonth = (weeksPerYear - data["vacartion-per-year"]) / 12

            //quantas horas na semana
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

            //horas trabalhadas no mês  
            const monthlyTotalHours = weekTotalHours * weeksPerMonth

            //qual será o valor da minha hora
            const valueHour = data["value-hour"] = data["monthly-budget"] / monthlyTotalHours

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour
            }

            return res.redirect('/profile')
        }
    }
}

const Job = {
    data: [],

    controllers: {
        index(req, res) {

                const updatedJobs = Job.data.map((job) => {
                    //ajustes no job
                    const remaining = Job.services.remainingDays(job)
                    const status = remaining <= 0 ? 'done' : 'progress'
            
                    return {
                        ...job,
                        remaining,
                        status,
                        budget: Profile.data["value-hour"] * job["total-hours"]
                    }
                })
            
                return res.render(views + "index", { jobs: updatedJobs })
        },

        create(req, res) {
            return res.render(views + "job")
        },

        save(req, res) {
            const lastId = Job.data[Job.data.length - 1]?.id || 1;
        
            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body[daily-hours],
                "total-hours": req.body[total-hours],
                created_at: Date.now() //atribuindo data de hoje
            })
            return res.redirect('/')
        }
    },

    services: {
        remainingDays(job) {
            //cálculo no tempo restante
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed(2)
        
            const createdDate = new Date(job.created_at)
            const dueDay = createdDate.getDate() + Number(remainingDays)
            const dueDateInMs = createdDate.setDate(dueDay)
        
            const timeDiffInMs = dueDateInMs - Date.now()
            // transform milliseconds in Days
            const dayInMs = 1000 * 60 * 60 * 24
            const dayDiff = Math.floor(timeDiffInMs / dayInMs)
        
            //restam x dias para finalizar seu projeto
            return dayDiff
        }
    }
}

routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/edit', (req, res) => res.render(views + "job-edit"))
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)

module.exports = routes;