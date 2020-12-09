//zmienne, stałe

var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000;

var path = require("path")

var bodyParser = require("body-parser");
const { table } = require("console");
app.use(bodyParser.urlencoded({ extended: true }));

var users = [
    { id: 1, log: "AAA", pass: "PASS1", wiek: 10, uczen: "yes", plec: "m" },
    { id: 2, log: "majcia", pass: "12345", wiek: 18, uczen: "no", plec: "k" },
    { id: 3, log: "majcia1", pass: "12345", wiek: 16, uczen: "no", plec: "k" },
    { id: 4, log: "majcia2", pass: "12345", wiek: 14, uczen: "no", plec: "m" },
]

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/main.html"))
})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/register.html"))
})

var id = 2

app.post("/register", function (req, res) {
    if (req.body.login == "" || req.body.password == "" || req.body.plec === undefined) {
        res.send("Wypełnij wszystkie pola!")
        return
    }
    let present = false
    for (let i = 0; i < users.length; i++) {
        if (users[i].log == req.body.login) {
            present = true
        }
    }
    if (present == false) {
        res.send("Witaj " + req.body.login + ", jesteś zarejsetrowany")
        if (req.body.student != "yes") {
            req.body.student = "no"
        }
        users.push({ id: id++, log: req.body.login, pass: req.body.password, wiek: req.body.age, uczen: req.body.student, plec: req.body.plec })
    } else {
        res.send("Ten login już istnieje.")
    }
    console.log(users)
})

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/login.html"))
})

let logged = false

app.post("/login", function (req, res) {
    for (let i = 0; i < users.length; i++) {
        if (req.body.login == users[i].log && req.body.password == users[i].pass) {
            logged = true
            res.redirect("/admin")
            return
        }
    }
    res.send("Zły login lub hasło.")
})

app.get("/admin", function (req, res) {
    if (logged == false) {
        res.sendFile(path.join(__dirname + "/static/pages/brak.html"))
        return
    }
    res.sendFile(path.join(__dirname + "/static/pages/admin.html"))

})

function tabelka(table, keys = ["id", "log", "pass", "wiek", "uczen", "plec"]) {

    result = '<table>'

    for (let x = 0; x < table.length; x++) {
        row = '<tr>'
        for (let y = 0; y < Object.keys(table[x]).length; y++) {
            if (keys.includes(Object.keys(table[x])[y])) {
                if (Object.keys(table[x])[y] == "uczen") {
                    checked = ""
                    if (Object.values(table[x])[y] == "yes")
                        checked = "checked"
                    row += '<td>' + Object.keys(table[x])[y] + ': ' + '<input type="checkbox" disabled ' + checked + '>' + '</td>'
                } else
                    row += '<td>' + Object.keys(table[x])[y] + ': ' + Object.values(table[x])[y] + '</td>'
            }
        }
        result += row + '</tr>'
    }

    return result + '</table>'
}

linki = '<div class="bottom"><ul id="ulAdminLogged"><li><a href="/sort">sort</a> </li><li><a href="/gender">gender</a> </li><li><a href="/show">show</a> </li></ul></div>'

app.get("/show", function (req, res) {
    if (logged == false) {
        res.sendFile(path.join(__dirname + "/static/pages/brak.html"))
        return
    }
    res.send('<link rel="stylesheet" href="../css/style2.css"><body>' + linki + tabelka(users) + '</body>')
})
app.get("/gender", function (req, res) {
    if (logged == false) {
        res.sendFile(path.join(__dirname + "/static/pages/brak.html"))
        return
    }
    tablicaM = users.filter(function (user) {
        return user.plec == "m"
    })
    tablicaK = users.filter(function (user) {
        return user.plec == "k"
    })
    res.send('<link rel="stylesheet" href="../css/style2.css"><style>td{width: 50%;}</style><body>' + linki + tabelka(tablicaM, ["id", "plec"]) + tabelka(tablicaK, ["id", "plec"]) + '</body>')
})

app.get("/sort", sort)

app.post("/sort", sort)


function sort(req, res) {
    let rosnaco
    if (req.body.sort == "down") {
        rosnaco = false
    } else {
        rosnaco = true
    }

    if (logged == false) {
        res.sendFile(path.join(__dirname + "/static/pages/brak.html"))
        return
    }
    let tablica,
    /*Never gonna give you*/ up
    /*Never gonna*/ let /*you*/ down
    if (rosnaco == true) {
        tablica = users.sort(function (a, b) {
            return parseFloat(a.wiek) - parseFloat(b.wiek);
        })
        up = "checked"
    } else {
        tablica = users.sort(function (a, b) {
            return parseFloat(b.wiek) - parseFloat(a.wiek);
        })
        down = "checked"
    }
    res.send('<body><link rel="stylesheet" href="../css/style2.css">' + linki + '<form onchange="this.submit()" method="POST"><input type="radio" name="sort" value="up"' + up + '><label for="up">rosnąco</label><input type="radio" name="sort" value="down"' + down + '><label for="down">malejąco</label></form>' + tabelka(tablica, ["id", "log", "pass", "wiek"]) + '</body>')
}
app.use(express.static('static'))

//nasłuch na określonym porcie

app.listen(PORT, function () {
    console.log("to jest start serwera na porcie " + PORT)
})

