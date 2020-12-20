const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

const readJson = fs.readFileSync('./data/series.json');
let data = JSON.parse(readJson);

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));

app.get('/', (req, res) => {
	const { filter } = req.query;
	let filterData = [];

	if (filter) {
		for (let dt of data) {
			if (
				dt.Name.toLowerCase() === filter.toLowerCase() ||
				dt.Email.toLowerCase() === filter.toLowerCase() ||
				dt.Mobile.toLowerCase() === filter.toLowerCase() ||
				dt.ID === parseFloat(filter)
			) {
				filterData.push(dt);
			}
		}
	}

	if (!filter) {
		filterData = data;
	}

	res.render('index', { data: filterData, filter });
});

app.get('/add', (req, res) => {
	res.render('add');
});

app.post('/add', (req, res) => {
	const { name, email , mobile } = req.body;

	data.push({ ID: data.length + 1, Name: name, Email: email , Mobile: mobile });
	fs.writeFileSync('./data/series.json', JSON.stringify(data, null, 4));
	res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
	const { id } = req.params;
	let dataId;

	for (let i = 0; i < data.length; i++) {
		if (Number(id) === data[i].ID) {
			dataId = i;
		}
	}

	res.render('edit', { data: data[dataId] });
});

app.post('/edit/:id', (req, res) => {
	const { id } = req.params;
	const { name, email , mobile } = req.body;

	let dataId;
	for (let i = 0; i < data.length; i++) {
		if (Number(id) === data[i].ID) {
			dataId = i;
		}
	}

	data[dataId].Name = name;
	data[dataId].Email = email;
	data[dataId].Mobile = mobile;

	fs.writeFileSync('./data/series.json', JSON.stringify(data, null, 4));
	res.redirect('/');
});

app.get('/delete/:id', (req, res) => {
	const { id } = req.params;

	const newData = [];
	for (let i = 0; i < data.length; i++) {
		if (Number(id) !== data[i].ID) {
			newData.push(data[i]);
		}
	}

	data = newData;
	fs.writeFileSync('./data/series.json', JSON.stringify(data, null, 4));
	res.redirect('/');
});

app.listen(port, () => console.log(`Running on port ${port}!`));
