const osu = require('node-os-utils');
const cpu = osu.cpu;
const drive = osu.drive;
const mem = osu.mem;
const rp = require("request-promise");
const config = require("./config.json");
const moment = require("moment");

async function run(){
	try{
		let total_cpu = cpu.count();
		let usage_cpu = await cpu.usage(5000);
		const disk = await drive.info();
		let mem_info = await mem.info();
		await rp({
			uri: `${config.server}/api/listen/resources`,
			method: "PUT",
			body: {
				total_cpu: total_cpu,
				usage_cpu_percentage: usage_cpu,
				total_disk: disk.totalGb,
				usage_disk: disk.usedGb,
				total_memory: mem_info.totalMemMb,
				usage_memory: mem_info.usedMemMb,
				ip: osu.os.ip(),
				name: osu.os.hostname(),
				type: config.type
			},
			json: true
		})
		console.log("Update Done", moment().utcOffset(+7).format("HH:mm:ss YYYY-MM-DD"))
	}
	catch(e){
		console.log(e.message);
	}
}

async function setIntervalAndExecute(fn, t) {
	console.log("Start send resource of system");
    await fn();
    return(setInterval(fn, t));
}

setIntervalAndExecute(run, 5 * 60 * 1000)
