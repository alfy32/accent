// ** Appointment  ** //

var Appointment = {
	id: "id String",
	employees: ["id", "id", ...],
	repeat: {
		days: ["day","day", ...],  // options ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
		end: "YYYY-MM-DD"
	} || false,
	date: "YYYY-MM-DD",
	time: "HH:MM",
	blocks: Number,
	client: "Name"
};

// ** Employee ** //

var Employee = {
	id: "id String",
	name: {
		first: "FIRST_NAME",
		last: "LAST_NAME",
	},
	phone: "###-###-####",
	address: "ADDRESS",
	city: "CITY",
	state: "STATE",
	zip: "ZIP"	
};

var ScheduleItem = {
	appointment: Appointment(),
	employee: "id",
	time: "HH:MM",
	label: "STRING USUALLY NAME",
	children: [ScheduleItem()] || false,
	child: boolean,
	taken: boolean,
	parent: {
		employee: "id",
		time: "HH:MM" 
	}
};
